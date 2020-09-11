import { IValidationError } from './validate';

export enum ErrorCode {
  UNKNOWN = 'unknown',
  INVALID_TOKEN = 'invalid_token',
  REVOKED_TOKEN = 'revoked_token',
  CORRUPT_TOKEN = 'corrupt_token',
  CREDENTIALS_REQUIRED = 'credentials_required',
  CREDENTIALS_BAD_SCHEME = 'credentials_bad_scheme',
  CREDENTIALS_BAD_FORMAT = 'credentials_bad_format',
  NOT_AUTHORIZED = 'not_authorized',
  VALIDATION_ERRORS = 'validation_errors',
  DB_ACTION_FAILED = 'db_action_failed'
}

export class GeneralError extends Error {
  public inner: Error;
  public status: number;
  public code: ErrorCode | undefined;
  constructor(
    error: string | Error,
    status: number = 500,
    code: ErrorCode = ErrorCode.UNKNOWN
  ) {
    super();
    const passedError = typeof error === 'string' ? new Error(error) : error;
    this.message = passedError.message;
    this.stack = new Error(this.message).stack;
    this.name = this.constructor.name;
    this.inner = passedError;
    this.status = status;
    this.code = code;
  }
}

export class DBFailureError extends GeneralError {
  constructor(error: string | Error) {
    super(error, 400, ErrorCode.DB_ACTION_FAILED);
  }
}

export class UnauthenticatedError extends GeneralError {
  constructor(code: ErrorCode, error: string | Error) {
    super(error, 401, code);
  }
}

export class UnauthorizedError extends GeneralError {
  constructor(error: string | Error) {
    super(error, 403, ErrorCode.NOT_AUTHORIZED);
  }
}

export class ValidationError extends GeneralError {
  public errors: Array<IValidationError>;
  constructor(method: string, errors: Array<IValidationError>) {
    super(`${method} Validation Error`, 422, ErrorCode.VALIDATION_ERRORS);
    this.errors = errors;
  }
}
