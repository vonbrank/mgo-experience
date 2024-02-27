import { Query } from "mongoose";

class APIFeatures<ResultType, DocType> {
  query: Query<ResultType, DocType>;
  queryString: { [index: string]: string };

  constructor(
    query: Query<ResultType, DocType>,
    queryString: { [index: string]: string }
  ) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((item) => delete queryObject[item]);

    const queryStr = JSON.stringify(queryObject).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortBy = this.queryString.sort;
    if (typeof sortBy === "string") {
      this.query = this.query.sort(sortBy.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    let fields = this.queryString.fields;
    if (typeof fields === "string") {
      this.query.select(fields.split(",").join(" "));
    } else {
      this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
