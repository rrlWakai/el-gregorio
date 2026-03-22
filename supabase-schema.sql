-- ============================================================
-- EL GREGORIO FARM RESORT - SAFE SUPABASE SQL SCHEMA
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  capacity_min INT NOT NULL DEFAULT 1,
  capacity_max INT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  nights INT NOT NULL CHECK (nights > 0),
  check_out_date DATE NOT NULL,
  guests INT NOT NULL CHECK (guests > 0),
  special_requests TEXT,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending', 'Confirmed', 'Checked-in', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add missing column safely
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;

-- Resort Settings
CREATE TABLE IF NOT EXISTS resort_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reservations_room_id ON reservations(room_id);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservations(check_in_date);
CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservations(check_out_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_reference ON reservations(reference_code);
CREATE INDEX IF NOT EXISTS idx_rooms_slug ON rooms(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='update_rooms_updated_at') THEN
    CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='update_reservations_updated_at') THEN
    CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='update_reviews_updated_at') THEN
    CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

-- Room availability function
CREATE OR REPLACE FUNCTION check_room_availability(
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_exclude_reservation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INT;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM reservations
  WHERE room_id = p_room_id
    AND status != 'Cancelled'
    AND (p_exclude_reservation_id IS NULL OR id != p_exclude_reservation_id)
    AND (check_in_date < p_check_out AND check_out_date > p_check_in);

  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE resort_settings ENABLE ROW LEVEL SECURITY;

-- Drop policies first (safe for re-run)
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS rooms_public_read ON rooms;
DROP POLICY IF EXISTS rooms_admin_all ON rooms;
DROP POLICY IF EXISTS reservations_public_insert ON reservations;
DROP POLICY IF EXISTS reservations_admin_all ON reservations;
DROP POLICY IF EXISTS reservations_public_read_own ON reservations;
DROP POLICY IF EXISTS reviews_public_read ON reviews;
DROP POLICY IF EXISTS reviews_admin_all ON reviews;
DROP POLICY IF EXISTS settings_admin_all ON resort_settings;

-- Re-create policies
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "rooms_public_read" ON rooms
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "rooms_admin_all" ON rooms
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "reservations_public_insert" ON reservations
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "reservations_admin_all" ON reservations
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "reservations_public_read_own" ON reservations
  FOR SELECT USING (TRUE);

CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "settings_admin_all" ON resort_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA (idempotent)
-- ============================================================

-- Rooms
INSERT INTO rooms (name, slug, description, capacity_min, capacity_max, base_price, image_url, amenities, is_active)
SELECT * FROM (VALUES
  ('Family Room','family-room','Spacious and comfortable room perfect for families. Features air-conditioning and comfortable beds that accommodate the whole family for a restful stay.',6,8,4500,'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',ARRAY['Air-conditioning','Comfortable beds','Private bathroom','WiFi'],TRUE),
  ('Couple Room','couple-room','An intimate retreat for couples featuring a private bathroom and stunning garden views. Ideal for a romantic getaway or honeymoon escape.',2,3,2500,'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',ARRAY['Private bathroom','Garden view','Air-conditioning','WiFi'],TRUE),
  ('Group Villa','group-villa','Our largest accommodation perfect for group gatherings, team buildings, and celebrations. Features a fully equipped kitchen area and direct pool access.',10,15,7500,'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',ARRAY['Kitchen area','Pool access','Air-conditioning','WiFi','Living area'],TRUE)
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE slug = tmp.slug);

-- Reviews
INSERT INTO reviews (guest_name,rating,review_text,is_visible,sort_order)
SELECT * FROM (VALUES
  ('Maria Santos',5,'We had a great family outing here. The place is peaceful and the pool is clean. The kids loved it and we will definitely come back!',TRUE,1),
  ('John Ramirez',5,'Perfect place for team building. The staff were very accommodating and the facilities were excellent. Highly recommend for corporate events.',TRUE,2),
  ('Angela Cruz',5,'We celebrated a birthday here and the environment was very refreshing. The farm atmosphere made it extra special. Wonderful experience!',TRUE,3)
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE guest_name = tmp.guest_name AND review_text = tmp.review_text);

-- Resort settings
INSERT INTO resort_settings (key,value)
SELECT * FROM (VALUES
  ('resort_name','El Gregorio Farm Resort'),
  ('contact_phone','0928-958-7391'),
  ('contact_email','elgregoriofarmresort@gmail.com'),
  ('address','Janopol Occidental, Tanauan City, Batangas'),
  ('check_in_time','2:00 PM'),
  ('check_out_time','12:00 PM')
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM resort_settings WHERE key = tmp.key);