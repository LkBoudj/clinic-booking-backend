export interface IPaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IPaginatedResult<T> {
  data: T[];
  meta: IPaginatedMeta;
}
