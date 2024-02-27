import { Request, Response, NextFunction } from "express";
import { CastError, Error as MongooseErrorTypes } from "mongoose";
import { MongoError } from "mongodb";
import { JsonWebTokenError } from "jsonwebtoken";
import AppError, {
  instanceOfAppError,
  instanceOfCastError,
  instanceOfDeplicateFieldsError,
  instanceOfJsonWebTokenError,
  instanceOfTokenExpiredError,
  instanceOfValidationError,
} from "../utils/appError";

const handleCastError = (error: CastError) => {
  const message = `Invalid ${error.path} ${error.value}`;
  return new AppError(message, 400);
};

const handleValidationError = (error: MongooseErrorTypes.ValidationError) => {
  const errors = Object.values(error.errors).map((item) => item.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDeplicateFieldsError = (error: MongoError) => {
  const values = error.errmsg?.match(/(["'])(?:(?=(\\?))\2.)*?\1/) || [];
  const value = values.length > 1 ? values[0] : "";
  console.log(value);
  const message = `Deplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTError = (error: JsonWebTokenError) => {
  const message = `Invalid token. Please log in again!`;
  return new AppError(message, 401);
};

const handleJWTExpiredError = (error: Error) => {
  return new AppError("Your token has expired. Please log in again!", 401);
};

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.stack);

  if (process.env.NODE_ENV === "development") {
    if (instanceOfAppError(err)) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: err.message,
        error: err,
        stack: err.stack,
      });
    }
  } else if (process.env.NODE_ENV === "production") {
    if (instanceOfValidationError(err)) {
      err = handleValidationError(err);
    } else if (instanceOfCastError(err)) {
      err = handleCastError(err);
    } else if (instanceOfDeplicateFieldsError(err)) {
      err = handleDeplicateFieldsError(err);
    } else if (instanceOfJsonWebTokenError(err)) {
      err = handleJWTError(err);
    } else if (instanceOfTokenExpiredError(err)) {
      err = handleJWTExpiredError(err);
    }

    if (instanceOfAppError(err)) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
};
