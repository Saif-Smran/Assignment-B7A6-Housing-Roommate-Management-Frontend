export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: { field?: string; message: string }[];
  statusCode?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  pages?: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}
