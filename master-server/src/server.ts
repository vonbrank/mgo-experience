import mongoose from "mongoose";
import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config();

import app from "./app";

const DB = process.env.DATABASE_LOCAL || "";

mongoose
  .connect(DB, {
    user: process.env.DATABASE_ROOT_NAME || "",
    pass: process.env.DATABASE_ROOT_PASSWORD || "",
  })
  .then((connection) => {
    console.log(`[server]: MongoDB Connection successful!`);
  });

const port = Number(process.env.PORT);
const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  if (err instanceof Error) {
    console.error(err.name, err.message, err.stack);
  }
  server.close(() => {
    process.exit(1);
  });
});
