import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  DollarSign,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reservationsService } from '@/services/reservations';
import type { DashboardStats } from '@/types';
import { formatPrice } from '@/utils/helpers';

const statCards = (stats: DashboardStats) => [
  {
    label: 'Total Reservations',
    value: stats.total_reservations,
    icon: ClipboardList,
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    label: 'Pending',
    value: stats.pending_reservations,
    icon: Clock,
    color: 'bg-yellow-50 text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  {
    label: 'Confirmed',
    value: stats.confirmed_reservations,
    icon: CheckCircle,
    color: 'bg-green-50 text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    label: 'Total Revenue',
    value: formatPrice(stats.total_revenue),
    icon: DollarSign,
    color: 'bg-primary/5 text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: "Check-ins Today",
    value: stats.checkin_today,
    icon: CalendarCheck,
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-100',
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    reservationsService.getDashboardStats().then(({ data }) => {
      if (data) setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-gray-900 mb-1">Dashboard</h1>
        <p className="font-body text-sm text-gray-500">
          Overview of El Gregorio Farm Resort reservations
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="w-10 h-10 bg-gray-100 rounded-xl mb-4" />
              <div className="h-7 bg-gray-100 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
          {statCards(stats).map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                         hover:shadow-card transition-shadow"
            >
              <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center 
                               justify-center mb-4`}>
                <card.icon className={`w-5 h-5 ${card.color.split(' ')[1]}`} />
              </div>
              <p className="font-heading text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </p>
              <p className="font-body text-sm text-gray-500">{card.label}</p>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            title: 'View All Reservations',
            desc: 'Manage and update reservation statuses',
            path: '/admin/reservations',
          },
          {
            title: 'Calendar View',
            desc: 'See reservations on a monthly calendar',
            path: '/admin/calendar',
          },
          {
            title: 'Manage Rooms',
            desc: 'Add, edit, or disable rooms',
            path: '/admin/rooms',
          },
        ].map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className="bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 
                       hover:shadow-card hover:border-primary/20 transition-all duration-200 
                       group"
          >
            <h3 className="font-heading text-base text-gray-900 mb-1">{action.title}</h3>
            <p className="font-body text-sm text-gray-500 mb-3">{action.desc}</p>
            <div className="flex items-center gap-1 text-primary font-body text-sm font-medium 
                            group-hover:gap-2 transition-all">
              Go
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
