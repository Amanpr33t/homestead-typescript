const formatDate = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(inputDate);
  return formattedDate; // For e.g. 12 Jan, 2024
};

function getDaysDifference(inputDate: string): number {
  // Convert both dates to milliseconds
  const date1: Date = new Date();
  const date2: Date = new Date(inputDate)
  const date1Milliseconds: number = date1.getTime();
  const date2Milliseconds: number = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMilliseconds: number = Math.abs(date2Milliseconds - date1Milliseconds);

  // Convert the difference back to days
  const differenceDays: number = Math.ceil(differenceMilliseconds / (1000 * 60 * 60 * 24));

  return differenceDays - 1;
}

export {
  formatDate,
  getDaysDifference
};
