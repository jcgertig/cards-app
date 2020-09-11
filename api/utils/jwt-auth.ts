import jwt from 'jsonwebtoken';

import { ISession } from '../controllers/session';
import { ErrorCode, UnauthenticatedError } from './errors';

const DEFAULT_REVOKED_FUNCTION = function(_: any) {
  return Promise.resolve(false);
};

async function verifyToken(token: string, secret: string, options: any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, decoded) => {
      if (err) {
        return reject(
          new UnauthenticatedError(ErrorCode.INVALID_TOKEN, err as Error)
        );
      }
      resolve(decoded);
    });
  });
}

async function checkRevoked(
  decodedToken: any,
  isRevoked: (decodedToken: any) => Promise<boolean>
) {
  const revoked = await isRevoked(decodedToken);
  if (revoked) {
    throw new UnauthenticatedError(
      ErrorCode.REVOKED_TOKEN,
      'The token has been revoked.'
    );
  }
  return;
}

export function jwtAuth({
  secret,
  isRevoked = DEFAULT_REVOKED_FUNCTION,
  formatResult,
  options
}: {
  secret: string;
  isRevoked?: (decodedToken: any) => Promise<boolean>;
  formatResult: (decodedToken: any) => Promise<ISession | undefined>;
  options?: any;
}) {
  return (errorWithoutUser = true) => {
    if (!secret) throw new Error('secret has to be set');

    const middleware = async function(req: any, res: any, next: Function) {
      let token: string;

      if (
        req.method === 'OPTIONS' &&
        !!req.headers['access-control-request-headers']
      ) {
        const hasAuthInAccessControl = !!~req.headers[
          'access-control-request-headers'
        ]
          .split(',')
          .map((header: string) => header.trim())
          .indexOf('authorization');

        if (hasAuthInAccessControl) {
          return next();
        }
      }

      if (req.headers && req.headers.authorization) {
        const parts: string[] = req.headers.authorization.split(' ');
        if (parts.length == 2) {
          const scheme = parts[0];
          const credentials = parts[1];

          if (/^Bearer$/i.test(scheme)) {
            token = credentials;
          } else {
            return next(
              new UnauthenticatedError(
                ErrorCode.CREDENTIALS_BAD_SCHEME,
                'Format is Authorization: Bearer [token]'
              )
            );
          }
        } else {
          return next(
            new UnauthenticatedError(
              ErrorCode.CREDENTIALS_BAD_FORMAT,
              'Format is Authorization: Bearer [token]'
            )
          );
        }
      }

      if (!token!) {
        return next(
          errorWithoutUser
            ? new UnauthenticatedError(
                ErrorCode.CREDENTIALS_REQUIRED,
                'No authorization token was found'
              )
            : undefined
        );
      }

      try {
        jwt.decode(token!, { complete: true });
      } catch (err) {
        return next(new UnauthenticatedError(ErrorCode.INVALID_TOKEN, err));
      }

      const validatedToken = await verifyToken(token!, secret, options);
      await checkRevoked(validatedToken, isRevoked);

      const user = await formatResult(validatedToken);
      if (!user) {
        return next(
          new UnauthenticatedError(
            ErrorCode.CORRUPT_TOKEN,
            'The token is corrupt'
          )
        );
      }
      req.user = user;
      next();
    };

    middleware.UnauthenticatedError = UnauthenticatedError;

    return middleware;
  };
}
