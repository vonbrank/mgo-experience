import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import APIFeatures from "../utils/apiFeatures";
import { Model, PopulateOptions, Query } from "mongoose";
import { Request, query } from "express";

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
      data: document,
    });
  });

const createOne = <TRawDocType>(Model: Model<TRawDocType, {}, {}>) =>
  catchAsync(async (request, response) => {
    const document = await Model.create(request.body);
    response.status(201).json({
      status: "success",
      data: document,
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
      data: document,
    });
  });

const getAll = <TRawDocType>(
  Model: Model<TRawDocType, {}, {}>,
  beforeQueryBegin: (
    request: Request,
    query: Query<any, any>
  ) => Query<any, any> = (request, query) => query,
  onQueryComplete: (request: Request, document: any[]) => void = () => {}
) =>
  catchAsync(
    async (request: Request<{ [index: string]: string }, {}, {}>, response) => {
      let query: Query<any, any> = Model.find();

      const features = new APIFeatures(query, request.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      query = beforeQueryBegin(request, query);
      const document = await features.query;
      onQueryComplete(request, document);

      response.status(200).json({
        status: "success",
        results: document.length,
        data: document,
      });
    }
  );

export { getAll, getOne, createOne, updateOne, deleteOne };
