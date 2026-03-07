export class BaseResponse<T> {
  data: T[] = [];
  totalItems: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 0;
  page: number = 0;
}