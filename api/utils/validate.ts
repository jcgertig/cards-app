import validator from 'validator';

import { ValidationError } from './errors';

export interface IValidationError {
  param: string;
  error: string;
}

export interface IValidateSchema {
  [key: string]: (
    object: { query: any; body: any },
    key: string
  ) => true | IValidationError;
}

export type ValidationCheck = (value: any, options?: any) => boolean;

export const check = ({
  method,
  from = 'body',
  required = true,
  message,
  options
}: {
  method?:
    | keyof typeof validator
    | ValidationCheck
    | Array<keyof typeof validator | ValidationCheck>;
  from?: 'query' | 'body';
  required?: boolean | Array<string>;
  message?: string;
  options?: any | Array<any>;
}) => {
  return (
    object: { query: any; body: any },
    key: string
  ): true | IValidationError => {
    const value = object[from][key];
    if (
      typeof value === 'undefined' &&
      (required === true ||
        (Array.isArray(required) &&
          required.reduce<boolean>((res, requiredKey) => {
            if (res === false) {
              return res;
            }
            if (requiredKey.indexOf('!') === 0) {
              return !object[from][requiredKey.slice(1)];
            }
            return !!object[from][requiredKey];
          }, true)))
    ) {
      return {
        param: key,
        error: 'value required'
      };
    }
    const methods = Array.isArray(method) ? method : [method];
    const optionsArr = Array.isArray(options) ? options : [options];
    if (!!value && methods.length) {
      for (let i = 0; i < methods.length; i += 1) {
        const method = methods[i];
        if (method) {
          const valid = ((typeof method === 'string'
            ? validator[method]
            : method) as unknown) as ValidationCheck;
          if (!valid(object[from][key], optionsArr[i])) {
            return {
              param: key,
              error: message || 'does not pass validation'
            };
          }
        }
      }
    }
    return true;
  };
};

export const validate = (
  schema: IValidateSchema,
  overrides?: { query?: any; body?: any }
) => {
  return function(req: any, res: any, next: Function) {
    const errors: Array<IValidationError> = [];
    for (const key of Object.keys(schema)) {
      const error = schema[key](
        {
          query: overrides?.query || req.query,
          body: overrides?.body || req.body
        },
        key
      );
      if (error !== true) {
        errors.push(error);
      }
    }
    if (errors.length) {
      return next(new ValidationError(req.url, errors));
    }
    next();
  };
};

const slugCharsetRegex = /^[^\s-_](?!.*?[-_]{2,})([a-zA-Z0-9-_\\]{1,})[^\s]*[^-_\s]$/;
export function isSlug(str: string) {
  return slugCharsetRegex.test(str);
}

export const validateSlug = {
  slug: check({
    required: true,
    method: [
      (value: string) => value !== 'undefined',
      (value: string) =>
        value.length > 2 ? isSlug(value) : validator.isAlpha(value)
    ],
    from: 'query'
  })
};

export const validateId = {
  id: check({
    required: true,
    method: [(value: string) => value !== 'undefined', 'isNumeric'],
    from: 'query'
  })
};
