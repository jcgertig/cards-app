export const asJSON = (value: any) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (err) {
      // noop
    }
  }
  return value;
};
