import {
  Box,
  Card,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { SecondaryLevelSidebarThemeProvider } from "../../theme";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { MonitoringBlockContainer } from "../../components/Container";
import ReactApexChart from "react-apexcharts";
import {
  FetchUserGpuStateResultItem,
  useFetchGpuStats,
  useFetchUserGpuState,
} from "../../features/gpu/gpuAPI";
import { TransitionGroup } from "react-transition-group";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { GpuModel, startMonitoringGpu } from "../../features/gpu";

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

  const navigate = useNavigate();
  let { gpuId } = useParams();

  useEffect(() => {
    const gpuItem = fetchUserGpuStateResult.find((item) => item.id === gpuId);

    if (gpuItem && !gpuItem.activated) {
      navigate("/monitoring-gpus");
    }
  }, [navigate, fetchUserGpuStateResult, gpuId]);

  const handleItemClicked = (gpuInfo: FetchUserGpuStateResultItem) => {
    if (currentMonitoringGpu) {
      if (currentMonitoringGpu.id == gpuInfo.id) {
        dispatch(startMonitoringGpu(null));
      }
    } else {
      dispatch(startMonitoringGpu(gpuInfo));
    }
  };

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
                        component={NavLink}
                        to={gpuInfo.id}
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
        <Outlet />
      </Box>
    </Stack>
  );
};

export default GpuMonitoring;

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

const ALL_GPU_DETAIL_TAB_TYPES = [
  "overview",
  "power",
  "energy",
  "frequency",
  "temperature",
  "usage",
] as const;

type GpuDetailTabType = (typeof ALL_GPU_DETAIL_TAB_TYPES)[number];

const gpuDetailTabTypeToString = (type: GpuDetailTabType) => {
  switch (type) {
    case "overview":
      return "Overview";
    case "power":
      return "Power";
    case "energy":
      return "Energy";
    case "frequency":
      return "Frequency";
    case "temperature":
      return "Temperature";
    case "usage":
      return "Usage";
  }
};

export const GpuDetail = (props: GpuDetailProps) => {
  const { gpuModel } = props;

  const [currentTab, setCurrentTab] = useState<GpuDetailTabType>("overview");

  const defaultTabType: GpuDetailTabType = "overview";

  const gpuDetailTabTypes: GpuDetailTabType[] = [
    "overview",
    "power",
    "energy",
    "frequency",
    "temperature",
    "usage",
  ];

  let { monitoringType } = useParams();

  const navigate = useNavigate();

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: GpuDetailTabType
  ) => {
    navigate(newValue);
  };

  useEffect(() => {
    if (monitoringType === undefined || monitoringType === "") {
      navigate(defaultTabType);
    } else {
      if (
        ALL_GPU_DETAIL_TAB_TYPES.includes(monitoringType as GpuDetailTabType)
      ) {
        setCurrentTab(monitoringType as GpuDetailTabType);
      }
    }
  }, [monitoringType, gpuModel]);

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
            <GpuMonitoringOverview gpuModel={gpuModel} />
          )}
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

interface GpuMonitoringOverviewProps {
  gpuModel: GpuModel;
}

