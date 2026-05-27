import { createContext } from "react";

export interface SnackbarContextType {
  showInfo: <T>(message: string, onUndo?: () => Promise<T>) => void;
  showError: (message: string) => void;
  closeSnackbar: () => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);
