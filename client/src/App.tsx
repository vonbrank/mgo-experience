import { AppThemeProvider } from "./theme";
import { ToastProvider } from "material-ui-toast-wrapper";
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <AppThemeProvider lightOrDarkMode="light">
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AppThemeProvider>
  );
}

export default App;
