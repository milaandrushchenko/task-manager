import { Paper, Checkbox, IconButton, Box, Typography } from "@mui/material";
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import type { Todo } from "@/types/api.types";
import {
  colors,
  shadows,
  transitions,
  spacing,
  fontWeights,
  iconSizes,
} from "@/styles/theme.constants";

interface TaskCardProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TaskCard = ({ todo, onToggle, onDelete }: TaskCardProps) => {
  const isCompleted = todo.completed;

  return (
    <Paper
      elevation={isCompleted ? 0 : 2}
      sx={{
        p: spacing.md,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: spacing.sm,
        backgroundColor: isCompleted ? colors.success : colors.white,
        border: isCompleted ? `2px solid ${colors.primary}` : "none",
        cursor: "pointer",
        transition: transitions.smooth,
        "&:hover": {
          boxShadow: isCompleted
            ? shadows.hover.active
            : shadows.hover.inactive,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Checkbox
        checked={isCompleted}
        onChange={() => onToggle(todo.id, todo.completed)}
        sx={{
          color: isCompleted ? colors.primary : "default",
          "&.Mui-checked": {
            color: colors.primary,
          },
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            textDecoration: isCompleted ? "line-through" : "none",
            color: isCompleted ? colors.primary : colors.text.primary,
            fontWeight: isCompleted ? fontWeights.medium : fontWeights.regular,
            fontSize: "1rem",
          }}
        >
          {todo.text}
        </Typography>
        {todo.category && (
          <Typography
            variant="caption"
            sx={{
              color: isCompleted ? colors.successLight : colors.text.secondary,
              display: "block",
              mt: 0.5,
            }}
          >
            {todo.category.name}
          </Typography>
        )}
      </Box>

      {isCompleted && (
        <CheckCircleIcon
          sx={{ color: colors.primary, fontSize: iconSizes.md }}
        />
      )}

      <IconButton
        onClick={() => onDelete(todo.id)}
        size="small"
        sx={{
          color: isCompleted ? colors.primary : colors.danger,
          "&:hover": {
            backgroundColor: isCompleted
              ? colors.bg.hoverSuccess
              : colors.bg.hoverDanger,
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};
