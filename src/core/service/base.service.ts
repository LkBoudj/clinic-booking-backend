import { Model, Document, UpdateQuery, RootQuerySelector } from "mongoose";
import RootService from "./root.service";
import { IPaginatedResult } from "../../types";

/**
 * BaseService<T>
 * -----------------
 * A generic service class that handles core CRUD operations,
 * filtering, search, pagination, and population.
 *
 * @template T - A Mongoose Document type
 */
class BaseService<T extends Document> extends RootService<T> {
  constructor(
    private readonly model: Model<T>,
    private readonly fieldsFilter: (keyof T)[] = []
  ) {
    super();
  }

  /**
   * Fetches a list of documents with support for filtering, pagination, and population.
   *
   * @returns Promise<Array<T> | { data: Array<T>, meta: PaginationMeta }>
   */
  async list(): Promise<Document<T>[] | IPaginatedResult<Document<T>>> {
    let result;
    let query: any = this.model.find(this._filter, this._select, this._options);

    for (const pop of this._populate) {
      query = query.populate(pop);
    }

    if (this._is_paginate) {
      const skip = (this._page - 1) * this._pageSize;

      query = query.skip(skip).limit(this._pageSize);

      const [data, total] = await Promise.all([
        query.lean().exec(),
        this.count(),
      ]);

      const meta = {
        total,
        page: this._page,
        limit: this._pageSize,
        totalPages: Math.ceil(total / this._pageSize),
      };

      result = { data, meta };
    }

    result = await query.lean().exec();

    this._clear();
    return result;
  }

  /**
   * Builds MongoDB filters based on query params.
   * Supports operators: in, nin, gt, lt, eq, ne
   *
   * @param data - Key-value object of query filters
   *
   * Example query:
   * ```
   * {
   *   age_gt: 20,
   *   gender_eq: "male",
   *   status_in: ["active", "pending"]
   * }
   * ```
   */
  filter(data: any) {
    const filter: Record<string, any> = {};

    Object.entries(data).forEach((val) => {
      const [key, value] = val;
      const array_obj = key.split("_");
      const op = array_obj[array_obj.length - 1];

      if (["in", "nin", "gt", "lt", "eq", "ne"].includes(op)) {
        array_obj.pop();
        const field = array_obj.join("_");

        if (Array.isArray(value)) {
          filter[field] = {
            ...filter[key],
            [`$${op}`]: value,
          };
        }

        switch (op) {
          case "gt":
            filter[field] = {
              ...filter[field],
              $gt: parseFloat(value as string),
            };
            break;
          case "lt":
            filter[field] = {
              ...filter[field],
              $lt: parseFloat(value as string),
            };
            break;
          case "eq":
            filter[field] = { ...filter[field], $eq: value };
            break;
          case "ne":
            filter[field] = { ...filter[field], $ne: value };
            break;
          default:
            break;
        }
      } else {
        if (Array.isArray(value)) {
          filter[key] = {
            ...filter[key],
            $in: value,
          };
        } else {
          filter[key] = value;
        }
      }
    });

    this._filter = {
      $and: [{ ...this._filter }, filter],
    };
    console.log(this._filter["$and"]);
  }

  /**
   * Adds a case-insensitive regex-based search across multiple fields.
   *
   * @param search - Search string
   *
   * @returns this
   */
  search(search: string) {
    if (search) {
      const obj = this.fieldsFilter
        .filter((field) => typeof field === "string")
        .map((field) => ({
          [field as string]: { $regex: search, $options: "i" },
        })) as RootQuerySelector<T>[];

      this.where({
        $or: obj,
      });

      return this;
    }
  }

  /**
   * Finds a single document based on the current filter.
   *
   * @returns Promise<T | null>
   */
  async findOne(): Promise<Document<T> | null> {
    let query: any = this.model.findOne(
      this._filter,
      this._select,
      this._options
    );

    for (const pop of this._populate) {
      query = query.populate(pop);
    }

    this._clear();
    return await query.lean().exec();
  }

  /**
   * Finds a document by its ID.
   *
   * @param id - Document ID
   * @returns Promise<T | null>
   */
  async findById(id: string): Promise<Partial<T> | null> {
    let query: any = this.model.findById(id);

    if (this._select) query = query.select(this._select);
    for (const pop of this._populate) query = query.populate(pop);

    return await query.lean().exec();
  }

  /**
   * Counts documents based on current filter.
   *
   * @returns Promise<number>
   */
  async count(): Promise<number> {
    return await this.model.countDocuments(this._filter, {}).exec();
  }

  /**
   * Creates a new document.
   *
   * @param data - Partial document data
   * @returns Promise<T>
   */
  async create(data: Partial<T>): Promise<T> {
    const instance = new this.model(data);
    return await instance.save();
  }

  /**
   * Updates a document by its ID.
   *
   * @param id - Document ID
   * @param data - Update data
   * @returns Promise<T | null>
   */
  async update(id: string, data: UpdateQuery<T>) {
    return await this.model
      .findByIdAndUpdate(id, data, { new: true, lean: true })
      .exec();
  }

  /**
   * Deletes a document by its ID.
   *
   * @param id - Document ID
   * @returns Promise<T | null>
   */
  async delete(id: string) {
    return await this.model.findByIdAndDelete(id, { lean: true }).exec();
  }
}

export default BaseService;
