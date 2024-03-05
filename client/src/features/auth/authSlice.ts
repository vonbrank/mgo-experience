import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { login } = authSlice.actions;

export const authReducer = authSlice.reducer;
