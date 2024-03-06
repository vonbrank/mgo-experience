import { Model, Query, Schema, model, Types } from "mongoose";

export interface IGpu {
  host: string;
  port: number;
  privilegedUsers?: Types.ObjectId[];
  lastHeartBeatAt?: Date;
}

export interface IGpuMethods {}

export type GpuModel = Model<IGpu, {}, IGpuMethods>;

export type GpuSchema = Schema<IGpu, GpuModel, IGpuMethods>;

const gpuSchema: GpuSchema = new Schema(
  {
    host: {
      type: String,
      required: [true, "Please provide your host"],
    },
    port: {
      type: Number,
      required: [true, "Please provide your port"],
    },
    privilegedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastHeartBeatAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gpuSchema.virtual("activated").get(function (this: IGpu) {
  return Math.random() < 0.7;
});

gpuSchema.pre(/^find/, function (this: Query<{}, {}>, next) {
  this.populate({
    path: "privilegedUsers",
    select: "-__v -passwordChangeAt",
  });

  next();
});

const Gpu = model("Gpu", gpuSchema);

export default Gpu;
