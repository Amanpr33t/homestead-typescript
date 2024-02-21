const formatDate = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(inputDate);
  return formattedDate; // For e.g. 12 Jan, 2024
};

function getDaysDifference(input: string): number {
  const currentDate = new Date();
  const inputDateObj = new Date(input);

  // Set hours, minutes, seconds, and milliseconds to 0 for both dates
  currentDate.setHours(0, 0, 0, 0);
  inputDateObj.setHours(0, 0, 0, 0);

  const timeDifference = currentDate.getTime() - inputDateObj.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);

  return Math.abs(Math.round(daysDifference));
}

export {
  formatDate,
  getDaysDifference
};
