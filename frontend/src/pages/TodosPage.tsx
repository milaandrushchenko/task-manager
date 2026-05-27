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
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import type { FilterCategoryValue } from "@/types/common.types";
import { CategoryFilter } from "@/components/CategoryFilter";

export default function TodosPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategoryValue>("");

  const { categories } = useCategories();

  const { todos, toggleTodo, deleteTodo, loading, createTodo } = useTodos(
    selectedCategory === "" ? undefined : selectedCategory,
  );

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
          <TaskList
            todos={todos}
            loading={loading}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onCreate={createTodo}
          />
        </Box>
      </Paper>
    </Container>
  );
}
