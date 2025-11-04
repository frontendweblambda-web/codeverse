export interface QueryParams {
  search?: string;
  order?: "asc" | "desc";
  sortBy?: string;
  skip?: string;
  page?: string;
}
export function queryParams(query: URLSearchParams): QueryParams {
  return Object.fromEntries(query.entries()) as QueryParams;
}
