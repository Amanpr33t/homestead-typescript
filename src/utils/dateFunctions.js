const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDate);
    return formattedDate;//For e.g. 12 Jan, 2024
  };


export {
    formatDate
}