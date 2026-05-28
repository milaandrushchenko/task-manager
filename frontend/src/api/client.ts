import axios from "axios";
import type { AxiosResponse } from "axios";
import axiosRetry from "axios-retry";

const RETRY_CONFIG = {
  TIMEOUT_MS: 20000,
  MAX_RETRIES: 5,
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: RETRY_CONFIG.TIMEOUT_MS,
  headers: {},
});

axiosRetry(apiClient, {
  retries: RETRY_CONFIG.MAX_RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status ? error.response.status >= 500 : false)
    );
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    console.error("API Error:", message);
    return Promise.reject(error);
  },
);
