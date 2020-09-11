import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import db from '../../models';
import config from '../config';
import { getSessionFromId } from '../controllers/session';
import { IConfig } from './general-types';
import { jwtAuth } from './jwt-auth';
import runMiddleware from './run-middleware';
import { IValidateSchema, validate } from './validate';

interface RouteOptions {
  cors?: boolean;
}

export default function routeHandler<T = any>(
  method: (args: {
    req: NextApiRequest;
    res: NextApiResponse;
    requiresAuth: (errorWithoutUser?: boolean) => void;
    config: IConfig;
    middleware: (fn: any) => Promise<any>;
    validate: (
      schema: IValidateSchema,
      overrides?: { query?: any; body?: any }
    ) => Promise<any>;
    db: typeof db;
  }) => Promise<T>,
  options: RouteOptions = {}
) {
  const { cors = true } = options;
  return async (req: any, res: any) => {
    const middleware = (fn: any) => runMiddleware(req, res, fn);
    try {
      if (cors) {
        await middleware(Cors());
      }
      const requiresAuth = (errorWithoutUser = true) =>
        middleware(
          jwtAuth({
            secret: config.secret,
            formatResult: async (res: any) => {
              return await getSessionFromId(db, res.user_id);
            },
            options: { algorithms: ['HS256'] }
          })(errorWithoutUser)
        );
      const validateCb = (
        schema: IValidateSchema,
        overrides?: { query?: any; body?: any }
      ) => middleware(validate(schema, overrides));
      const result = await method({
        req,
        res,
        requiresAuth,
        config,
        middleware,
        validate: validateCb,
        db
      });
      if (typeof result === 'object' && res !== null) {
        res.json(result);
      }
    } catch (err) {
      console.error(`${req.url} ERROR`, err.message, err.stack);
      if (
        err.name === 'ValidationError' ||
        err.name === 'UnauthorizedError' ||
        err.name === 'UnauthenticatedError' ||
        err.name === 'DBFailureError' ||
        err.name === 'GeneralError'
      ) {
        res.status(err.status).json({
          error: err.errors || err.message,
          code: err.code
        });
      } else {
        res.status(500).json({
          error: err.message,
          code: 'unknown'
        });
      }
    }
  };
}
