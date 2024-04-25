import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GpuModel {
  id: string;
  host: string;
  port: string;
  lastHeartBeatAt: string;
  activated: boolean;
}

interface GpuState {
  currentMonitoringGpu: GpuModel | null;
}

const initialState: GpuState = {
  currentMonitoringGpu: null,
};

const gpuSlice = createSlice({
  name: "gpu",
  initialState,
  reducers: {
    startMonitoringGpu: (state, action: PayloadAction<GpuModel | null>) => {
      state.currentMonitoringGpu = action.payload;
    },
  },
});

export const { startMonitoringGpu } = gpuSlice.actions;

export const gpuReducer = gpuSlice.reducer;
