import React, { useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface AppThemeProviderProps {
  lightOrDarkMode?: "light" | "dark" | "follow-system";
  children?: React.ReactNode;
}

export const AppThemeProvider = (props: AppThemeProviderProps) => {
  const { lightOrDarkMode = "follow-system", children } = props;

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isDarkMode = useMemo(() => {
    switch (lightOrDarkMode) {
      case "follow-system":
        return prefersDarkMode;
      case "light":
        return false;
      case "dark":
        return true;
    }
  }, [prefersDarkMode, lightOrDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          htmlFontSize: 10,
        },
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: "#4fa03c",
          },
          secondary: {
            main: "#f50057",
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export const SidebarThemeProvider = (props: AppThemeProviderProps) => {
  const { children } = props;
  const theme = createTheme({
    typography: {
      htmlFontSize: 10,
    },
    palette: {
      mode: "dark",
      primary: {
        main: "#4fa03c",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
