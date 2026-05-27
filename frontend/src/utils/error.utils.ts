import axios from "axios";

export const getErrorMessage = (
  err: unknown,
  defaultMessage = "Something went wrong. Please try again.",
) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || defaultMessage;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return defaultMessage;
};
