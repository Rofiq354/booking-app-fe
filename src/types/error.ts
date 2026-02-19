/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MyErrorResponse {
  code: number;
  status: string;
  message: string | Record<string, string>;
  data?: any;
}
