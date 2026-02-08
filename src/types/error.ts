export interface MyErrorResponse {
  code: number;
  success: boolean;
  message: string | Record<string, string>;
}
