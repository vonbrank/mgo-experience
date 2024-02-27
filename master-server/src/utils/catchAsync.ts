import { RequestHandler } from "express";
import { ReturnPromiseType } from "./type-transformations";

const catchAsync = (fn: ReturnPromiseType<RequestHandler>) => {
  const newFn: RequestHandler = (request, response, next) => {
    fn(request, response, next).catch(next);
  };
  return newFn;
};

export default catchAsync;
