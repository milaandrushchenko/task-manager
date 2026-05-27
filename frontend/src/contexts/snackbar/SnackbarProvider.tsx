import { useState, type ReactNode } from "react";
import {
  TodoSnackbar,
  type TodoSnackbarState,
} from "@/components/TodoSnackbar";
import { SnackbarContext } from "./SnackbarContext";

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TodoSnackbarState>({
    open: false,
    message: "",
    actionType: null,
    taskData: null,
    severity: "info",
  });

  const [undoCallback, setUndoCallback] = useState<() => Promise<void>>(
    async () => {},
  );

  const showInfo = (message: string, onUndo: () => Promise<void>) => {
    setUndoCallback(() => onUndo);
    setState({
      open: true,
      message,
      actionType: "toggle",
      taskData: null,
      severity: "info",
    });
  };

  const showError = (message: string) => {
    setState({
      open: true,
      message,
      actionType: null,
      taskData: null,
      severity: "error",
    });
  };

  const closeSnackbar = () => setState((prev) => ({ ...prev, open: false }));

  return (
    <SnackbarContext.Provider value={{ showInfo, showError, closeSnackbar }}>
      {children}
      <TodoSnackbar
        state={state}
        onClose={closeSnackbar}
        onUndo={undoCallback}
      />
    </SnackbarContext.Provider>
  );
};
