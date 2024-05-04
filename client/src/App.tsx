import { AppThemeProvider } from "./theme";
import { ToastProvider } from "material-ui-toast-wrapper";
import { RouterProvider } from "react-router-dom";
import { IntlProvider } from "react-intl";
import router from "./router";
import { useAppSelector } from "./store/hooks";
import { LOCALES, messages, flattenMessages } from "./features/i18n";

function App() {
  const { setting } = useAppSelector((state) => ({
    setting: state.setting,
  }));

  return (
    <IntlProvider
      messages={flattenMessages(messages[LOCALES[setting.local]] as any)}
      locale={LOCALES[setting.local]}
      defaultLocale={LOCALES.ENGLISH}
    >
      <AppThemeProvider lightOrDarkMode={setting.darkMode}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AppThemeProvider>
    </IntlProvider>
  );
}

export default App;
