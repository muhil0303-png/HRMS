/**
 * @file formatters.ts
 * @description Utility functions for formatting currency, percentages, dates, numbers,
 * and HR-specific metrics consistently across the HRMS Dashboard.
 */

/**
 * Formats a numeric value as a currency string.
 * @param value - The numeric value to format.
 * @param currency - The currency code (default: 'USD').
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @returns The formatted currency string, or a fallback if invalid.
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '$0';
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    return `$${value.toLocaleString(locale)}`;
  }
}

/**
 * Formats a numeric value as a percentage string.
 * @param value - The value to format.
 * @param isRatio - If true, treats the value as a ratio (e.g., 0.125 -> 12.5%). If false, treats it as a pre-multiplied percentage (e.g., 12.5 -> 12.5%). Default is false.
 * @param decimals - The number of decimal places (default: 1).
 * @returns The formatted percentage string.
 */
export function formatPercentage(
  value: number,
  isRatio: boolean = false,
  decimals: number = 1
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  const percentageValue = isRatio ? value * 100 : value;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(percentageValue / 100);
  } catch (error) {
    return `${percentageValue.toFixed(decimals)}%`;
  }
}

/**
 * Formats a number with thousands separators and optional decimal precision.
 * @param value - The number to format.
 * @param decimals - The number of decimal places (default: 0).
 * @param locale - The locale to use (default: 'en-US').
 * @returns The formatted number string.
 */
export function formatNumber(
  value: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    return value.toFixed(decimals);
  }
}

/**
 * Formats a number into a compact representation (e.g., 1.2K, 1.5M).
 * @param value - The number to format.
 * @param decimals - The maximum number of fraction digits (default: 1).
 * @param locale - The locale to use (default: 'en-US').
 * @returns The compact formatted number string.
 */
export function formatCompactNumber(
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    if (value >= 1.0e9) return `${(value / 1.0e9).toFixed(decimals)}B`;
    if (value >= 1.0e6) return `${(value / 1.0e6).toFixed(decimals)}M`;
    if (value >= 1.0e3) return `${(value / 1.0e3).toFixed(decimals)}K`;
    return value.toFixed(decimals);
  }
}

/**
 * Formats a date into a consistent string representation.
 * @param date - The Date object, ISO string, or timestamp.
 * @param options - Optional Intl.DateTimeFormatOptions.
 * @param locale - The locale to use (default: 'en-US').
 * @returns The formatted date string.
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-US'
): string {
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid Date';
  }
  try {
    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(parsedDate);
  } catch (error) {
    return parsedDate.toDateString();
  }
}

/**
 * Formats a date into a short representation (e.g., "Oct 24, 2023").
 * @param date - The Date object, ISO string, or timestamp.
 * @returns The short formatted date string.
 */
export function formatShortDate(date: Date | string | number): string {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date into a relative time string (e.g., "3 days ago", "in 2 hours").
 * @param date - The Date object, ISO string, or timestamp.
 * @returns The relative time string.
 */
export function formatRelativeTime(date: Date | string | number): string {
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return 'unknown time';
  }

  const now = new Date();
  const elapsedMs = parsedDate.getTime() - now.getTime();
  const elapsedSeconds = Math.round(elapsedMs / 1000);
  const elapsedMinutes = Math.round(elapsedSeconds / 60);
  const elapsedHours = Math.round(elapsedMinutes / 60);
  const elapsedDays = Math.round(elapsedHours / 24);

  try {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (Math.abs(elapsedSeconds) < 60) {
      return rtf.format(elapsedSeconds, 'second');
    }
    if (Math.abs(elapsedMinutes) < 60) {
      return rtf.format(elapsedMinutes, 'minute');
    }
    if (Math.abs(elapsedHours) < 24) {
      return rtf.format(elapsedHours, 'hour');
    }
    if (Math.abs(elapsedDays) < 30) {
      return rtf.format(elapsedDays, 'day');
    }
    
    return formatShortDate(parsedDate);
  } catch (error) {
    const absDays = Math.abs(elapsedDays);
    const suffix = elapsedDays < 0 ? 'ago' : 'from now';
    if (absDays === 0) return 'today';
    if (absDays === 1) return elapsedDays < 0 ? 'yesterday' : 'tomorrow';
    return `${absDays} days ${suffix}`;
  }
}

/**
 * Formats a trend percentage with a leading '+' or '-' sign.
 * @param value - The trend percentage value (e.g., 12.5 or -3.2).
 * @param decimals - The number of decimal places (default: 1).
 * @returns The formatted trend string (e.g., "+12.5%", "-3.2%", "0.0%").
 */
export function formatTrend(value: number, decimals: number = 1): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.0%';
  }
  const formattedValue = Math.abs(value).toFixed(decimals);
  if (value > 0) {
    return `+${formattedValue}%`;
  }
  if (value < 0) {
    return `-${formattedValue}%`;
  }
  return `${formattedValue}%`;
}

/**
 * Formats employee tenure in years and months.
 * @param totalMonths - The total number of months of tenure.
 * @returns A formatted string (e.g., "2 yrs 4 mos", "6 mos", "1 yr").
 */
export function formatTenure(totalMonths: number): string {
  if (typeof totalMonths !== 'number' || isNaN(totalMonths) || totalMonths < 0) {
    return '0 mos';
  }
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const yearsStr = years > 0 ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : '';
  const monthsStr = months > 0 ? `${months} ${months === 1 ? 'mo' : 'mos'}` : '';

  if (yearsStr && monthsStr) {
    return `${yearsStr} ${monthsStr}`;
  }
  return yearsStr || monthsStr || '0 mos';
}