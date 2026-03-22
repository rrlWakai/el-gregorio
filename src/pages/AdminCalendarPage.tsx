import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reservationsService } from '@/services/reservations';
import { reservationsService as resService } from '@/services/reservations';
import type { Reservation, ReservationStatus } from '@/types';
import { getStatusDotColor, formatPrice } from '@/utils/helpers';
import ReservationModal from '@/components/ui/ReservationModal';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function AdminCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    reservationsService.getReservationsForCalendar(year, month).then(({ data }) => {
      if (data) setReservations(data);
      setLoading(false);
    });
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getReservationsForDay = (day: number): Reservation[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return reservations.filter(r => {
      const checkIn = new Date(r.check_in_date);
      const checkOut = new Date(r.check_out_date);
      const d = new Date(dateStr);
      return d >= checkIn && d < checkOut;
    });
  };

  const dateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const dayReservations = selectedDate
    ? reservations.filter(r => {
        const d = new Date(selectedDate);
        return d >= new Date(r.check_in_date) && d < new Date(r.check_out_date);
      })
    : [];

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    setUpdating(true);
    const { data } = await resService.updateStatus(id, status);
    setUpdating(false);
    if (data) {
      setReservations(prev => prev.map(r => r.id === id ? data : r));
      if (selectedReservation?.id === id) setSelectedReservation(data);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-gray-900 mb-1">Reservation Calendar</h1>
        <p className="font-body text-sm text-gray-500">
          Click a date to see reservations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="font-heading text-xl text-gray-900">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center font-body text-xs font-semibold 
                                      text-gray-400 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 font-body text-sm">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const dayRes = getReservationsForDay(day);
                const ds = dateStr(day);
                const isToday =
                  today.getFullYear() === year &&
                  today.getMonth() === month &&
                  today.getDate() === day;
                const isSelected = selectedDate === ds;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(ds)}
                    className={`relative min-h-[3rem] p-1.5 rounded-xl text-left 
                                transition-all border text-sm font-body
                                ${isSelected
                                  ? 'bg-primary text-white border-primary'
                                  : isToday
                                  ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                                  : 'border-transparent hover:bg-gray-50 text-gray-700'
                                }`}
                  >
                    <span className="text-xs">{day}</span>
                    {dayRes.length > 0 && (
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {dayRes.slice(0, 3).map(r => (
                          <span
                            key={r.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : getStatusDotColor(r.status)
                            }`}
                          />
                        ))}
                        {dayRes.length > 3 && (
                          <span className={`text-[9px] ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            +{dayRes.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
            {[
              { status: 'Pending', color: 'bg-yellow-500' },
              { status: 'Confirmed', color: 'bg-blue-500' },
              { status: 'Checked-in', color: 'bg-green-500' },
              { status: 'Completed', color: 'bg-gray-500' },
            ].map(l => (
              <div key={l.status} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="font-body text-xs text-gray-500">{l.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {selectedDate ? (
            <>
              <h3 className="font-heading text-base text-gray-900 mb-1">
                {new Date(selectedDate + 'T00:00').toLocaleDateString('en-PH', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <p className="font-body text-xs text-gray-400 mb-4">
                {dayReservations.length} reservation{dayReservations.length !== 1 ? 's' : ''}
              </p>
              {dayReservations.length === 0 ? (
                <p className="font-body text-sm text-gray-400 py-8 text-center">
                  No reservations on this date.
                </p>
              ) : (
                <div className="space-y-3">
                  {dayReservations.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedReservation(r)}
                      className="w-full text-left p-4 rounded-xl border border-gray-100 
                                 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-body text-sm font-semibold text-gray-800 
                                         group-hover:text-primary transition-colors">
                          {r.full_name}
                        </span>
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 
                                          ${getStatusDotColor(r.status)}`} />
                      </div>
                      <p className="font-body text-xs text-gray-500">{r.room?.name}</p>
                      <p className="font-body text-xs text-gray-400 mt-1">
                        {r.nights} night(s) &mdash; {formatPrice(r.total_price)}
                      </p>
                      <span className="font-body text-xs text-gray-300">{r.reference_code}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="font-body text-sm text-gray-400">
                Select a date on the calendar to view reservations.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
}
