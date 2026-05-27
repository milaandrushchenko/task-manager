import {
  Container,
  Paper,
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { useTodos } from "@/hooks/useTodos";
import { TaskCard } from "./TaskCard";
import {
  colors,
  shadows,
  gradients,
  spacing,
  fontWeights,
} from "@/styles/theme.constants";
import { useState } from "react";
import type { Todo } from "@/types/api.types";

interface SnackbarState {
  open: boolean;
  message: string;
  actionType: "toggle" | "delete" | null;
  taskData: Todo | null;
}

const SNACKBAR_DURATION = 5000;

export const TaskList = () => {
  const { todos, loading, toggleTodo, deleteTodo, createTodo } = useTodos();

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    actionType: null,
    taskData: null,
  });

  const handleToggle = async (id: number, currentCompleted: boolean) => {
    const targetTask = todos.find((t) => t.id === id);
    if (!targetTask) return;

    await toggleTodo(id, currentCompleted);

    setSnackbar({
      open: true,
      message: currentCompleted ? "Task marked as active" : "Task completed!",
      actionType: "toggle",
      taskData: targetTask,
    });
  };

  const handleDelete = async (id: number) => {
    const targetTask = todos.find((t) => t.id === id);
    if (!targetTask) return;

    await deleteTodo(id);

    setSnackbar({
      open: true,
      message: "Task deleted",
      actionType: "delete",
      taskData: targetTask,
    });
  };

  const handleUndo = async () => {
    const { actionType, taskData } = snackbar;
    if (!taskData) return;

    try {
      if (actionType === "delete") {
        await createTodo({
          text: taskData.text,
          categoryId: taskData.categoryId,
        });
      } else if (actionType === "toggle") {
        await toggleTodo(taskData.id, !taskData.completed);
      }
    } catch (err) {
      console.error("Failed to undo action:", err);
    } finally {
      handleCloseSnackbar();
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
      <Paper
        elevation={3}
        sx={{
          p: spacing.xl,
          borderRadius: 3,
          background: gradients.container,
          minHeight: "100vh",
        }}
      >
        {/* Header */}
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
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: spacing.lg }}
          >
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
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={SNACKBAR_DURATION}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          variant="filled"
          sx={{
            backgroundColor: colors.bg.snackbar,
            color: colors.white,
            borderRadius: 2,
            boxShadow: shadows.md,
            width: "100%",
            "& .MuiAlert-action": {
              paddingTop: 0,
              paddingBottom: 0,
              alignItems: "center",
            },
          }}
          action={
            <Button
              color="primary"
              size="small"
              onClick={handleUndo}
              sx={{
                color: colors.successLight,
                fontWeight: fontWeights.semibold,
                marginLeft: 1,
              }}
            >
              UNDO
            </Button>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
