function addMinutesToDate(date, minute) {
  return new Date(date.getTime() + minute * 60 * 1000);
}
module.exports = addMinutesToDate;
