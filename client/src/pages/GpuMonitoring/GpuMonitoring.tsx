import {
  Box,
  Chip,
  Collapse,
  Divider,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { SecondaryLevelSidebarThemeProvider } from "../../theme";

import { grey } from "@mui/material/colors";

import {
  FetchUserGpuStateResultItem,
  useFetchUserGpuState,
} from "../../features/gpu/gpuAPI";
import { TransitionGroup } from "react-transition-group";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { startMonitoringGpu } from "../../features/gpu";
import { GpuDetailPanel } from ".";
import { useEffect } from "react";

interface GpuInfo {
  id: string;
  name: string;
  host: string;
  port: number;
  gpuModel: string;
}

export const getFakeGpuNameAndModelFromID = (id: string) => {
  const idEnd = id.substring(id.length - 3);
  const indexHex = parseInt(idEnd, 16);
  const gpuModels = [
    "RTX 3080 Ti",
    "RTX 2080 Ti",
    "NVIDIA A100",
    "RTX 3080 Ti",
    "RTX 2080 Ti",
    "NVIDIA A100",
  ];

  return {
    name: `HIT HPC - ${indexHex}`,
    gpuModel: gpuModels[indexHex % gpuModels.length],
  };
};

const GpuMonitoring = () => {
  const { currentMonitoringGpu } = useAppSelector((state) => ({
    currentMonitoringGpu: state.gpu.currentMonitoringGpu,
  }));
  const dispatch = useAppDispatch();

  const [
    fetchUserGpuStateResult,
    fetchUserGpuStateLoading,
    fetchUserGpuStateError,
    fetchUserGpuState,
  ] = useFetchUserGpuState(3);

  const handleItemClicked = (gpuInfo: FetchUserGpuStateResultItem) => {
    if (currentMonitoringGpu) {
      if (currentMonitoringGpu.id == gpuInfo.id) {
        dispatch(startMonitoringGpu(null));
      }
    } else {
      dispatch(startMonitoringGpu(gpuInfo));
    }
  };

  useEffect(() => {
    if (currentMonitoringGpu) {
      const newCurrentMonitoringGpu = fetchUserGpuStateResult.find(
        (item) => item.id === currentMonitoringGpu.id
      );
      if (
        newCurrentMonitoringGpu &&
        newCurrentMonitoringGpu.activated === false
      ) {
        dispatch(startMonitoringGpu(null));
      }
    }
  }, fetchUserGpuStateResult);

  return (
    <Stack direction={"row"} height={"100vh"}>
      <Box
        width={"36rem"}
        sx={{ backgroundColor: grey[100], overflowY: "scroll" }}
        height={"100%"}
      >
        <SecondaryLevelSidebarThemeProvider>
          <Typography padding={"1.6rem 3rem"} variant="h6">
            Active GPU Servers
          </Typography>
          <List disablePadding>
            <TransitionGroup>
              {fetchUserGpuStateResult
                .filter((item) => item.activated)
                .map((gpuInfo) => (
                  <Collapse key={gpuInfo.id}>
                    <ListItem disablePadding key={gpuInfo.id}>
                      <ListItemButton
                        onClick={() => handleItemClicked(gpuInfo)}
                        className={`${
                          currentMonitoringGpu?.id == gpuInfo.id ? "active" : ""
                        }`}
                        sx={{
                          "&.active": {
                            backgroundColor: (theme) =>
                              theme.palette.primary.main,
                            "& .MuiTypography-root.label-primary": {
                              color: grey[50],
                            },
                            "& .MuiTypography-root.label-secondary": {
                              color: grey[500],
                            },
                            "& .MuiChip-root": {
                              backgroundColor: alpha(grey[50], 0.08),
                              "& .MuiChip-label": {
                                color: grey[50],
                              },
                            },
                          },
                        }}
                      >
                        <Stack
                          direction={"row"}
                          width={"100%"}
                          padding={"1.2rem"}
                          justifyContent="space-between"
                        >
                          <Stack>
                            <Typography
                              fontWeight={"bold"}
                              className="label-primary"
                            >
                              {getFakeGpuNameAndModelFromID(gpuInfo.id).name}
                            </Typography>
                            <Typography className="label-secondary">
                              {`${gpuInfo.host}:${gpuInfo.port}`}
                            </Typography>
                          </Stack>
                          <Stack direction="column-reverse">
                            <Chip
                              label={
                                getFakeGpuNameAndModelFromID(gpuInfo.id)
                                  .gpuModel
                              }
                              size="small"
                            />
                          </Stack>
                        </Stack>
                      </ListItemButton>
                    </ListItem>
                  </Collapse>
                ))}
            </TransitionGroup>
          </List>
          <Divider />
          <Typography padding={"1.6rem 3rem"} variant="h6">
            Deactive GPU Servers
          </Typography>
          <List disablePadding>
            <TransitionGroup>
              {fetchUserGpuStateResult
                .filter((item) => !item.activated)
                .map((gpuInfo) => (
                  <Collapse key={gpuInfo.id}>
                    <ListItem disablePadding key={gpuInfo.id}>
                      <ListItemButton disableRipple>
                        <Stack
                          direction={"row"}
                          width={"100%"}
                          padding={"1.2rem"}
                          justifyContent="space-between"
                        >
                          <Stack>
                            <Typography
                              fontWeight={"bold"}
                              className="label-primary"
                            >
                              {getFakeGpuNameAndModelFromID(gpuInfo.id).name}
                            </Typography>
                            <Typography className="label-secondary">
                              {`${gpuInfo.host}:${gpuInfo.port}`}
                            </Typography>
                          </Stack>
                          <Stack justifyContent={"flex-end"}>
                            <Chip
                              label={
                                getFakeGpuNameAndModelFromID(gpuInfo.id)
                                  .gpuModel
                              }
                              size="small"
                            />
                          </Stack>
                        </Stack>
                      </ListItemButton>
                    </ListItem>
                  </Collapse>
                ))}
            </TransitionGroup>
          </List>
        </SecondaryLevelSidebarThemeProvider>
      </Box>
      <Box sx={{ flex: 1 }}>
        <GpuDetailPanel />
      </Box>
    </Stack>
  );
};

export default GpuMonitoring;
