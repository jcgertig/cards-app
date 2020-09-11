export const objectCheck = (value) => typeof value === 'object';
export const numberCheck = (value) => typeof value === 'number';
export const setCheck = (set: Array<any>) => (value) => set.includes(value);
