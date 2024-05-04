import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCALES } from "../i18n";

export type DarkMode = "light" | "dark" | "follow-system";

interface SettingState {
  local: keyof typeof LOCALES;
  darkMode: DarkMode;
}

const initialState: SettingState = {
  local: "CHINESE",
  darkMode: "light",
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    updateSetting: (state, action: PayloadAction<SettingState>) => {
      const payload = action.payload;
      state.local = payload.local;
      state.darkMode = payload.darkMode;
    },
  },
});

export const { updateSetting } = settingSlice.actions;

export const settingReducer = settingSlice.reducer;
