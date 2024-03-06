import { Types } from "mongoose";
import Gpu from "../models/gpuModel";
import AppError from "../utils/appError";
import AppRequest from "../utils/appRequest";
import catchAsync from "../utils/catchAsync";
import * as factory from "./handleFactory";
import { publicKey } from "../config";

export const getAllGpus = factory.getAll(
  Gpu,
  (request: AppRequest, query) => {
    if (Boolean(process.env.DEVELOPMENT_MODE_FAKE_GPU_ACTIVE_STATUS)) {
      return query;
    }

    return query.find({ privilegedUsers: request.user?.id });
  },
  (request: AppRequest, document) => {
    const user = request.user;
    if (user && user.role === "user")
      document.forEach((item) => {
        item.privilegedUsers = undefined;
      });
  }
);

export const getGpu = factory.getOne(Gpu);

export const register = catchAsync(async (req: AppRequest, res, next) => {
  const newGpu = await Gpu.create({
    host: req.body.host,
    port: req.body.port,
    lastHeartBeatAt: req.requestTime || new Date(),
  });

  res.status(201).json({
    status: "success",
    data: {
      gpu: newGpu,
      publicKey,
    },
  });
});

export const updateGpu = catchAsync(async (req: AppRequest, res, next) => {
  const host = req.body.host as string | undefined;
  const port = req.body.port as number | undefined;
  const privilegedUsers = req.body.privilegedUsers as string[];
  const addUserPrivilege = req.body.addUserPrivilege as string[];
  const removeUserPrivilege = req.body.removeUserPrivilege as string[];

  const gpu = await Gpu.findById(req.params.id);

  if (gpu === null) {
    return next(new AppError("No GPU found with that ID", 404));
  }

  let newPrivilegedUsers = gpu.privilegedUsers || [];
  if (privilegedUsers.length === 0) {
    addUserPrivilege.forEach((item) => {
      if (newPrivilegedUsers.findIndex((item1) => item1.equals(item)) === -1) {
        newPrivilegedUsers = [...newPrivilegedUsers, new Types.ObjectId(item)];
      }
    });
    newPrivilegedUsers = newPrivilegedUsers.filter(
      (item) =>
        removeUserPrivilege.findIndex((item1) => item.equals(item1)) === -1
    );
  } else {
    newPrivilegedUsers = privilegedUsers.map(
      (item) => new Types.ObjectId(item)
    );
  }

  gpu.privilegedUsers = newPrivilegedUsers;
  if (host) {
    gpu.host = host;
  }
  if (port) {
    gpu.port = port;
  }

  const newGpu = await gpu.save();

  res.status(200).json({
    status: "success",
    data: {
      gpu: newGpu,
    },
  });
});

export const startUp = catchAsync(async (req: AppRequest, res, next) => {
  const newGpu = await Gpu.findByIdAndUpdate(
    req.body["gpu-id"],
    {
      host: req.body.host,
      port: req.body.port,
      lastHeartBeatAt: req.requestTime || new Date(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      gpu: newGpu,
      publicKey,
    },
  });
});

export const shutDown = catchAsync(async (req: AppRequest, res, next) => {
  const gpu = await Gpu.findById(req.body["gpu-id"]);
  if (gpu === null) {
    return next(new AppError("No GPU found with that ID", 404));
  }

  gpu.lastHeartBeatAt = undefined;

  await gpu.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const heartBeat = catchAsync(async (req: AppRequest, res, next) => {
  const newGpu = await Gpu.findByIdAndUpdate(
    req.body["gpu-id"],
    {
      lastHeartBeatAt: req.requestTime || new Date(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      gpu: newGpu,
    },
  });
});
