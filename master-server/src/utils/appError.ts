import { CastError, Error as MongooseErrorTypes } from "mongoose";
import { MongoError } from "mongodb";
import { JsonWebTokenError } from "jsonwebtoken";

class AppError extends Error {
  statusCode: number;
  status: string;
  isAppErrorInstance: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "failed" : "error";
    this.isAppErrorInstance = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function instanceOfAppError(object: any): object is AppError {
  return object.isAppErrorInstance && object.isAppErrorInstance === true;
}

export function instanceOfValidationError(
  object: any
): object is MongooseErrorTypes.ValidationError {
  return object.name && object.name === "ValidationError";
}

export function instanceOfCastError(object: any): object is CastError {
  return object.name && object.name === "CastError";
}

export function instanceOfDeplicateFieldsError(
  object: any
): object is MongoError {
  return object.code && object.code === 11000;
}

export function instanceOfJsonWebTokenError(
  object: any
): object is JsonWebTokenError {
  return object.name && object.name === "JsonWebTokenError";
}

export function instanceOfTokenExpiredError(object: any): object is Error {
  return object.name && object.name === "TokenExpiredError";
}

export default AppError;
