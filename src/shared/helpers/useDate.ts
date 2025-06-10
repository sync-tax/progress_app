export function useDates(): {
  getStartOfDay: (dateInput: Date | string | number | null | undefined) => Date | null;
  isSameDateAsToday: (dateValue: Date | string | number | null | undefined) => boolean;
} {
  const getStartOfDay = (dateInput: Date | string | number | null | undefined): Date | null => {
    // Handle null or undefined explicitly first
    if (dateInput === null || typeof dateInput === 'undefined') return null;
    // Handle empty string or other non-zero falsy values that are not 0 itself
    if (!dateInput && dateInput !== 0) return null; 

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null; // Handle invalid date strings

    date.setHours(0, 0, 0, 0);
    return date;
  };

  const isSameDateAsToday = (dateValue: Date | string | number | null | undefined): boolean => {
    if (dateValue === null || typeof dateValue === 'undefined') return false;

    const dateToCompare = getStartOfDay(dateValue);
    if (!dateToCompare) return false; // if dateValue was invalid

    const today = getStartOfDay(new Date());
    // This check is mostly for TypeScript's benefit, as new Date() should always be valid.
    if (!today) return false; 
    
    return dateToCompare.getTime() === today.getTime();
  };

  return {
    getStartOfDay,
    isSameDateAsToday
  };
}