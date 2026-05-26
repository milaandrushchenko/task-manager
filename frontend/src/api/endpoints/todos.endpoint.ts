import { apiClient } from "../client";
import type {
  ApiActionResponse,
  ApiListResponse,
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
} from "@/types/api.types";

export const todosEndpoints = {
  findAll: (categoryId?: number): Promise<ApiListResponse<Todo>> =>
    apiClient.get("/todos", { params: { categoryId } }),

  findOne: (id: number): Promise<Todo> => apiClient.get(`/todos/${id}`),

  create: (data: CreateTodoInput): Promise<ApiActionResponse<Todo>> =>
    apiClient.post("/todos", data),

  update: (
    id: number,
    data: UpdateTodoInput,
  ): Promise<ApiActionResponse<Todo>> => apiClient.patch(`/todos/${id}`, data),

  remove: (id: number): Promise<ApiActionResponse<Todo>> =>
    apiClient.delete(`/todos/${id}`),

  markAsDoneBulk: (
    ids: number[],
  ): Promise<ApiActionResponse<{ count: number }>> =>
    apiClient.patch("/todos/bulk/done", { ids }),
};
