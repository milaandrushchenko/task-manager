import { useState } from "react";
import {
  Paper,
  Box,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { DoneAll as DoneIcon } from "@mui/icons-material";
import { TaskCard } from "./TaskCard";
import {
  colors,
  shadows,
  spacing,
  fontWeights,
} from "@/styles/theme.constants";
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
  actionType: "toggle" | "delete" | "bulk_done" | null;
  taskData: Todo | Todo[] | null;
  severity: "info" | "error";
}

interface TaskListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: number, currentCompleted: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCreate: (data: CreateTodoBody) => Promise<ApiActionResponse<Todo>>;
  onToggleMultiple: (ids: number[], completed: boolean) => Promise<void>;
}

export const TaskList = ({
  todos,
  loading,
  onToggle,
  onDelete,
  onCreate,
  onToggleMultiple,
}: TaskListProps) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    actionType: null,
    taskData: null,
    severity: "info",
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(activeTodos.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectTodo = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id),
    );
  };

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

  const handleBulkMarkAsDone = async () => {
    if (selectedIds.length === 0) return;

    const tasksToUpdate = todos.filter((t) => selectedIds.includes(t.id));

    await executeTaskAction(
      () => onToggleMultiple(selectedIds, true),
      {
        message: `Marked ${selectedIds.length} tasks as done`,
        actionType: "bulk_done",
        taskData: tasksToUpdate,
      },
      "Failed to update selected tasks.",
    );
    setSelectedIds([]);
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

    const undoAction = async () => {
      if (actionType === "bulk_done" && Array.isArray(taskData)) {
        const ids = taskData.map((task) => task.id);
        return onToggleMultiple(ids, false);
      }

      if (!Array.isArray(taskData)) {
        return actionType === "delete"
          ? onCreate({ text: taskData.text, categoryId: taskData.categoryId })
          : onToggle(taskData.id, !taskData.completed);
      }
    };

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

  const isAllSelected =
    activeTodos.length > 0 && selectedIds.length === activeTodos.length;

  return (
    <>
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
          {activeTodos.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: "4px 8px",
                backgroundColor: colors.bulk.panelBg,
                borderRadius: 2,
                backdropFilter: "blur(4px)",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < activeTodos.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{
                      color: colors.white,
                      "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                        color: colors.white,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: colors.white,
                      fontWeight: fontWeights.medium,
                      fontSize: "0.9rem",
                    }}
                  >
                    Select All Active ({activeTodos.length})
                  </Typography>
                }
              />

              {selectedIds.length > 0 && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DoneIcon />}
                  onClick={handleBulkMarkAsDone}
                  sx={{
                    backgroundColor: colors.white,
                    color: colors.text.primary,
                    fontWeight: fontWeights.semibold,
                    textTransform: "none",
                    borderRadius: 1.5,
                    "&:hover": {
                      backgroundColor: colors.bg.mutedLight,
                    },
                  }}
                >
                  Mark Done ({selectedIds.length})
                </Button>
              )}
            </Box>
          )}

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
                  <Box
                    key={todo.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: 36,
                        justifyContent: "center",
                      }}
                    >
                      <Checkbox
                        checked={selectedIds.includes(todo.id)}
                        onChange={(e) =>
                          handleSelectTodo(todo.id, e.target.checked)
                        }
                        sx={{
                          backgroundColor: colors.bulk.panelBg,
                          p: 0,
                          "&.Mui-checked": {
                            color: colors.white,
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 20,
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <TaskCard
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

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
                  <Box
                    key={todo.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ width: 36 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <TaskCard
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    </Box>
                  </Box>
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
    </>
  );
};
