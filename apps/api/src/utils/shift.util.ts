import moment from 'moment';

export const checkShift = (start: moment.Moment, end: moment.Moment, current: moment.Moment) => {
  const temp = current.add(7, 'hours'); // utc offset ('+07:00');
  if (end.isBefore(start)) return temp.isSameOrAfter(start) || temp.isBefore(end);
  return temp.isSameOrAfter(start) && temp.isBefore(end);
};
