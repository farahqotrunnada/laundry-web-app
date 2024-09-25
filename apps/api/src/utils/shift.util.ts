import moment from 'moment';

export const checkShift = (start: moment.Moment, end: moment.Moment, current: moment.Moment) => {
  start = moment(start).utc();
  end = moment(end).utc();

  console.log({
    start: start,
    end: end,
    current: current,
  });

  if (end.isBefore(start)) return current.isSameOrAfter(start) || current.isBefore(end);
  return current.isSameOrAfter(start) && current.isBefore(end);
};
