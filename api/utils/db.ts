import { DateTime } from 'luxon';

export const asyncGetOne = async <T = any>(res: Promise<T[]>) => (await res)[0];

export const sqlNow = 'now()::timestamp';

function getOrValue(value?: any): any {
  if (typeof value === 'undefined' || value === null) {
    return null;
  }
  if (value instanceof Date) {
    return DateTime.fromJSDate(value)
      .toUTC()
      .toJSDate();
  }
  return value;
}

export function orNull<T>(value?: T | null, defaultVal: any = null): any {
  if (value === null || typeof value === 'undefined') {
    return defaultVal;
  }
  return getOrValue(value);
}
