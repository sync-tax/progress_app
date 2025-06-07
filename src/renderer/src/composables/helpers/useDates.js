
export function useDates() {
  const getStartOfDay = (dateInput) => {
    if (!dateInput && dateInput !== 0) return null; // Handle null, undefined. Allow 0 for epoch.
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null; // Handle invalid date strings
    date.setHours(0, 0, 0, 0);
    return date;
  };
  
  const isSameDateAsToday = (dateValue) => {
    if (!dateValue) return false;
    const dateToCompare = getStartOfDay(dateValue);
    if (!dateToCompare) return false;
    const today = getStartOfDay(new Date());
    return dateToCompare.getTime() === today.getTime();
  };

  return {
    getStartOfDay,
    isSameDateAsToday
  }
}

