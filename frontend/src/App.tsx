import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { muiTheme } from "@/styles/theme.constants";
import TodosPage from "./pages/TodosPage";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <TodosPage />
    </ThemeProvider>
  );
}

export default App;
