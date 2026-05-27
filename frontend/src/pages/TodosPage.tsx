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

export default function TodosPage() {
  const { todos, loading, toggleTodo, deleteTodo, createTodo } = useTodos();

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

        <CreateTaskForm onCreate={createTodo} />

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
