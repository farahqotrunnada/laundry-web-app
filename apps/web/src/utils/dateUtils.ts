export const formatDate = (data: string | Date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  } as Intl.DateTimeFormatOptions;

  return new Date(data).toLocaleDateString('id-ID', options);
};
