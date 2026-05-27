import {
  Container,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTodos } from "@/hooks/useTodos";
import { TaskCard } from "./TaskCard";
import { colors, shadows, gradients, spacing } from "@/styles/theme.constants";

export const TaskList = () => {
  const { todos, loading, toggleTodo, deleteTodo } = useTodos();

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

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
            fontWeight: 700,
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
              backgroundColor: "rgba(255, 255, 255, 0.9)",
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
                    fontWeight: 600,
                    color: colors.white,
                    textShadow: shadows.text,
                  }}
                >
                  Active Tasks ({activeTodos.length})
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: spacing.sm }}
                >
                  {activeTodos.map((todo) => (
                    <TaskCard
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
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
                    fontWeight: 600,
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: shadows.text,
                  }}
                >
                  Completed ({completedTodos.length})
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: spacing.sm }}
                >
                  {completedTodos.map((todo) => (
                    <TaskCard
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};
