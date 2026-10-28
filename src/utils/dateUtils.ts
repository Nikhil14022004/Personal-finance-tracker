/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns current month string in YYYY-MM format
 */
export const getCurrentMonthString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Checks whether a given ISO date string (YYYY-MM-DD) falls in the specified month (YYYY-MM)
 */
export const isDateInMonth = (dateString: string, monthString?: string): boolean => {
  const target = monthString || getCurrentMonthString();
  return dateString.startsWith(target);
};

/**
 * Formats a date string (YYYY-MM-DD) to readable format: "28 Oct 2026"
 */
export const formatDateReadable = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${months[month]} ${year}`;
    }
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
};

/**
 * Formats YYYY-MM to human readable "October 2026"
 */
export const formatMonthReadable = (monthString: string): string => {
  try {
    const [year, month] = monthString.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[monthIndex]} ${year}`;
  } catch {
    return monthString;
  }
};

