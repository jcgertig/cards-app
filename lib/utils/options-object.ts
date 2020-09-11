interface WithOptions {
  asOptions: Array<{ value: any; label: string }>;
}

export function optionsObject<T = any>(obj: T): T & WithOptions {
  const reversed = Object.keys(obj).reduce(
    (res, key) => ({ ...res, [obj[key]]: key }),
    {}
  );
  return new Proxy<any>(obj, {
    get: function(target, prop) {
      if (prop === 'asOptions') {
        return Object.keys(target).map((key) => ({
          value: target[key],
          label: key
        }));
      } else if (target[prop]) {
        return target[prop];
      }
      return reversed[prop];
    }
  }) as T & WithOptions;
}
