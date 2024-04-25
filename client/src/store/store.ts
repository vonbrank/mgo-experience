import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { gpuReducer } from "../features/gpu";

const store = configureStore({
  reducer: {
    auth: authReducer,
    gpu: gpuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
