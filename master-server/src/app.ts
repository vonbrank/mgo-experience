import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

import userRouter from "./routes/userRoutes";
import gpuRouter from "./routes/gpuRoutes";
import AppError from "./utils/appError";
import { handleError } from "./controllers/errorController";
import AppRequest from "./utils/appRequest";

const app = express();

// MIDDLEWARES

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use((req: AppRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/gpus", gpuRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(handleError);

export default app;
