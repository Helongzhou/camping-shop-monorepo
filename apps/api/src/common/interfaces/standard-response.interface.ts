export interface StandardResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
