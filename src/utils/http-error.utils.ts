import createError, { HttpError } from 'http-errors';

export const httpError = (status: number, message: string, details?: any) => {
  const err = createError(status, message) as HttpError & { details?: any };
  if (details) err.details = details;
  return err;
};

export function mapDbError(err: any): HttpError {
  if (err?.code === 11000) {
    return httpError(409, 'فشل القيد الفريد، البيانات موجودة بالفعل');
  }
  if (err?.kind === 'ObjectId' && err?.name === 'CastError') {
    return httpError(404, 'العنصر المطلوب غير موجود');
  }
  return httpError(500, err.message || 'Database error', err);
}
