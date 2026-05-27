// Colors
export const colors = {
  primary: "#095f0c",
  success: "#e8f5e9",
  successBorder: "#4caf50",
  successLight: "#66bb6a",
  danger: "#f44336",
  text: {
    primary: "#333",
    secondary: "#999",
    disabled: "#999",
  },
  white: "white",
  error: "#f44336",
  bg: {
    hoverSuccess: "rgba(76, 175, 80, 0.1)",
    hoverDanger: "rgba(244, 67, 54, 0.1)",
    snackbar: "rgba(30, 30, 30, 0.95)",
  },
};

// Shadows
export const shadows = {
  md: "0 4px 20px rgba(0, 0, 0, 0.15)",
  hover: {
    active: "0 2px 8px rgba(76, 175, 80, 0.2)",
    inactive: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  text: "0 2px 4px rgba(0,0,0,0.2)",
};

// Transitions
export const transitions = {
  smooth: "all 0.2s ease",
};

// Gradients
export const gradients = {
  container: "linear-gradient(135deg, #a5b0af 0%, #9ec1ab 100%)",
  purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

// Spacing
export const spacing = {
  sm: 1.5,
  md: 2,
  lg: 3,
  xl: 4,
};

// Font Weights
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Icon Sizes
export const iconSizes = {
  sm: 20,
  md: 24,
  lg: 32,
};

// MUI Theme Configuration
import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    success: {
      main: colors.primary,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
