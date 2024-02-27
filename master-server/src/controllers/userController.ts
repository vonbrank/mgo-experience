import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import * as factory from "./handleFactory";
import { Request, Response, NextFunction } from "express";
import AppRequest from "../utils/appRequest";

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: { [index: string]: string } = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

const getAllUsers = factory.getAll(User);

const getMe = (req: AppRequest, res: Response, next: NextFunction) => {
  req.params.id = req.user?.id;

  next();
};

const updateMe = catchAsync(async (req: AppRequest, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates, Please use /updatePassword",
        400
      )
    );
  }
  const filterdBody = filterObj(req.body, "name", "email");
  const updateUser = await User.findByIdAndUpdate(req.user?.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

const deleteMe = catchAsync(async (req: AppRequest, res, next) => {
  await User.findByIdAndUpdate(req.user?.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const createUser = (request: Request, response: Response) => {
  response.status(500).json({
    status: "error",
    message: "This route is not yet defined. Please user /signup instead",
  });
};

const getUser = factory.getOne(User);

const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

export {
  getMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
