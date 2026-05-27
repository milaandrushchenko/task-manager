import { useEffect, useState } from "react";

import { todosEndpoints } from "@/api/endpoints/todos.endpoint";

import type { Todo } from "@/types/api.types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      setLoading(true);

      const response = await todosEndpoints.findAll();

      setTodos(response.list ?? []);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
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
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todosEndpoints.remove(id);

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return {
    todos,
    loading,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
};
