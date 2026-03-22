import { useState, useCallback } from 'react';
import { reservationsService } from '@/services/reservations';
import type { AvailabilityResult } from '@/types';

interface UseAvailabilityReturn {
  availability: AvailabilityResult | null;
  checking: boolean;
  checkAvailability: (
    roomId: string,
    checkInDate: string,
    nights: number
  ) => Promise<void>;
  reset: () => void;
}

export function useAvailability(): UseAvailabilityReturn {
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [checking, setChecking] = useState(false);

  const checkAvailability = useCallback(
    async (roomId: string, checkInDate: string, nights: number) => {
      if (!roomId || !checkInDate || nights < 1) return;

      setChecking(true);
      try {
        const result = await reservationsService.checkAvailability(
          roomId,
          checkInDate,
          nights
        );
        setAvailability(result);
      } catch {
        setAvailability({
          available: false,
          message: 'Could not check availability. Please try again.',
        });
      } finally {
        setChecking(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setAvailability(null);
  }, []);

  return { availability, checking, checkAvailability, reset };
}
