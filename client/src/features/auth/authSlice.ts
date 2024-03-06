import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_JWT_KEY } from "./authAPI";

export interface UserBase {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: UserBase | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserBase>) => {
      const user = action.payload;
      state.user = { ...user };
    },
    logout: (state) => {
      localStorage.removeItem(LOCAL_STORAGE_JWT_KEY);
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
