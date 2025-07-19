import { Document, RootQuerySelector } from "mongoose";
import { NextFunction, Request, Response } from "express";
import BaseService from "../service/base.service";
import { sendSuccess } from "../../utils/response.util";
import NotFoundError from "../errors/NotFound";

/**
 * Interface for generic controller defining basic CRUD operations.
 */
interface IBaseController {
  list(req: Request, res: Response, next: NextFunction): void;
  findById(req: Request, res: Response, next: NextFunction): void;
  create(req: Request, res: Response, next: NextFunction): void;
  update(req: Request, res: Response, next: NextFunction): void;
  delete(req: Request, res: Response, next: NextFunction): void;
}

/**
 * BaseController<T, S>
 * ----------------------
 * A generic controller providing common CRUD operations.
 *
 * @template T - The Mongoose Document type
 * @template S - The service that extends BaseService<T>
 */
export default class BaseController<
  T extends Document,
  S extends BaseService<T>
> implements IBaseController
{
  constructor(private readonly service: S) {}

  /**
   * @function list
   * @description Retrieves a list of resources with optional pagination, search, and filtering.
   *
   * @request query:
   *    - page (optional): number
   *    - limit (optional): number
   *    - search (optional): string
   *    - other filters (optional): object
   *
   * @response 200: JSON array of resource documents
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search, ...restQuery } =
        req.validated?.query ?? req.query;

      let service = await this.service;

      if (search) {
        this.service.search(search);
      }
      if (restQuery) {
        this.service.filter(restQuery);
      }
      if (page || limit) {
        service = await this.service.paginate(page, limit);
      }

      const users = await service.list();
      sendSuccess({ res, data: users });
    } catch (e) {
      next(e);
    }
  };

  /**
   * @function findById
   * @description Retrieves a single resource by its ID.
   *
   * @request params:
   *    - id: string (resource identifier)
   *
   * @response 200: JSON resource document
   * @response 404: Resource not found
   */
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resource = await this.service.findById(id);

      if (!resource) {
        throw new NotFoundError("Resource not found");
      }

      sendSuccess({ res, data: resource });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @function create
   * @description Creates a new resource.
   *
   * @request body: object (resource data)
   * @response 201: JSON of the newly created resource
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.validated?.body ?? req.body;
      const model = await this.service.create(payload);

      sendSuccess({ res, data: model });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @function update
   * @description Updates an existing resource by ID.
   *
   * @request params:
   *    - id: string (resource identifier)
   * @request body: object (updated fields)
   *
   * @response 200: JSON of the updated resource
   * @response 404: Resource not found
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // const resource = await this.service.findById(id);

      // if (!resource) {
      //   throw new NotFoundError("Resource not found");
      // }
      const payload = req.validated?.body ?? req.body;

      const model = await this.service.update(id, payload);

      sendSuccess({ res, data: model });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @function delete
   * @description Deletes a resource by ID.
   *
   * @request params:
   *    - id: string (resource identifier)
   *
   * @response 204: No content (successful deletion)
   * @response 404: Resource not found
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      sendSuccess({ res, data: result });
    } catch (e) {
      next(e);
    }
  }
}
