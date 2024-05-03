import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import { SecondaryLevelSidebarThemeProvider } from "../../theme";

import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";

import { useFetchGpuStats } from "../../features/gpu/gpuAPI";

import { GpuModel } from "../../features/gpu";
import { GpuMonitoringOverview } from ".";
import { useAppSelector } from "../../store/hooks";
import GpuMonitoringDetail from "./GpuMonitoringDetail";

export const GpuDetailPanel = () => {
  const { currentMonitoringGpu } = useAppSelector((state) => ({
    currentMonitoringGpu: state.gpu.currentMonitoringGpu,
  }));

  if (currentMonitoringGpu) {
    return <GpuDetail gpuModel={currentMonitoringGpu} />;
  }

  return <GpuDetailEmpty />;
};

export const GpuDetailEmpty = () => {
  return (
    <Stack height={"100vh"} alignItems={"center"} justifyContent={"center"}>
      <Typography variant="h5">
        Click on any actived server to monitor.
      </Typography>
    </Stack>
  );
};

interface GpuDetailProps {
  gpuModel: GpuModel;
}

const ALL_GPU_DETAIL_TAB_TYPES = ["overview", "detail", "benchmark"] as const;

type GpuDetailTabType = (typeof ALL_GPU_DETAIL_TAB_TYPES)[number];

const gpuDetailTabTypeToString = (type: GpuDetailTabType) => {
  switch (type) {
    case "overview":
      return "Overview";
    case "detail":
      return "Detail";
    case "benchmark":
      return "Benchmark";
  }
};

export const GpuDetail = (props: GpuDetailProps) => {
  const { gpuModel } = props;

  const [currentTab, setCurrentTab] = useState<GpuDetailTabType>("overview");

  const defaultTabType: GpuDetailTabType = "overview";

  const gpuDetailTabTypes: GpuDetailTabType[] = [
    "overview",
    "detail",
    "benchmark",
  ];

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: GpuDetailTabType
  ) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    setCurrentTab("overview");
  }, [gpuModel]);

  const [gpuStatData, loading, error, fetch] = useFetchGpuStats(
    gpuModel.host,
    gpuModel.port,
    undefined,
    undefined
  );

  return (
    <SecondaryLevelSidebarThemeProvider>
      <Stack maxHeight={"100vh"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingRight={"1.2rem"}
        >
          <Tabs value={currentTab} onChange={handleTabChange}>
            {gpuDetailTabTypes.map((gpuDetailTabType) => (
              <Tab
                label={gpuDetailTabTypeToString(gpuDetailTabType)}
                value={gpuDetailTabType}
                key={gpuDetailTabType}
              />
            ))}
          </Tabs>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </Stack>
        <Divider flexItem />
        <Box sx={{ flex: 1, overflowY: "scroll" }}>
          {currentTab === "overview" && (
            <GpuMonitoringOverview
              gpuModel={gpuModel}
              gpuStatDataSequence={gpuStatData}
            />
          )}
          {currentTab === "detail" && <GpuMonitoringDetail />}
        </Box>
      </Stack>
    </SecondaryLevelSidebarThemeProvider>
  );
};

interface MonitoringInformationContainerProps {
  label: string;
  value: string;
}

const MonitoringInformationContainer = (
  props: MonitoringInformationContainerProps
) => {
  const { label, value } = props;
  return (
    <Stack direction={"row"}>
      <Typography sx={{ flex: 1, width: 0 }}>{label}</Typography>
      <Typography sx={{ flex: 2, width: 0 }}>{value}</Typography>
    </Stack>
  );
};

function generateSmoothCPULoadValues() {
  const currentTime = Date.now();
  let values: [number, number][] = [];
  const maxCPULoad = 100;
  let prevLoad = Math.floor(Math.random() * (maxCPULoad + 1));

  for (let i = 100; i >= 0; i--) {
    // const amplitude = Math.round(Math.random() * 10) + 10;
    // const nextLoad =
    //   prevLoad + Math.floor(Math.random() * amplitude) - amplitude / 2; // Random change up to 3 units
    const newLoad = Math.floor(Math.random() * (maxCPULoad + 1)); // Ensure load stays within 0-100 range

    values = [...values, [currentTime - i * 1000, newLoad]];
    prevLoad = newLoad;
  }
  return values;
}
