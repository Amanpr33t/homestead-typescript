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

function getDateDifference(inputDate: string) {
  const currentDate = new Date();
  const inputDateTime = new Date(inputDate);

  // Difference in milliseconds
  const differenceMs = currentDate.getTime() - inputDateTime.getTime();

  // Convert milliseconds to days
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  if (differenceDays <= 30) {
    if (differenceDays === 0) {
      return 'reviewed today'
    } else if (differenceDays === 1) {
      return '1 day ago'
    } else {
      return `${differenceDays} month ago`
    }
  } else if (differenceDays <= 365) {
    const differenceMonths = Math.floor(differenceDays / 30);
    if (differenceMonths === 1) {
      return `1 month ago`;
    } else {
      return `${differenceMonths} months ago`;
    }
  } else {
    const differenceYears = Math.floor(differenceDays / 365);
    if (differenceYears === 1) {
      return `1 year ago`;
    } else {
      return `${differenceYears} years ago`;
    }
  }
}

export {
  formatDate,
  getDaysDifference,
  getDateDifference
};
