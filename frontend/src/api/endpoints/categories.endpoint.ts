import { apiClient } from "../client";
import type { Category, ApiListResponse } from "@/types/api.types";

export const categoriesEndpoint = {
  getAll: (): Promise<ApiListResponse<Category>> =>
    apiClient.get("/categories"),
};
