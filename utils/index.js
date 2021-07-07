import {parseISO, formatISO} from 'date-fns';
export const getDate = (date = new Date(), type = 'number') => {
  switch (type) {
    case 'iso':
      return formatISO(date, {
        representation: 'date',
      });

    case 'slash':
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    case 'number':
    default:
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }
};

export const isDateTomorrow = () => {};
