export const timeSince = (dateString: string, t: (key: string, replacements?: { [key: string]: string | number }) => string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return t('time.yearsAgo', { count: Math.floor(interval) });
  interval = seconds / 2592000;
  if (interval > 1) return t('time.monthsAgo', { count: Math.floor(interval) });
  interval = seconds / 86400;
  if (interval > 1) return t('time.daysAgo', { count: Math.floor(interval) });
  interval = seconds / 3600;
  if (interval > 1) return t('time.hoursAgo', { count: Math.floor(interval) });
  interval = seconds / 60;
  if (interval > 1) return t('time.minutesAgo', { count: Math.floor(interval) });
  return t('time.now', {});
};
