import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, RefreshCw, Eye } from 'lucide-react';
import { reservationsService } from '@/services/reservations';
import { roomsService } from '@/services/rooms';
import type { Reservation, ReservationStatus, Room } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/utils/helpers';
import StatusBadge from '@/components/ui/StatusBadge';
import ReservationModal from '@/components/ui/ReservationModal';

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Checked-in', label: 'Checked-in' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadReservations = useCallback(async () => {
    setLoading(true);
    const { data } = await reservationsService.getAllReservations({
      status: statusFilter as ReservationStatus | undefined,
      room_id: roomFilter || undefined,
      search: search || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
    if (data) setReservations(data);
    setLoading(false);
  }, [statusFilter, roomFilter, search, dateFrom, dateTo]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  useEffect(() => {
    roomsService.getAllRooms().then(({ data }) => {
      if (data) setRooms(data);
    });
  }, []);

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    setUpdating(true);
    const { data } = await reservationsService.updateStatus(id, status);
    setUpdating(false);
    if (data) {
      setReservations((prev) => prev.map((r) => (r.id === id ? data : r)));
      if (selected?.id === id) setSelected(data);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-gray-900 mb-1">Reservations</h1>
          <p className="font-body text-sm text-gray-500">
            {reservations.length} reservation{reservations.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={loadReservations}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 
                     bg-white font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-body text-sm font-medium">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search guest name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field text-xs"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="input-field text-xs"
          >
            <option value="">All Rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input-field text-xs"
            placeholder="Date from"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input-field text-xs"
            placeholder="Date to"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  'Reference',
                  'Guest Name',
                  'Contact',
                  'Room',
                  'Check-in',
                  'Nights',
                  'Guests',
                  'Total',
                  'Status',
                  'Created',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-body text-xs font-semibold 
                               text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 11 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-12 text-center font-body text-sm text-gray-400"
                  >
                    No reservations found.
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 
                               transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-body text-xs font-semibold text-primary">
                        {r.reference_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-gray-800 whitespace-nowrap">
                      {r.full_name}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-gray-500">
                      {r.contact_number}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-gray-600 whitespace-nowrap">
                      {r.room?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(r.check_in_date)}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-gray-600 text-center">
                      {r.nights}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-gray-600 text-center">
                      {r.guests}
                    </td>
                    <td className="px-4 py-3 font-body text-xs font-semibold text-gray-800 whitespace-nowrap">
                      {formatPrice(r.total_price)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-gray-400 whitespace-nowrap">
                      {formatDateTime(r.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(r)}
                        className="flex items-center gap-1 text-primary hover:text-primary-600 
                                   font-body text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <ReservationModal
          reservation={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
}
