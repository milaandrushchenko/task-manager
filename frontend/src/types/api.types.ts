export type ApiActionResponse<T> = {
  success: boolean;
} & T;

export interface ApiListResponse<T> {
  list: T[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  categoryId: number;
  createdAt: string;
  category?: Category;
}

export type CreateTodoInput = Omit<Todo, "id" | "createdAt" | "category">;

export type UpdateTodoInput = Partial<CreateTodoInput>;
