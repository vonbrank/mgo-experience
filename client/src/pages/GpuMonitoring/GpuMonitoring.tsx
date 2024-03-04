import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
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

interface GpuInfo {
  id: string;
  name: string;
  host: string;
  port: number;
  gpuModel: string;
}

const activedGpuInfoList: GpuInfo[] = [
  {
    id: "1",
    name: "HIT HPC - 001",
    host: "127.0.0.1",
    port: 5100,
    gpuModel: "RTX 3080 Ti",
  },
  {
    id: "2",
    name: "HIT HPC - 002",
    host: "127.0.0.1",
    port: 5200,
    gpuModel: "RTX 2080 Ti",
  },
  {
    id: "3",
    name: "HIT HPC - 003",
    host: "127.0.0.1",
    port: 5300,
    gpuModel: "NVIDIA A100",
  },
  {
    id: "13",
    name: "HIT HPC - 003",
    host: "127.0.0.1",
    port: 5300,
    gpuModel: "NVIDIA A100",
  },
  {
    id: "23",
    name: "HIT HPC - 003",
    host: "127.0.0.1",
    port: 5300,
    gpuModel: "NVIDIA A100",
  },
  {
    id: "33",
    name: "HIT HPC - 003",
    host: "127.0.0.1",
    port: 5300,
    gpuModel: "NVIDIA A100",
  },
];

const deactivedGpuInfoList: GpuInfo[] = [
  {
    id: "4",
    name: "HIT HPC - 001",
    host: "127.0.0.1",
    port: 5100,
    gpuModel: "RTX 3080 Ti",
  },
  {
    id: "5",
    name: "HIT HPC - 002",
    host: "127.0.0.1",
    port: 5200,
    gpuModel: "RTX 2080 Ti",
  },
  {
    id: "6",
    name: "HIT HPC - 003",
    host: "127.0.0.1",
    port: 5300,
    gpuModel: "NVIDIA A100",
  },
  {
    id: "7",
    name: "HIT HPC - 003",
    host: "127.0.0.1",
    port: 5300,
    gpuModel: "NVIDIA A100",
  },
  {
    id: "8",
    name: "HIT HPC - 003",
    host: "127.0.0.1",
    port: 5300,
    gpuModel: "NVIDIA A100",
  },
];

const GpuMonitoring = () => {
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
            {activedGpuInfoList.map((gpuInfo) => (
              <ListItem disablePadding key={gpuInfo.id}>
                <ListItemButton
                  component={NavLink}
                  to={gpuInfo.id}
                  sx={{
                    "&.active": {
                      backgroundColor: (theme) => theme.palette.primary.main,
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
                      <Typography fontWeight={"bold"} className="label-primary">
                        {gpuInfo.name}
                      </Typography>
                      <Typography className="label-secondary">
                        {`${gpuInfo.host}:${gpuInfo.port}`}
                      </Typography>
                    </Stack>
                    <Stack direction="column-reverse">
                      <Chip label={gpuInfo.gpuModel} size="small" />
                    </Stack>
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Typography padding={"1.6rem 3rem"} variant="h6">
            Deactive GPU Servers
          </Typography>
          <List disablePadding>
            {deactivedGpuInfoList.map((gpuInfo) => (
              <ListItem disablePadding key={gpuInfo.id}>
                <ListItemButton disableRipple>
                  <Stack
                    direction={"row"}
                    width={"100%"}
                    padding={"1.2rem"}
                    justifyContent="space-between"
                  >
                    <Stack>
                      <Typography fontWeight={"bold"} className="label-primary">
                        {gpuInfo.name}
                      </Typography>
                      <Typography className="label-secondary">
                        {`${gpuInfo.host}:${gpuInfo.port}`}
                      </Typography>
                    </Stack>
                    <Stack direction="column-reverse">
                      <Chip label={gpuInfo.gpuModel} size="small" />
                    </Stack>
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))}
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
  let { gpuId } = useParams();

  if (gpuId) {
    return <GpuDetail gpuId={gpuId} />;
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
  gpuId: string;
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
  const { gpuId } = props;

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
  }, [monitoringType, gpuId]);

  return (
    <SecondaryLevelSidebarThemeProvider>
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
      <Divider />
      {currentTab === "overview" && <GpuMonitoringOverview />}
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

export const GpuMonitoringOverview = () => {
  return (
    <Stack>
      <Stack direction={"row"}>
        <MonitoringBlockContainer
          label="GPU Server Information"
          sx={{ flex: 1, width: 0 }}
          padding={"2.4rem"}
        >
          <Stack spacing={"0.8rem"}>
            <MonitoringInformationContainer
              label="OS"
              value="Manjaro Linux 23.1"
            />
            <MonitoringInformationContainer
              label="CPU"
              value="Intel Xeon E5-2697 v4"
            />
            <MonitoringInformationContainer label="RAM" value="256GB" />
            <MonitoringInformationContainer
              label="GPU"
              value="NVIDIA Geforece RTX  3080 Ti"
            />
            <MonitoringInformationContainer
              label="End Point"
              value="127.0.0.1:5100"
            />
          </Stack>
        </MonitoringBlockContainer>
        <Divider orientation="vertical" flexItem />
        <Stack sx={{ flex: 1, width: 0 }}>
          <MonitoringBlockContainer
            label="CPU Usage"
            padding={"2.4rem"}
            paddingBottom={"1.2rem"}
          ></MonitoringBlockContainer>
          <Divider flexItem />
          <MonitoringBlockContainer
            label="RAM Usage"
            padding={"2.4rem"}
            paddingTop={"1.2rem"}
          ></MonitoringBlockContainer>
        </Stack>
      </Stack>
      <Divider />
      <Stack direction={"row"}>
        <MonitoringBlockContainer
          label="GPU Core Usage"
          sx={{ flex: 1 }}
          padding={"2.4rem"}
        ></MonitoringBlockContainer>
        <Divider orientation="vertical" flexItem />
        <MonitoringBlockContainer
          label="GPU Memory Usage"
          sx={{ flex: 1 }}
          padding={"2.4rem"}
        ></MonitoringBlockContainer>
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
