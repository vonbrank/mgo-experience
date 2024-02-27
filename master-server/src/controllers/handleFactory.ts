import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import APIFeatures from "../utils/apiFeatures";
import { Model, PopulateOptions, Query } from "mongoose";
import { Request } from "express";
import { IUser } from "../models/userModel";

const deleteOne = <TRawDocType>(Model: Model<TRawDocType, {}, {}>) =>
  catchAsync(async (request, response, next) => {
    const document = await Model.findByIdAndDelete(request.params.id);

    if (document === null) {
      return next(new AppError("No document found with that ID", 404));
    }

    response.status(204).json({
      status: "success",
      data: null,
    });
  });

const updateOne = <TRawDocType>(Model: Model<TRawDocType, {}, {}>) =>
  catchAsync(async (request, response) => {
    const document = await Model.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );
    response.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

const createOne = <TRawDocType>(Model: Model<TRawDocType, {}, {}>) =>
  catchAsync(async (request, response) => {
    const document = await Model.create(request.body);
    response.status(201).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

const getOne = <TRawDocType>(
  Model: Model<TRawDocType, {}, {}>,
  populateOptions?: PopulateOptions
) =>
  catchAsync(async (request, response, next) => {
    let query: Query<any, any> = Model.findById(request.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const document = await query;

    if (document === null) {
      return next(new AppError("No document found with that ID", 404));
    }

    response.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

const getAll = <TRawDocType>(Model: Model<TRawDocType, {}, {}>) =>
  catchAsync(
    async (
      request: Request<{ [index: string]: string }, {}, {}, {}>,
      response
    ) => {
      let filter = {};

      if (request.params.tourId)
        filter = { tour: request.params.tourId, ...filter };

      const query = Model.find(filter);

      const features = new APIFeatures(query, request.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const document = await features.query;

      response.status(200).json({
        status: "success",
        results: document.length,
        data: {
          data: document,
        },
      });
    }
  );

export { getAll, getOne, createOne, updateOne, deleteOne };
