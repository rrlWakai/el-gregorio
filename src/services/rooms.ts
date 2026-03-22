import { supabase } from '@/lib/supabase';
import type { Room, RoomFormData, ApiResponse } from '@/types';

export const roomsService = {
  async getActiveRooms(): Promise<ApiResponse<Room[]>> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_active', true)
      .order('base_price', { ascending: true });

    return {
      data: data as Room[] | null,
      error: error?.message ?? null,
    };
  },

  async getAllRooms(): Promise<ApiResponse<Room[]>> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    return {
      data: data as Room[] | null,
      error: error?.message ?? null,
    };
  },

  async getRoomById(id: string): Promise<ApiResponse<Room>> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    return {
      data: data as Room | null,
      error: error?.message ?? null,
    };
  },

  async createRoom(formData: RoomFormData): Promise<ApiResponse<Room>> {
    const { data, error } = await supabase
      .from('rooms')
      .insert([formData])
      .select()
      .single();

    return {
      data: data as Room | null,
      error: error?.message ?? null,
    };
  },

  async updateRoom(
    id: string,
    updates: Partial<RoomFormData>
  ): Promise<ApiResponse<Room>> {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return {
      data: data as Room | null,
      error: error?.message ?? null,
    };
  },

  async toggleRoomActive(id: string, isActive: boolean): Promise<ApiResponse<Room>> {
    const { data, error } = await supabase
      .from('rooms')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    return {
      data: data as Room | null,
      error: error?.message ?? null,
    };
  },

  async deleteRoom(id: string): Promise<ApiResponse<null>> {
    const { error } = await supabase.from('rooms').delete().eq('id', id);

    return {
      data: null,
      error: error?.message ?? null,
    };
  },
};
