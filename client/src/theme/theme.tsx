import React, { useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface AppThemeProviderProps {
  lightOrDarkMode?: "light" | "dark" | "follow-system";
  children?: React.ReactNode;
}

interface UseLightOrDarkModeThemeOption {
  lightThemeOptions: ThemeOptions;
  darkThemeOptions?: ThemeOptions;
  lightOrDarkMode?: "light" | "dark" | "follow-system";
}

const useLightOrDarkModeTheme = (option: UseLightOrDarkModeThemeOption) => {
  const {
    lightThemeOptions,
    darkThemeOptions = {
      ...lightThemeOptions,
      palette: {
        ...lightThemeOptions.palette,
        mode: "dark",
      },
    },
    lightOrDarkMode = "light",
  } = option;

  lightThemeOptions.palette && (lightThemeOptions.palette.mode = "light");

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
    () => createTheme(isDarkMode ? darkThemeOptions : lightThemeOptions),
    [isDarkMode]
  );

  return theme;
};

export const AppThemeProvider = (props: AppThemeProviderProps) => {
  const { lightOrDarkMode = "follow-system", children } = props;

  const themeOptions: ThemeOptions = {
    typography: {
      htmlFontSize: 10,
    },
    palette: {
      primary: {
        main: "#4fa03c",
      },
      secondary: {
        main: "#f50057",
      },
    },
  };

  const theme = useLightOrDarkModeTheme({
    lightThemeOptions: themeOptions,
    lightOrDarkMode,
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export const SidebarThemeProvider = (props: AppThemeProviderProps) => {
  const { children } = props;
  const themeOptions: ThemeOptions = {
    typography: {
      htmlFontSize: 10,
    },
    palette: {
      primary: {
        main: "#4fa03c",
      },
      secondary: {
        main: "#f50057",
      },
    },
  };
  const theme = useLightOrDarkModeTheme({
    lightThemeOptions: themeOptions,
    lightOrDarkMode: "dark",
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
