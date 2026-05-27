import { Container, Paper, Typography, Box } from "@mui/material";
import { TaskList } from "@/components/TaskList";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { useTodos } from "@/hooks/useTodos";
import {
  gradients,
  spacing,
  fontWeights,
  colors,
} from "@/styles/theme.constants";
import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import type { FilterCategoryValue } from "@/types/common.types";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useSnackbar } from "@/contexts/snackbar/useSnackbar";

export default function TodosPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategoryValue>("");
  const { showError } = useSnackbar();
  const { categories } = useCategories();

  const {
    todos,
    toggleTodo,
    deleteTodo,
    loading,
    createTodo,
    toggleMultipleTodos,
    error,
  } = useTodos(selectedCategory === "" ? undefined : selectedCategory);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  return (
    <Container maxWidth="sm" sx={{ py: spacing.xl, pb: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: spacing.xl,
          borderRadius: 3,
          background: gradients.container,
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: spacing.xl,
            fontWeight: fontWeights.bold,
            color: colors.white,
            textAlign: "center",
          }}
        >
          ✓ Task Manager
        </Typography>

        <CreateTaskForm onCreate={createTodo} categories={categories} />

        <CategoryFilter
          value={selectedCategory}
          onChange={setSelectedCategory}
          categories={categories}
        />

        <Box sx={{ mt: spacing.lg }}>
          {!loading && !error && todos.length === 0 && (
            <Box
              sx={{
                py: spacing.xl,
                textAlign: "center",
                color: colors.textMutedLight,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: fontWeights.medium, mb: 0.5 }}
              >
                {selectedCategory === ""
                  ? "No tasks yet"
                  : "No tasks in this category"}
              </Typography>
              <Typography variant="body2">
                {selectedCategory === ""
                  ? "Add your first task above to get started!"
                  : "Try switching filters."}
              </Typography>
            </Box>
          )}

          {(loading || todos.length > 0) && (
            <TaskList
              todos={todos}
              loading={loading}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onCreate={createTodo}
              onToggleMultiple={toggleMultipleTodos}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}
