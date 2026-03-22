import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Users,
  BedDouble,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  Facebook,
  Instagram,
} from "lucide-react";
import { roomsService } from "@/services/rooms";
import { reservationsService } from "@/services/reservations";
import { useAvailability } from "@/hooks/useAvailability";
import type { Room, BookingFormData } from "@/types";
import {
  formatPrice,
  computeTotalPrice,
  addDays,
  getMinCheckInDate,
} from "@/utils/helpers";

interface FormState extends BookingFormData {
  [key: string]: string | number;
}

const initialForm: FormState = {
  full_name: "",
  contact_number: "",
  email: "",
  check_in_date: "",
  nights: 1,
  guests: 1,
  room_id: "",
  special_requests: "",
};

export default function ReservationSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    refCode: string;
    totalPrice: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { availability, checking, checkAvailability } = useAvailability();

  useEffect(() => {
    roomsService.getActiveRooms().then(({ data }) => {
      if (data) setRooms(data);
    });
  }, []);

  const selectedRoom = rooms.find((r) => r.id === form.room_id);

  const totalPrice = selectedRoom
    ? computeTotalPrice(selectedRoom.base_price, Number(form.nights))
    : 0;

  const checkOutDate =
    form.check_in_date && form.nights
      ? addDays(form.check_in_date, Number(form.nights))
      : "";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);

    // Auto-check availability when room/date/nights change
    if (name === "room_id" || name === "check_in_date" || name === "nights") {
      const roomId = name === "room_id" ? value : form.room_id;
      const checkIn = name === "check_in_date" ? value : form.check_in_date;
      const nights = name === "nights" ? Number(value) : Number(form.nights);
      if (roomId && checkIn && nights >= 1) {
        checkAvailability(roomId, checkIn, nights);
      }
    }
  };

  const validate = (): string | null => {
    if (!form.full_name.trim()) return "Full name is required.";
    if (!form.contact_number.trim()) return "Contact number is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "A valid email address is required.";
    if (!form.check_in_date) return "Please select a check-in date.";
    if (Number(form.nights) < 1) return "Number of nights must be at least 1.";
    if (Number(form.guests) < 1) return "Number of guests must be at least 1.";
    if (!form.room_id) return "Please select a room.";
    if (selectedRoom && Number(form.guests) > selectedRoom.capacity_max)
      return `This room accommodates a maximum of ${selectedRoom.capacity_max} guests.`;
    if (availability && !availability.available) return availability.message;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedRoom) return;

    setSubmitting(true);
    setError(null);

    const { data, error: apiError } =
      await reservationsService.createReservation(
        form as BookingFormData,
        selectedRoom.base_price,
      );

    setSubmitting(false);

    if (apiError || !data) {
      setError(apiError ?? "Booking failed. Please try again.");
      return;
    }

    setSuccess({ refCode: data.reference_code, totalPrice: data.total_price });
    setForm(initialForm);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block bg-primary/10 text-primary px-4 py-1.5 
                           rounded-full font-body text-sm font-medium mb-4"
          >
            Book Your Stay
          </span>
          <h2 className="section-title mb-4">Make a Reservation</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Fill in the form below and we will confirm your booking. No payment
            required online.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="font-heading text-2xl text-gray-900 mb-2">
                Contact Information
              </h3>
              <p className="font-body text-gray-500 text-sm leading-relaxed">
                Have questions? Reach out to us before making a reservation.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-bg">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-gray-400 mb-0.5">
                    Phone
                  </p>
                  <p className="font-body text-sm font-semibold text-gray-800">
                    0928-958-7391
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-bg">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-gray-400 mb-0.5">
                    Address
                  </p>
                  <p className="font-body text-sm font-semibold text-gray-800">
                    Janopol Occidental, Tanauan City, Batangas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-bg">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-gray-400 mb-0.5">
                    Check-in / Check-out
                  </p>
                  <p className="font-body text-sm font-semibold text-gray-800">
                    2:00 PM &mdash; 12:00 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-3">Follow Us</p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/elgregoriofarmresort/"
                  className="w-10 h-10 flex items-center justify-center rounded-xl 
                               bg-primary/10 text-primary hover:bg-primary hover:text-white 
                               transition-all hover:-translate-y-1"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                <a
                  href="https://www.instagram.com/elgregoriofarm?igsh=ZmdtbzlsenUybnUy"
                  className="w-10 h-10 flex items-center justify-center rounded-xl 
                               bg-primary/10 text-primary hover:bg-primary hover:text-white 
                               transition-all hover:-translate-y-1"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <a
                  href="elgregoriofarmresort@gmail.com"
                  className="w-10 h-10 flex items-center justify-center rounded-xl 
                               bg-primary/10 text-primary hover:bg-primary hover:text-white 
                               transition-all hover:-translate-y-1"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Price preview */}
            {selectedRoom && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-primary/5 border border-primary/15"
              >
                <p className="font-body text-xs text-gray-500 mb-3">
                  Price Summary
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between font-body text-sm text-gray-700">
                    <span>{selectedRoom.name}</span>
                    <span>{formatPrice(selectedRoom.base_price)} / night</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-gray-700">
                    <span>Nights</span>
                    <span>{form.nights}</span>
                  </div>
                  {checkOutDate && (
                    <div className="flex justify-between font-body text-sm text-gray-700">
                      <span>Check-out</span>
                      <span>{checkOutDate}</span>
                    </div>
                  )}
                  <div className="border-t border-primary/15 pt-2 mt-2 flex justify-between">
                    <span className="font-body text-sm font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="font-heading text-lg text-primary font-bold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center 
                           py-16 px-8 bg-bg rounded-3xl border-2 border-primary/20"
              >
                <div
                  className="w-20 h-20 bg-primary/10 rounded-full flex items-center 
                                justify-center mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-2xl text-gray-900 mb-3">
                  Reservation Submitted!
                </h3>
                <p className="font-body text-gray-500 text-sm mb-6 max-w-sm leading-relaxed">
                  Your reservation has been received. We will contact you
                  shortly to confirm.
                </p>
                <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 mb-6">
                  <p className="font-body text-xs text-gray-400 mb-1">
                    Reference Code
                  </p>
                  <p className="font-heading text-xl text-primary font-bold tracking-wider">
                    {success.refCode}
                  </p>
                  <p className="font-body text-sm text-gray-600 mt-1">
                    Total: <strong>{formatPrice(success.totalPrice)}</strong>
                  </p>
                </div>
                <p className="font-body text-xs text-gray-400">
                  Please save your reference code for tracking.
                </p>
                <button
                  onClick={() => setSuccess(null)}
                  className="mt-6 text-primary font-body text-sm font-medium 
                             hover:underline transition-all"
                >
                  Make another reservation
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-bg rounded-3xl p-8 space-y-5"
              >
                {/* Full name */}
                <div>
                  <label className="label-text">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Juan dela Cruz"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Contact + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-text">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="contact_number"
                        value={form.contact_number}
                        onChange={handleChange}
                        placeholder="09XX-XXX-XXXX"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="juan@email.com"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Room selection */}
                <div>
                  <label className="label-text">Room Selection</label>
                  <div className="relative">
                    <BedDouble className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      name="room_id"
                      value={form.room_id}
                      onChange={handleChange}
                      className="input-field pl-10 appearance-none cursor-pointer"
                    >
                      <option value="">Select a room</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} &mdash; {formatPrice(room.base_price)} /
                          night
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date + Nights + Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="label-text">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        name="check_in_date"
                        value={form.check_in_date}
                        min={getMinCheckInDate()}
                        onChange={handleChange}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Number of Nights</label>
                    <input
                      type="number"
                      name="nights"
                      value={form.nights}
                      min={1}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-text">Number of Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        name="guests"
                        value={form.guests}
                        min={1}
                        onChange={handleChange}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability indicator */}
                {checking && (
                  <div className="flex items-center gap-2 text-gray-500 font-body text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking availability...
                  </div>
                )}
                {availability && !checking && (
                  <div
                    className={`flex items-start gap-2 text-sm font-body px-4 py-3 rounded-xl border ${
                      availability.available
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {availability.available ? (
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    {availability.message}
                  </div>
                )}

                {/* Special requests */}
                <div>
                  <label className="label-text">
                    Special Requests (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      name="special_requests"
                      value={form.special_requests}
                      onChange={handleChange}
                      placeholder="Any special requests or notes..."
                      rows={3}
                      className="input-field pl-10 resize-none"
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    className="flex items-start gap-2 text-sm font-body text-red-700 
                                  bg-red-50 border border-red-200 px-4 py-3 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-body 
                             font-semibold text-base hover:bg-primary-600 active:bg-primary-700 
                             transition-all duration-200 shadow-sm hover:shadow-md 
                             disabled:opacity-60 disabled:cursor-not-allowed flex items-center 
                             justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Book Reservation"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
