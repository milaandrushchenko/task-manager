import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { TaskList } from "@/components/TaskList";
import { muiTheme } from "@/styles/theme.constants";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <TaskList />
    </ThemeProvider>
  );
}

export default App;
