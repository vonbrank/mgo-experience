import { AppThemeProvider } from "./theme";
import { ToastProvider } from "material-ui-toast-wrapper";

function App() {
  return (
    <AppThemeProvider lightOrDarkMode="light">
      <ToastProvider></ToastProvider>
    </AppThemeProvider>
  );
}

export default App;
