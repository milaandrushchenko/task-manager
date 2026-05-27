import { Alert, Button, Snackbar } from "@mui/material";
import { fontWeights, colors, shadows } from "@/styles/theme.constants";
import type { Todo } from "@/types/api.types";

export const SNACKBAR_DURATION = 5000;
export const SNACKBAR_ERROR_DURATION = 8000;

export interface TodoSnackbarState {
  open: boolean;
  message: string;
  actionType: "toggle" | "delete" | "bulk_done" | null;
  taskData: Todo | Todo[] | null;
  severity: "info" | "error";
}

interface TodoSnackbarProps {
  state: TodoSnackbarState;
  onClose: () => void;
  onUndo: () => Promise<void>;
}

export const TodoSnackbar = ({ state, onClose, onUndo }: TodoSnackbarProps) => {
  return (
    <Snackbar
      open={state.open}
      autoHideDuration={
        state.severity === "error" ? SNACKBAR_ERROR_DURATION : SNACKBAR_DURATION
      }
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={state.severity}
        variant="filled"
        sx={{
          backgroundColor:
            state.severity === "info" ? colors.bg.snackbar : undefined,
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
          state.severity === "info" ? (
            <Button
              color="primary"
              size="small"
              onClick={onUndo}
              sx={{
                color: colors.successLight,
                fontWeight: fontWeights.semibold,
                marginLeft: 1,
              }}
            >
              UNDO
            </Button>
          ) : null
        }
      >
        {state.message}
      </Alert>
    </Snackbar>
  );
};
