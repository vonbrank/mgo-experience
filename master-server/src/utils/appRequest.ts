import { Request } from "express";
import { IUser, IUserMethods } from "../models/userModel";
import { Document } from "mongoose";

interface AppRequest extends Request {
  requestTime?: string;
  user?: IUser & Document<any, any, IUser> & IUserMethods;
}

export default AppRequest;
