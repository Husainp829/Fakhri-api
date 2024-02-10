const dayjs = require("dayjs");

const getTimezoneOffset = (value) => value.getTimezoneOffset() + 60000;

const formatDate = (value) => {
  const dateTime = new Date(value);
  const utcFromLocal = new Date(dateTime.getTime() + getTimezoneOffset(dateTime));
  return dayjs(utcFromLocal);
};

module.exports = {
  formatDate,
};
