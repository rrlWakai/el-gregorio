// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Generate a unique reservation reference code
 * Format: EGR-YYYYMMDD-XXXX (EGR = El Gregorio Resort)
 */
export function generateReferenceCode(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EGR-${year}${month}${day}-${random}`;
}

/**
 * Add days to a date string (YYYY-MM-DD)
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Format price in Philippine Peso
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format datetime to readable string
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status color classes for Tailwind
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    'Checked-in': 'bg-green-100 text-green-800 border-green-200',
    Completed: 'bg-gray-100 text-gray-800 border-gray-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

/**
 * Get status dot color for calendar
 */
export function getStatusDotColor(status: string): string {
  const colors: Record<string, string> = {
    Pending: 'bg-yellow-500',
    Confirmed: 'bg-blue-500',
    'Checked-in': 'bg-green-500',
    Completed: 'bg-gray-500',
    Cancelled: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

/**
 * Get minimum check-in date (today)
 */
export function getMinCheckInDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Compute total price
 */
export function computeTotalPrice(basePrice: number, nights: number): number {
  return basePrice * nights;
}

/**
 * Get days array for a month
 */
export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/**
 * Check if a date falls within a range
 */
export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date
): boolean {
  return date >= startDate && date < endDate;
}
