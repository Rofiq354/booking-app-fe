import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Gagal menghubungi server";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui";
};
