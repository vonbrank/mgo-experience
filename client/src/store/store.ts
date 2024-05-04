import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { gpuReducer } from "../features/gpu";
import { settingReducer } from "../features/setting";

const store = configureStore({
  reducer: {
    auth: authReducer,
    gpu: gpuReducer,
    setting: settingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
