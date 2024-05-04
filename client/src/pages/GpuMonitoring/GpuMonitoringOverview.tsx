import { Box, Card, CardHeader, Divider, Stack, useTheme } from "@mui/material";
import { MonitoringBlockContainer } from "../../components/Container";
import ReactApexChart from "react-apexcharts";
import { GpuStatsData } from "../../features/gpu/gpuAPI";
import { GpuModel } from "../../features/gpu";

interface GpuMonitoringOverviewProps {
  gpuModel: GpuModel;
  gpuStatDataSequence: {
    time: number;
    data: GpuStatsData;
  }[];
}

export const GpuMonitoringOverview = (props: GpuMonitoringOverviewProps) => {
  const { gpuModel, gpuStatDataSequence } = props;

  const theme = useTheme();

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

  const gpuMemorySize = 11;

  const metaData = (() => {
    if (gpuStatDataSequence.length > 0) {
      const lastData = gpuStatDataSequence[gpuStatDataSequence.length - 1];
      return {
        os: lastData.data.meta_data.os,
        cpu: lastData.data.meta_data.cpu,
        ram: lastData.data.meta_data.ram,
        gpu: lastData.data.meta_data.gpu,
      };
    } else {
      return { os: "", cpu: "", ram: "", gpu: "" };
    }
  })();

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
              <CardHeader title={metaData.os} subheader="OS" />
            </Card>
            <Card>
              <CardHeader title={metaData.cpu} subheader="CPU" />
            </Card>
            <Card>
              <CardHeader title={metaData.ram} subheader="RAM" />
            </Card>
            <Card>
              <CardHeader title={metaData.gpu} subheader="GPU" />
            </Card>
            <Card>
              <CardHeader
                title={`${gpuModel.host}:${gpuModel.port}`}
                subheader="End Point"
              />
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
                    data: gpuStatDataSequence.map((item) => [
                      item.time,
                      item.data.usage_data.cpu_except_cores,
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
                    data: gpuStatDataSequence.map((item) => [
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
                  data: gpuStatDataSequence.map((item) => [
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
                labels: [
                  `${
                    gpuStatDataSequence.length > 0
                      ? (gpuMemorySize *
                          gpuStatDataSequence[gpuStatDataSequence.length - 1]
                            .data.usage_data.gpu_memory) /
                        100
                      : 0
                  }GB/${gpuMemorySize}GB`,
                ],
              }}
              series={[
                gpuStatDataSequence.length > 0
                  ? gpuStatDataSequence[gpuStatDataSequence.length - 1].data
                      .usage_data.gpu_memory
                  : 0,
              ]}
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
