import axios, { AxiosError } from "axios";
import type { MyErrorResponse } from "../types/error";

export const getErrorMessage = (error: unknown): MyErrorResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<MyErrorResponse>;

    return {
      message: axiosError.response?.data?.message || "Gagal menghubungi server",
      code:
        axiosError.response?.data?.code || axiosError.response?.status || 500,
      status: axiosError.response?.data?.status || "error",
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 500,
      status: "error",
    };
  }

  return {
    message: "Kesalahan tidak diketahui",
    code: 500,
    status: "error",
  };
};
