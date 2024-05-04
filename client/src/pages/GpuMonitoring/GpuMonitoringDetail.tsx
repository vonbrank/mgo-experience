import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import { MonitoringBlockContainer } from "../../components/Container";
import ReactApexChart from "react-apexcharts";
import { GpuStatsData } from "../../features/gpu/gpuAPI";

interface CommonAprexChartProps {
  name: string;
  dataSequence: [time: number, data: number | null][];
  yaxisStepSize?: number;
}

function CommonAprexChart(props: CommonAprexChartProps) {
  const { name, dataSequence, yaxisStepSize = 50 } = props;
  return (
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
          stepSize: yaxisStepSize,
        },
      }}
      series={[
        {
          name: name,
          data: dataSequence,
        },
      ]}
      type="area"
      height={"100%"}
    />
  );
}

interface GpuMonitoringDetailProps {
  gpuStatDataSequence: {
    time: number;
    data: GpuStatsData;
  }[];
}

const GpuMonitoringDetail = (props: GpuMonitoringDetailProps) => {
  const { gpuStatDataSequence } = props;

  const containerPadding = "1.2rem 2.4rem";

  return (
    <Stack>
      <Stack>
        <Stack direction={"row"}>
          <MonitoringBlockContainer
            label="CPU Frequency"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart
                name="CPU Frequency"
                dataSequence={gpuStatDataSequence.map((item) => [
                  item.time,
                  item.data.frequency_data.cpu_except_cores,
                ])}
                yaxisStepSize={1000}
              />
            </Box>
          </MonitoringBlockContainer>
          <MonitoringBlockContainer
            label="GPU Core Frequency"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart
                name="CPU Core Frequency"
                dataSequence={gpuStatDataSequence.map((item) => [
                  item.time,
                  item.data.frequency_data.gpu_core,
                ])}
                yaxisStepSize={1000}
              />
            </Box>
          </MonitoringBlockContainer>
        </Stack>
        <Stack direction={"row"}>
          <MonitoringBlockContainer
            label="Memory Frequency"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart
                name="Memory Frequency"
                dataSequence={gpuStatDataSequence.map((item) => [
                  item.time,
                  item.data.frequency_data.cpu_memory,
                ])}
                yaxisStepSize={50}
              />
            </Box>
          </MonitoringBlockContainer>
          <MonitoringBlockContainer
            label="GPU Memory Frequency"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart
                name="GPU Memory Frequency"
                dataSequence={gpuStatDataSequence.map((item) => [
                  item.time,
                  item.data.frequency_data.gpu_memory,
                ])}
                yaxisStepSize={1000}
              />
            </Box>
          </MonitoringBlockContainer>
        </Stack>
        <Divider />
        <Stack direction={"row"}>
          <MonitoringBlockContainer
            label="CPU Power"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart
                name="CPU Core Frequency"
                dataSequence={gpuStatDataSequence.map((item) => [
                  item.time,
                  item.data.power_data.cpu_whole,
                ])}
              />
            </Box>
          </MonitoringBlockContainer>
          <MonitoringBlockContainer
            label="GPU Core Power"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart
                name="GPU Core Power"
                dataSequence={gpuStatDataSequence.map((item) => [
                  item.time,
                  item.data.power_data.gpu_whole,
                ])}
              />
            </Box>
          </MonitoringBlockContainer>
        </Stack>
        <Stack direction={"row"}>
          <MonitoringBlockContainer
            label="Memory Power"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart
                name="Memory Frequency"
                dataSequence={gpuStatDataSequence.map((item) => [
                  item.time,
                  item.data.power_data.cpu_memory,
                ])}
              />
            </Box>
          </MonitoringBlockContainer>
          <Box sx={{ flex: 1 }}></Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GpuMonitoringDetail;
