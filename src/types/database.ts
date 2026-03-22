// ============================================================
// DATABASE TYPES - Generated from Supabase schema
// ============================================================

export type ReservationStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked-in'
  | 'Completed'
  | 'Cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  capacity_min: number;
  capacity_max: number;
  base_price: number;
  image_url: string | null;
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  reference_code: string;
  full_name: string;
  contact_number: string;
  email: string;
  room_id: string;
  check_in_date: string;
  nights: number;
  check_out_date: string;
  guests: number;
  special_requests: string | null;
  total_price: number;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
  room?: Room;
}

export interface Review {
  id: string;
  guest_name: string;
  avatar_url: string | null;
  rating: number;
  review_text: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ResortSetting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// FORM TYPES
// ============================================================

export interface BookingFormData {
  full_name: string;
  contact_number: string;
  email: string;
  check_in_date: string;
  nights: number;
  guests: number;
  room_id: string;
  special_requests: string;
}

export interface RoomFormData {
  name: string;
  slug: string;
  description: string;
  capacity_min: number;
  capacity_max: number;
  base_price: number;
  image_url: string;
  amenities: string[];
  is_active: boolean;
}

export interface ReviewFormData {
  guest_name: string;
  avatar_url: string;
  rating: number;
  review_text: string;
  is_visible: boolean;
  sort_order: number;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface AvailabilityResult {
  available: boolean;
  message: string;
}

// ============================================================
// DASHBOARD TYPES
// ============================================================

export interface DashboardStats {
  total_reservations: number;
  pending_reservations: number;
  confirmed_reservations: number;
  total_revenue: number;
  checkin_today: number;
}

export interface CalendarReservation {
  id: string;
  reference_code: string;
  full_name: string;
  room_name: string;
  check_in_date: string;
  check_out_date: string;
  status: ReservationStatus;
  total_price: number;
}
