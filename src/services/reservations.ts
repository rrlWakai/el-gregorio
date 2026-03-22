import { supabase } from '@/lib/supabase';
import type {
  Reservation,
  BookingFormData,
  ApiResponse,
  AvailabilityResult,
  ReservationStatus,
  DashboardStats,
} from '@/types';
import { generateReferenceCode, addDays, computeTotalPrice } from '@/utils/helpers';

export const reservationsService = {
  async checkAvailability(
    roomId: string,
    checkInDate: string,
    nights: number,
    excludeId?: string
  ): Promise<AvailabilityResult> {
    const checkOutDate = addDays(checkInDate, nights);

    const { data, error } = await supabase.rpc('check_room_availability', {
      p_room_id: roomId,
      p_check_in: checkInDate,
      p_check_out: checkOutDate,
      p_exclude_reservation_id: excludeId ?? null,
    });

    if (error) {
      return { available: false, message: 'Error checking availability.' };
    }

    return {
      available: data as boolean,
      message: (data as boolean)
        ? 'Room is available for your selected dates.'
        : 'Room is not available for your selected dates. Please choose different dates.',
    };
  },

  async createReservation(
    formData: BookingFormData,
    basePrice: number
  ): Promise<ApiResponse<Reservation>> {
    const availability = await this.checkAvailability(
      formData.room_id,
      formData.check_in_date,
      formData.nights
    );

    if (!availability.available) {
      return { data: null, error: availability.message };
    }

    const checkOutDate = addDays(formData.check_in_date, formData.nights);
    const totalPrice = computeTotalPrice(basePrice, formData.nights);
    const referenceCode = generateReferenceCode();

    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          reference_code: referenceCode,
          full_name: formData.full_name,
          contact_number: formData.contact_number,
          email: formData.email,
          room_id: formData.room_id,
          check_in_date: formData.check_in_date,
          nights: formData.nights,
          check_out_date: checkOutDate,
          guests: formData.guests,
          special_requests: formData.special_requests || null,
          total_price: totalPrice,
          status: 'Pending',
        },
      ])
      .select('*, room:rooms(*)')
      .single();

    return {
      data: data as Reservation | null,
      error: error?.message ?? null,
    };
  },

  async getAllReservations(filters?: {
    status?: ReservationStatus;
    room_id?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<Reservation[]>> {
    let query = supabase
      .from('reservations')
      .select('*, room:rooms(id, name, slug, base_price, image_url)')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.room_id) {
      query = query.eq('room_id', filters.room_id);
    }
    if (filters?.search) {
      query = query.ilike('full_name', `%${filters.search}%`);
    }
    if (filters?.date_from) {
      query = query.gte('check_in_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('check_in_date', filters.date_to);
    }

    const { data, error } = await query;

    return {
      data: data as Reservation[] | null,
      error: error?.message ?? null,
    };
  },

  async getReservationByReference(
    referenceCode: string
  ): Promise<ApiResponse<Reservation>> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, room:rooms(*)')
      .eq('reference_code', referenceCode)
      .single();

    return {
      data: data as Reservation | null,
      error: error?.message ?? null,
    };
  },

  async updateStatus(
    id: string,
    status: ReservationStatus
  ): Promise<ApiResponse<Reservation>> {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select('*, room:rooms(*)')
      .single();

    return {
      data: data as Reservation | null,
      error: error?.message ?? null,
    };
  },

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('reservations')
      .select('status, total_price, check_in_date');

    if (error || !data) {
      return { data: null, error: error?.message ?? 'Failed to load stats' };
    }

    const stats: DashboardStats = {
      total_reservations: data.length,
      pending_reservations: data.filter((r) => r.status === 'Pending').length,
      confirmed_reservations: data.filter((r) => r.status === 'Confirmed').length,
      total_revenue: data
        .filter((r) => r.status !== 'Cancelled')
        .reduce((sum, r) => sum + Number(r.total_price), 0),
      checkin_today: data.filter((r) => r.check_in_date === today).length,
    };

    return { data: stats, error: null };
  },

  async getReservationsForCalendar(
    year: number,
    month: number
  ): Promise<ApiResponse<Reservation[]>> {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('reservations')
      .select('*, room:rooms(id, name)')
      .or(
        `and(check_in_date.lte.${endDate},check_out_date.gte.${startDate})`
      )
      .neq('status', 'Cancelled')
      .order('check_in_date');

    return {
      data: data as Reservation[] | null,
      error: error?.message ?? null,
    };
  },
};
