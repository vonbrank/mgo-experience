import { Schema, Model, model, Document, Query } from "mongoose";
import validator from "validator";
import bcraypt from "bcryptjs";
import crypto from "crypto";

const userRoles = ["supervisor", "admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];

export interface IUser {
  name: string;
  email: string;
  photo?: string;
  role: UserRole;
  password?: string;
  passwordConfirm?: string;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
}

export interface IUserMethods {
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changedPasswordAfter: (jwtTimestamp: string) => boolean;
  createPasswordResetToken: () => string;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

export type UserSchema = Schema<IUser, UserModel, IUserMethods, {}>;

const userSchema: UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: userRoles,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: IUser, value: string) {
        return value === this.password;
      },
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre(
  "save",
  async function (
    this: IUser & Document<any, any, IUser> & IUserMethods,
    next
  ) {
    if (!this.isModified("password")) return next();

    this.password = await bcraypt.hash(this.password || "", 12);
    this.passwordConfirm = undefined;

    return next();
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = new Date(Date.now() - 1000);

  return next();
});
userSchema.pre(/^find/, function (this: Query<{}, {}>, next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.method(
  "correctPassword",
  async function (candidatePassword: string, userPassword: string) {
    return await bcraypt.compare(candidatePassword, userPassword);
  }
);

userSchema.method("changedPasswordAfter", function (jwtTimestamp: string) {
  if (this.passwordChangeAt) {
    const changedTimestamp = Math.round(this.passwordChangeAt.getTime() / 1000);
    return Number(jwtTimestamp) < changedTimestamp;
  }

  return false;
});

userSchema.method("createPasswordResetToken", function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
});

const User = model("User", userSchema);

export default User;
