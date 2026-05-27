import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { muiTheme } from "@/styles/theme.constants";
import TodosPage from "./pages/TodosPage";
import { SnackbarProvider } from "./contexts/snackbar/SnackbarProvider";
function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <TodosPage />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
