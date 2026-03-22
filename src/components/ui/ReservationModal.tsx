import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Calendar, BedDouble, Users, MessageSquare } from 'lucide-react';
import type { Reservation, ReservationStatus } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/utils/helpers';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS: ReservationStatus[] = [
  'Pending',
  'Confirmed',
  'Checked-in',
  'Completed',
  'Cancelled',
];

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ReservationStatus) => Promise<void>;
  updating: boolean;
}

export default function ReservationModal({
  reservation,
  onClose,
  onStatusChange,
  updating,
}: Props) {
  if (!reservation) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg 
                     max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="font-heading text-lg text-gray-900">Reservation Details</h2>
              <p className="font-body text-xs text-gray-400 mt-0.5">
                Ref: {reservation.reference_code}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 
                         transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Status + change */}
            <div className="flex items-center justify-between">
              <StatusBadge status={reservation.status} />
              <select
                value={reservation.status}
                onChange={(e) =>
                  onStatusChange(reservation.id, e.target.value as ReservationStatus)
                }
                disabled={updating}
                className="text-xs font-body border border-gray-200 rounded-lg px-3 py-1.5 
                           bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 
                           disabled:opacity-60 cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Guest info */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: User, label: 'Guest Name', value: reservation.full_name },
                { icon: Phone, label: 'Contact', value: reservation.contact_number },
                { icon: Mail, label: 'Email', value: reservation.email },
                {
                  icon: BedDouble,
                  label: 'Room',
                  value: reservation.room?.name ?? reservation.room_id,
                },
                {
                  icon: Calendar,
                  label: 'Check-in',
                  value: formatDate(reservation.check_in_date),
                },
                {
                  icon: Calendar,
                  label: 'Check-out',
                  value: formatDate(reservation.check_out_date),
                },
                { icon: Calendar, label: 'Nights', value: `${reservation.nights} night(s)` },
                {
                  icon: Users,
                  label: 'Guests',
                  value: `${reservation.guests} guest(s)`,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-2.5 border-b border-gray-50">
                  <item.icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 flex justify-between items-start">
                    <span className="font-body text-xs text-gray-400">{item.label}</span>
                    <span className="font-body text-sm text-gray-800 font-medium text-right">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}

              {/* Total price */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-body text-sm font-semibold text-gray-700">Total Price</span>
                <span className="font-heading text-xl text-primary font-bold">
                  {formatPrice(reservation.total_price)}
                </span>
              </div>
            </div>

            {/* Special requests */}
            {reservation.special_requests && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-1.5">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="font-body text-xs font-semibold text-gray-500">
                    Special Requests
                  </span>
                </div>
                <p className="font-body text-sm text-gray-700 leading-relaxed pl-6">
                  {reservation.special_requests}
                </p>
              </div>
            )}

            {/* Created at */}
            <p className="font-body text-xs text-gray-400 text-center">
              Created: {formatDateTime(reservation.created_at)}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
