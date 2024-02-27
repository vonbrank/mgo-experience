import User, { IUser, IUserMethods, UserRole } from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import { promisify } from "util";
import { sendEmail } from "../utils/email";
import crypto from "crypto";
import { Request, Response, NextFunction, CookieOptions } from "express";
import { Document } from "mongoose";
import AppRequest from "../utils/appRequest";

const signToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (jwtSecret) {
    return jwt.sign({ id }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  throw new AppError("JWT_SECRET does not exist", 500);
};

const createAndSendToken = (
  user: IUser & Document<any, any, IUser> & IUserMethods,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN || 0) * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createAndSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");
  const correct =
    (await user?.correctPassword(password, user.password || "")) || false;

  if (!user || !correct) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createAndSendToken(user, 200, res);
});

const restrictTo = (...roles: UserRole[]) => {
  return (req: AppRequest, res: Response, next: NextFunction) => {
    if (!(req.user && roles.includes(req.user.role))) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

const protect = catchAsync(async (req: AppRequest, res, next) => {
  const authorization = req.headers.authorization;

  let token: string | null = null;
  if (authorization && authorization.startsWith("Bearer")) {
    const authorizationSplit = authorization.split(" ");
    if (authorizationSplit.length >= 2) {
      [, token] = authorizationSplit;
    }
  }

  if (token === null) {
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );
  }

  const decode = await promisify<
    string,
    string,
    JwtPayload | string | undefined
  >(jwt.verify)(token, process.env.JWT_SECRET || "");

  if (decode === undefined || typeof decode === "string") {
    throw new AppError("The token type is not valid.", 401);
  }

  const currentUser = await User.findById(decode.id);
  if (currentUser === null) {
    throw new AppError("The user that owns the token does not exist.", 401);
  }

  if (currentUser.changedPasswordAfter(`${decode.iat || ""}`)) {
    throw new AppError(
      "User recently changed password!. Please log in again.",
      401
    );
  }

  req.user = currentUser;

  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user === null) {
    return next(new AppError("There is no user with email address.", 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    console.error(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (user === null) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createAndSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req: AppRequest, res, next) => {
  const user = await User.findById(req.user?.id).select("+password");
  const currentPassword = req.body.currentPassword || "";
  const passwordCorrect =
    (await user?.correctPassword(currentPassword, user.password || "")) ||
    false;
  if (user === null || !passwordCorrect) {
    throw new AppError("You current password is wrong!", 401);
  }

  const { newPassword, newPasswordConfirm } = req.body;

  if (!newPassword || !newPasswordConfirm) {
    throw new AppError(
      "Please provide new password and confirm new password!",
      400
    );
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  createAndSendToken(user, 200, res);
});

export {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