export const GpuMonitoringOverview = (props: GpuMonitoringOverviewProps) => {
  const { gpuModel } = props;

  const theme = useTheme();

  const [data, loading, error, fetch] = useFetchGpuStats(
    gpuModel.host,
    gpuModel.port,
    undefined,
    undefined
  );

  // const [cpuUsageData, setCpuUsageData] = useState<[number, number][]>([]);

  // useEffect(() => {
  //   setCpuUsageData((current) => {
  //     const newData: [number, number][] = [
  //       ...current,
  //       [new Date().getTime(), data ? data.energy_data.cpu_whole : 0],
  //     ];
  //     // if (newData.length > 10) {
  //     //   var elementsToRemove = newData.length - 10;
  //     //   newData.splice(0, elementsToRemove);
  //     // }
  //     return newData;
  //   });
  // }, [data]);

  return (
    <Stack>
      <Stack direction={"row"}>
        <MonitoringBlockContainer
          label="GPU Server Information"
          sx={{ flex: 1, width: 0 }}
          padding={"2.4rem"}
        >
          <Stack
            spacing={"0.8rem"}
            sx={{
              "& .MuiCardHeader-content": {
                display: "flex",
                flexDirection: "column-reverse",
                "& .MuiCardHeader-subheader": {
                  fontSize: "1.2rem",
                },
                "& .MuiCardHeader-title": {
                  fontSize: "1.6rem",
                },
              },
            }}
          >
            <Card>
              <CardHeader title="Manjaro Linux 23.1" subheader="OS" />
            </Card>
            <Card>
              <CardHeader title="Intel Xeon E5-2697 v4" subheader="CPU" />
            </Card>
            <Card>
              <CardHeader title="256GB" subheader="RAM" />
            </Card>
            <Card>
              <CardHeader title="NVIDIA Geforece RTX 3080 Ti" subheader="GPU" />
            </Card>
            <Card>
              <CardHeader title="127.0.0.1:5100" subheader="End Point" />
            </Card>
          </Stack>
        </MonitoringBlockContainer>
        <Divider orientation="vertical" flexItem />
        <Stack sx={{ flex: 1, width: 0 }}>
          <MonitoringBlockContainer
            label="CPU Usage"
            padding={"2.4rem"}
            paddingBottom={"1.2rem"}
            spacing={"0rem"}
          >
            <Box height={"15rem"}>
              <ReactApexChart
                options={{
                  chart: {
                    type: "area",
                    height: "100%",
                    zoom: {
                      enabled: false,
                    },
                    animations: {
                      enabled: true,
                    },
                    toolbar: {
                      show: false,
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  stroke: {
                    curve: "smooth",
                  },
                  xaxis: {
                    type: "datetime",
                    range: 20000,
                  },
                  yaxis: {
                    opposite: true,
                    stepSize: 50,
                  },
                }}
                series={[
                  {
                    name: "CPU Usage",
                    data: data.map((item) => [
                      item.time,
                      item.data.power_data.cpu_whole,
                    ]),
                  },
                ]}
                type="area"
                height={"100%"}
              />
            </Box>
          </MonitoringBlockContainer>
          <Divider flexItem />
          <MonitoringBlockContainer
            label="RAM Usage"
            padding={"2.4rem"}
            // paddingY={"1.2rem"}
            spacing={"0rem"}
          >
            <Box height={"15rem"}>
              <ReactApexChart
                options={{
                  chart: {
                    type: "area",
                    height: "100%",
                    zoom: {
                      enabled: false,
                    },
                    toolbar: {
                      show: false,
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  stroke: {
                    curve: "smooth",
                  },
                  xaxis: {
                    type: "datetime",
                    range: 20000,
                  },
                  yaxis: {
                    opposite: true,
                    stepSize: 50,
                  },
                }}
                series={[
                  {
                    name: "RAM Usage",
                    data: data.map((item) => [
                      item.time,
                      item.data.usage_data.cpu_memory,
                    ]),
                  },
                ]}
                type="area"
                height={"100%"}
              />
            </Box>
          </MonitoringBlockContainer>
        </Stack>
      </Stack>
      <Divider />
      <Stack direction={"row"}>
        <MonitoringBlockContainer
          label="GPU Core Usage"
          sx={{ flex: 1 }}
          padding={"2.4rem"}
        >
          <Box height={"18rem"}>
            <ReactApexChart
              options={{
                chart: {
                  type: "area",
                  height: "100%",
                  zoom: {
                    enabled: false,
                  },
                  toolbar: {
                    show: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                },
                xaxis: {
                  type: "datetime",
                  range: 20000,
                },
                yaxis: {
                  opposite: true,
                  stepSize: 50,
                },
              }}
              series={[
                {
                  name: "GPU Core Usage",
                  data: data.map((item) => [
                    item.time,
                    item.data.usage_data.gpu_core,
                  ]),
                },
              ]}
              type="area"
              height={"100%"}
            />
          </Box>
        </MonitoringBlockContainer>
        <Divider orientation="vertical" flexItem />
        <MonitoringBlockContainer
          label="GPU Memory Usage"
          sx={{ flex: 1 }}
          padding={"2.4rem"}
        >
          <Box
            height={"18rem"}
            sx={{
              overflow: "hidden",
              "& .apexcharts-canvas": {
                transform: "scale(1.5) translate(0, 15%)",
              },
            }}
          >
            <ReactApexChart
              options={{
                chart: {
                  type: "radialBar",
                  height: "100%",
                  zoom: {
                    enabled: false,
                  },
                  toolbar: {
                    show: false,
                  },
                },

                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: "70%",
                    },
                    startAngle: -120,
                    endAngle: 120,
                    dataLabels: {
                      name: {
                        fontSize: "1.2rem",
                      },
                      value: {
                        fontSize: "3rem",
                      },
                    },
                  },
                },
                labels: ["7.4GB/11GB"],
              }}
              series={[67]}
              type="radialBar"
              height={"100%"}
            />
          </Box>
        </MonitoringBlockContainer>
      </Stack>
      <Divider />
      <MonitoringBlockContainer
        label="Log"
        sx={{ flex: 2 }}
        padding={"2.4rem"}
      ></MonitoringBlockContainer>
    </Stack>
  );
};
