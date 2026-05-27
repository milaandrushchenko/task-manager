import { apiClient } from "../client";
import type {
  ApiActionResponse,
  ApiListResponse,
  CreateTodoBody,
  Todo,
  UpdateTodoBody,
} from "@/types/api.types";

export const todosEndpoints = {
  findAll: (categoryId?: number): Promise<ApiListResponse<Todo>> =>
    apiClient.get("/todos", { params: { categoryId } }),

  findOne: (id: number): Promise<Todo> => apiClient.get(`/todos/${id}`),

  create: (data: CreateTodoBody): Promise<ApiActionResponse<Todo>> =>
    apiClient.post("/todos", data),

  update: (
    id: number,
    data: UpdateTodoBody,
  ): Promise<ApiActionResponse<Todo>> => apiClient.patch(`/todos/${id}`, data),

  remove: (id: number): Promise<ApiActionResponse<Todo>> =>
    apiClient.delete(`/todos/${id}`),

  updateStatusBulk: (
    ids: number[],
    completed: boolean,
  ): Promise<ApiActionResponse<{ count: number }>> =>
    apiClient.patch("/todos/bulk/status", { ids, completed }),
};
