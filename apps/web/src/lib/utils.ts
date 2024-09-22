import { clsx, type ClassValue } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(raw: string) {
  const date = new Date(raw);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}

export function relativeTime(raw: string) {
  return moment(raw).fromNow();
}

export const formatDateTime = (raw: string) => {
  const date = new Date(raw);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
};

export function formatCurrency(value: number) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
}

export function formatHour(value: number) {
  return Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: 'hour',
    unitDisplay: 'long',
  }).format(value);
}
