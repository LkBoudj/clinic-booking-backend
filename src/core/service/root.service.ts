import {
  FilterQuery,
  Model,
  PopulateOptions,
  Document,
  QueryOptions,
} from "mongoose";
import { IPaginatedResult } from "../../types";
import { EMODE, Env } from "../../config/env.config";

/**
 * Abstract base service class providing reusable query functionality
 * for MongoDB models using Mongoose.
 *
 * @template T - The document type extending Mongoose's Document
 */
export default abstract class RootService<T extends Document> {
  protected _filter: FilterQuery<T> = {};
  protected _select: string | null = null;
  protected _populate: PopulateOptions[] = [];
  protected _page: number = 1;
  protected _pageSize: number = 10;
  protected _is_paginate: boolean = false;
  protected _options: QueryOptions = {};

  /**
   * Appends filter conditions using logical "$and" or "$or".
   *
   * @param filter - Mongoose filter query
   * @param merge - Merge strategy ("$and" or "$or"), defaults to "$and"
   * @returns this - for chaining
   * @throws Error if filter is empty
   */
  where(filter: FilterQuery<T>, merge: "$and" | "$or" = "$and"): this {
    if (Object.keys(filter).length === 0) {
      throw new Error("Filter cannot be empty");
    }
    if (Object.keys(this._filter).length === 0) {
      this._filter = filter;
    } else {
      this._filter = { [merge]: [this._filter, filter] } as FilterQuery<T>;
    }
    return this;
  }

  /**
   * Resets internal query parameters to their default values.
   * Called automatically after query execution or manually during dev mode.
   */
  protected _clear() {
    this._filter = {};
    this._select = null;
    this._populate = [];
    this._page = 1;
    this._pageSize = 10;
    this._is_paginate = false;
    this._options = {};

    if (Env.NODE_ENV === EMODE.DEV) {
      console.log("BaseService: State has been reset.");
    }
  }

  /**
   * Sets the fields to select from the result documents.
   *
   * @param fields - Array of document keys to include in the output
   * @returns this - for chaining
   * @throws Error if no fields are provided
   */
  select(fields: (keyof T)[]): this {
    if (!fields.length) {
      throw new Error("Select fields cannot be empty");
    }
    this._select = fields.join(" ").trim();
    return this;
  }

  /**
   * Adds population options to populate referenced documents.
   *
   * @param options - Either a path string or a Mongoose PopulateOptions object
   * @returns this - for chaining
   * @throws Error if population path is missing
   */
  populate(options: string | PopulateOptions): this {
    const pop = typeof options === "string" ? { path: options } : options;
    if (!pop.path) {
      throw new Error("Population path cannot be empty");
    }
    this._populate.push(pop);
    return this;
  }

  /**
   * Enables pagination and sets the page number and page size.
   *
   * @param page - Current page number (1-based)
   * @param pageSize - Number of items per page
   * @returns this - for chaining
   */
  paginate(page: number | null, pageSize: number | null): this {
    this._page = page ?? this._page;
    this._pageSize = pageSize ?? this._pageSize;
    this._is_paginate = true;
    return this;
  }

  /**
   * Adds or overrides additional Mongoose query options.
   *
   * @param queryOptions - Mongoose query options such as sort, lean, etc.
   * @returns this - for chaining
   */
  options(queryOptions: QueryOptions): this {
    this._options = { ...this._options, ...queryOptions };
    return this;
  }

  /**
   * Optionally formats the final paginated result. Override if needed.
   *
   * @param result - Paginated result from the query
   * @returns The same result by default
   */
  paginateResult(result: IPaginatedResult<T>): IPaginatedResult<T> {
    return result;
  }
}
