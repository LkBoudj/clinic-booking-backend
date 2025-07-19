import { Document, FilterQuery, Model, PopulateOptions } from "mongoose";
import UserModel from "../../modules/auth/models/user.model";

type MongoOperator =
  | "$eq"
  | "$ne"
  | "$gt"
  | "$gte"
  | "$lt"
  | "$lte"
  | "$in"
  | "$nin"
  | "$regex";

type KeyOperator = "=" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "nin" | "like";

const operatorMap: Record<KeyOperator, MongoOperator> = {
  "=": "$eq",
  "!=": "$ne",
  ">": "$gt",
  ">=": "$gte",
  "<": "$lt",
  "<=": "$lte",
  in: "$in",
  nin: "$nin",
  like: "$regex",
};

// Utility to escape regex special characters
const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class BaseService<T extends Document> {
  private _filter: FilterQuery<T> = {};
  private _projection: Record<string, 0 | 1> | null = null;
  private _populate: PopulateOptions[] = [];
  private _page: number = 1;
  private _pageSize: number = 10;

  constructor(private readonly model: Model<T>) {}

  where(
    field: keyof T,
    operator: KeyOperator,
    value: any // More flexible typing
  ): this {
    this._addCondition("$and", field, operator, value);
    return this;
  }

  orWhere(field: keyof T, operator: KeyOperator, value: any): this {
    this._addCondition("$or", field, operator, value);
    return this;
  }

  private _addCondition(
    logic: "$and" | "$or",
    field: keyof T,
    operator: KeyOperator,
    value: any
  ) {
    const mongoOperator = operatorMap[operator];
    if (!mongoOperator) {
      throw new Error(
        `Unsupported operator: ${operator} for field: ${String(field)}`
      );
    }

    if (Array.isArray(value)) {
      if (!["$in", "$nin"].includes(mongoOperator)) {
        throw new Error(
          `Operator "${operator}" does not support array values for field: ${String(
            field
          )}`
        );
      }
      if (value.length === 0) {
        throw new Error(
          `Empty array provided for ${mongoOperator} on field: ${String(field)}`
        );
      }
    }

    const condition: FilterQuery<T> = {
      [field]:
        mongoOperator === "$regex"
          ? { [mongoOperator]: escapeRegex(String(value)), $options: "i" }
          : { [mongoOperator]: value },
    } as FilterQuery<T>;

    if (!this._filter[logic]) this._filter[logic] = [];
    (this._filter[logic] as FilterQuery<T>[]).push(condition);
  }

  project(fields: Record<string, 0 | 1>): this {
    this._projection = fields;
    return this;
  }

  populate(options: string | PopulateOptions): this {
    this._populate.push(
      typeof options === "string" ? { path: options } : options
    );
    return this;
  }

  paginate(page: number, pageSize: number): this {
    if (page < 1) throw new Error("Page number must be at least 1");
    if (pageSize <= 0) throw new Error("Page size must be greater than 0");
    this._page = page;
    this._pageSize = pageSize;
    return this;
  }

  // async find(): Promise<T[]> {
  //   if (Object.keys(this._filter).length === 0) {
  //     throw new Error("No filter conditions provided");
  //   }
  //   return this.model
  //     .find(this._filter, this._projection)
  //     .populate(this._populate)
  //     .skip((this._page - 1) * this._pageSize)
  //     .limit(this._pageSize)
  //     .lean();
  // }

  getRawFilter(): FilterQuery<T> {
    return this._filter;
  }
}

export default new BaseService(UserModel); // Export the class, not an instance
