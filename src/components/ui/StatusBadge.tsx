import { getStatusColor } from '@/utils/helpers';
import type { ReservationStatus } from '@/types';

interface Props {
  status: ReservationStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-body 
                  font-semibold border ${getStatusColor(status)}`}
    >
      {status}
    </span>
  );
}
