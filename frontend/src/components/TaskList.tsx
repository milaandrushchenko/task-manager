import {
  Container,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { TaskCard } from "./TaskCard";
import {
  colors,
  shadows,
  spacing,
  fontWeights,
} from "@/styles/theme.constants";
import { useState } from "react";
import type {
  ApiActionResponse,
  CreateTodoBody,
  Todo,
} from "@/types/api.types";
import { getErrorMessage } from "@/utils/error.utils";
import { TodoSnackbar } from "./TodoSnackbar";

interface SnackbarState {
  open: boolean;
  message: string;
  actionType: "toggle" | "delete" | null;
  taskData: Todo | null;
  severity: "info" | "error";
}
interface TaskListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: number, currentCompleted: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCreate: (data: CreateTodoBody) => Promise<ApiActionResponse<Todo>>;
}

export const TaskList = ({
  todos,
  loading,
  onToggle,
  onDelete,
  onCreate,
}: TaskListProps) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    actionType: null,
    taskData: null,
    severity: "info",
  });

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const executeTaskAction = async (
    action: () => Promise<unknown>,
    successConfig: Omit<SnackbarState, "open" | "severity">,
    defaultErrorMessage: string,
  ) => {
    try {
      await action();

      setSnackbar({
        ...successConfig,
        open: true,
        severity: "info",
      });
    } catch (err) {
      console.error(defaultErrorMessage, err);

      setSnackbar({
        open: true,
        message: getErrorMessage(err, defaultErrorMessage),
        actionType: null,
        taskData: null,
        severity: "error",
      });
    }
  };

  const handleToggle = async (id: number, currentCompleted: boolean) => {
    const targetTask = todos.find((t) => t.id === id);
    if (!targetTask) return;

    await executeTaskAction(
      () => onToggle(id, currentCompleted),
      {
        message: currentCompleted ? "Task marked as active" : "Task completed!",
        actionType: "toggle",
        taskData: targetTask,
      },
      "Failed to update task status.",
    );
  };

  const handleDelete = async (id: number) => {
    const targetTask = todos.find((t) => t.id === id);
    if (!targetTask) return;

    await executeTaskAction(
      () => onDelete(id),
      {
        message: "Task deleted",
        actionType: "delete",
        taskData: targetTask,
      },
      "Failed to delete task.",
    );
  };

  const handleUndo = async () => {
    const { actionType, taskData } = snackbar;
    if (!taskData) return;

    const undoAction = () =>
      actionType === "delete"
        ? onCreate({ text: taskData.text, categoryId: taskData.categoryId })
        : onToggle(taskData.id, !taskData.completed);

    try {
      await undoAction();
      handleCloseSnackbar();
    } catch (err) {
      console.error("Failed to undo action:", err);

      setSnackbar({
        open: true,
        message: getErrorMessage(err, "Failed to undo action."),
        actionType: null,
        taskData: null,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (
    _?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="sm" sx={{ py: spacing.xl, pb: 8 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: colors.white }} />
        </Box>
      ) : todos.length === 0 ? (
        <Paper
          sx={{
            p: spacing.xl,
            textAlign: "center",
            backgroundColor: colors.white,
            borderRadius: 2,
          }}
        >
          <Typography color="textSecondary">
            No tasks yet. Create one to get started!
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: spacing.lg }}>
          {/* Active Tasks */}
          {activeTodos.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: spacing.md,
                  fontWeight: fontWeights.semibold,
                  color: colors.white,
                  textShadow: shadows.text,
                }}
              >
                Active Tasks ({activeTodos.length})
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.sm,
                }}
              >
                {activeTodos.map((todo) => (
                  <TaskCard
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Completed Tasks */}
          {completedTodos.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: spacing.md,
                  fontWeight: fontWeights.semibold,
                  color: colors.white,
                  textShadow: shadows.text,
                }}
              >
                Completed ({completedTodos.length})
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.sm,
                }}
              >
                {completedTodos.map((todo) => (
                  <TaskCard
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      <TodoSnackbar
        state={snackbar}
        onClose={handleCloseSnackbar}
        onUndo={handleUndo}
      />
    </Container>
  );
};
