import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import { MonitoringBlockContainer } from "../../components/Container";
import ReactApexChart from "react-apexcharts";

interface CommonAprexChartProps {
  name: string;
  dataSequence: [time: number, data: number | null][];
}

function CommonAprexChart(props: CommonAprexChartProps) {
  const { name, dataSequence } = props;
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
          stepSize: 50,
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

const GpuMonitoringDetail = () => {
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
              <CommonAprexChart name="CPU Frequency" dataSequence={[]} />
            </Box>
          </MonitoringBlockContainer>
          <MonitoringBlockContainer
            label="GPU Core Frequency"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart name="CPU Core Frequency" dataSequence={[]} />
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
              <CommonAprexChart name="Memory Frequency" dataSequence={[]} />
            </Box>
          </MonitoringBlockContainer>
          <MonitoringBlockContainer
            label="GPU Memory Frequency"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart name="GPU Memory Frequency" dataSequence={[]} />
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
              <CommonAprexChart name="CPU Core Frequency" dataSequence={[]} />
            </Box>
          </MonitoringBlockContainer>
          <MonitoringBlockContainer
            label="GPU Core Power"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart name="GPU Core Power" dataSequence={[]} />
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
              <CommonAprexChart name="Memory Frequency" dataSequence={[]} />
            </Box>
          </MonitoringBlockContainer>
          <MonitoringBlockContainer
            label="GPU Memory Power"
            sx={{ flex: 1 }}
            padding={containerPadding}
          >
            <Box height={"18rem"}>
              <CommonAprexChart name="GPU Memory Power" dataSequence={[]} />
            </Box>
          </MonitoringBlockContainer>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GpuMonitoringDetail;
