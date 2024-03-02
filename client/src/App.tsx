import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
