import { useEffect, useState } from "react";

import { todosEndpoints } from "@/api/endpoints/todos.endpoint";

import type { CreateTodoBody, Todo } from "@/types/api.types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);

      const response = await todosEndpoints.findAll();

      setTodos(response.list ?? []);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setError("Failed to load tasks. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTodos();
  }, []);

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      await todosEndpoints.update(id, {
        completed: !completed,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: !completed,
              }
            : todo,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      throw err;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todosEndpoints.remove(id);

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
      throw err;
    }
  };

  const createTodo = async (data: CreateTodoBody) => {
    try {
      const newTodo = await todosEndpoints.create(data);

      setTodos((prev) => [newTodo, ...prev]);

      return newTodo;
    } catch (err) {
      console.error("Failed to create todo:", err);
      throw err;
    }
  };

  return {
    todos,
    loading,
    error,
    toggleTodo,
    deleteTodo,
    createTodo,
    refetch: fetchTodos,
  };
};
