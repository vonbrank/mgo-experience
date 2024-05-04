import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  Paper,
  Stack,
  Switch,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import style from "./BenchmarkTab.module.scss";
import DownloadIcon from "@mui/icons-material/Download";
import {
  BenchmarkSampleData,
  BenchmarkState,
  BenchmarkSummaryData,
  FetchGpuBenchmarkStateResult,
  GpuBenchmarkTestCase,
  useFetchGpuBenchmarkState,
  useUpdateGpuBenchmarkState,
} from "../../features/gpu/gpuAPI";
import { GpuModel } from "../../features/gpu";
import ReactApexChart from "react-apexcharts";
import { MonitoringBlockContainer } from "../../components/Container";
import Highlight from "react-highlight";

type TestCase = GpuBenchmarkTestCase;

const testCasesFake: TestCase[] = [
  {
    name: "vectorPlus",
    label: "Vector Plus",
    description: "Vector Plus",
    imageUrl:
      "https://cdn1.byjus.com/wp-content/uploads/2021/08/Polygon-law-of-vector-addition.png",
  },
  {
    name: "matrixMul",
    label: "Matrix Multiplication",
    description: "Matrix Multiplication",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4YndIik4GnbkUAFL0ckor93ZoW0AlsVAd-AC1JwgVWg&s",
  },
  {
    name: "graphicsRendering",
    label: "Graphics Rendering",
    description: "Graphics Rendering",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Cornell_box.png",
  },
  {
    name: "aiTraning",
    label: "AI Training",
    description: "AI Training",
    imageUrl:
      "https://www.nvidia.com/content/dam/en-zz/Solutions/deep-learning/deep-learning-solutions/machine-learning/nvidia-enterprise-inference-2c50-p@2x.jpg",
  },
];

interface BenchmarkTabProps {
  gpuModel: GpuModel;
}

type BenchmarkStateResult = FetchGpuBenchmarkStateResult;

const BenchmarkTab = (props: BenchmarkTabProps) => {
  const { gpuModel } = props;

  const [benchmarkState, setBenmarkState] =
    useState<BenchmarkStateResult | null>(null);

  const [currentRunningTimer, setCurrentRunningTimer] = useState<number | null>(
    null
  );

  const [
    gpuBenchmarkState,
    loadingGpuBenchmarkState,
    gpuBenchmarkStateError,
    fetchGpuBenchmarkState,
  ] = useFetchGpuBenchmarkState(gpuModel.host, gpuModel.port);

  useEffect(() => {
    fetchGpuBenchmarkState();
  }, []);

  useEffect(() => {
    if (
      gpuBenchmarkState &&
      loadingGpuBenchmarkState === false &&
      gpuBenchmarkStateError === null
    ) {
      setBenmarkState(gpuBenchmarkState);
    }
  }, [gpuBenchmarkState, loadingGpuBenchmarkState, gpuBenchmarkStateError]);

  const [
    updateGpuBenchmarkResut,
    updatingGpuBenchmarkState,
    updateGpuBenchmarkStateError,
    updateGpuBenchmarkState,
  ] = useUpdateGpuBenchmarkState(gpuModel.host, gpuModel.port);

  useEffect(() => {
    if (
      updateGpuBenchmarkResut &&
      updatingGpuBenchmarkState === false &&
      updateGpuBenchmarkStateError === null
    ) {
      fetchGpuBenchmarkState();
    }
  }, [
    updateGpuBenchmarkResut,
    updatingGpuBenchmarkState,
    updateGpuBenchmarkStateError,
  ]);

  useEffect(() => {
    return () => {
      if (currentRunningTimer) {
        setCurrentRunningTimer(null);
      }
    };
  }, [setCurrentRunningTimer]);

  const handleRun = () => {
    updateGpuBenchmarkState({
      actionType: "Run",
      actionOption: {
        testCaseName: "vectorAddition",
        enableMfGpoeo: false,
      },
    });
  };

  const handleUpdateRunningState = () => {
    fetchGpuBenchmarkState();
  };

  const handleReset = () => {
    updateGpuBenchmarkState({
      actionType: "Reset",
      actionOption: null,
    });
  };

  return (
    <Stack
      sx={{
        flex: 1,
        position: "relative",
      }}
    >
      <Stack sx={{ zIndex: 10 }}>
        {benchmarkState && benchmarkState.state === "IDLE" && (
          <BenchmarkIdlePanel
            handleRun={handleRun}
            testCases={benchmarkState.testCases}
          />
        )}
        {benchmarkState && benchmarkState.state === "RUNNING" && (
          <BenchmarkRunning
            testCase={benchmarkState.info.testCase}
            startTime={new Date(benchmarkState.info.startTime)}
            onUpdateRunningState={handleUpdateRunningState}
          />
        )}
        {benchmarkState && benchmarkState.state === "COMPLETED" && (
          <BenchmarkCompleted
            testCase={benchmarkState.report.testCase}
            startTime={new Date(benchmarkState.report.startTime)}
            completedTime={new Date(benchmarkState.report.completedTime)}
            sampleData={benchmarkState.report.data}
            summaryData={benchmarkState.report.summary}
            stdout={benchmarkState.report.stdout}
            stderr={benchmarkState.report.stderr}
            handleReset={handleReset}
          />
        )}
      </Stack>
      <Stack
        sx={{
          position: "fixed",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 1,
          // filter: "blur(8px)",
        }}
      >
        <img
          style={{ objectFit: "cover", flex: 1, objectPosition: "bottom" }}
          src="https://vonbrank-images.oss-cn-hangzhou.aliyuncs.com/20240504-MGO-Experience/3dmark-background.png"
        />
      </Stack>
      <Stack
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: (theme) =>
              alpha(theme.palette.mode === "light" ? "#fff" : "#000", 0.5),
            flex: 1,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default BenchmarkTab;

interface BenchmarkIdlePanelProps {
  testCases: TestCase[];
  handleRun?: () => void;
}

const BenchmarkIdlePanel = (props: BenchmarkIdlePanelProps) => {
  const { handleRun, testCases } = props;

  const testCasesChunks: TestCase[][] = [];
  const columnCount = 2;

  {
    for (let i = 0; i < testCases.length; i += columnCount) {
      testCasesChunks.push(testCases.slice(i, i + columnCount));
    }
  }

  return (
    <Stack sx={{ padding: "3.2rem 6.4rem" }}>
      <Stack spacing={"3.6rem"}>
        {testCasesChunks.map((testCasesChunk) => (
          <Stack direction={"row"} justifyContent={"space-between"}>
            {testCasesChunk.map((testCase) => (
              <BenchmarkCard {...testCase} handleRunClick={handleRun} />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

interface BenchmarkCardProps extends TestCase {
  handleRunClick?: () => void;
}

const BenchmarkCard = (props: BenchmarkCardProps) => {
  const { name, label, description, imageUrl, handleRunClick } = props;
  return (
    <Card sx={{ width: "36rem" }}>
      <CardHeader title={label} subheader={description} />
      <CardMedia
        component="img"
        image={imageUrl}
        sx={{ width: "100%", height: "24rem" }}
      />
      <CardActions disableSpacing>
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"}>
            <Switch />
            <Typography variant="subtitle2">Turn On MF-GPOEO</Typography>
          </Stack>
          <Button variant="contained" onClick={handleRunClick}>
            Run
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

interface BenchmarkInfoProps {
  testCase: TestCase;
  state: Exclude<BenchmarkState, "IDLE">;
  startTime?: Date;
  completedTime?: Date;
}

const BenchmarkInfo = (props: BenchmarkInfoProps) => {
  const { testCase, startTime, completedTime, state } = props;

  return (
    <Stack>
      <Typography variant="h5">{testCase.label}</Typography>
      <Typography
        variant="subtitle1"
        marginBottom={"1.2rem"}
        sx={{ opacity: 0.5 }}
      >
        {testCase.description}
      </Typography>
      <Divider />
      <Stack direction={"row"} paddingY={"1.8rem"} spacing="3.6rem">
        <Stack paddingY="1.8rem">
          <Stack
            direction={"row"}
            padding="3.6rem"
            alignItems={"center"}
            spacing={"1.8rem"}
            sx={{
              backgroundColor: (theme) =>
                alpha(
                  state === "COMPLETED"
                    ? theme.palette.success.main
                    : theme.palette.info.main,
                  0.1
                ),
            }}
          >
            {state === "COMPLETED" && (
              <CheckCircleOutlineOutlinedIcon
                fontSize="large"
                color="success"
              />
            )}
            {state === "RUNNING" && (
              <AutorenewOutlinedIcon
                fontSize="large"
                color="info"
                className={style.rotate}
              />
            )}

            <Stack>
              <Typography variant="subtitle1">Status:</Typography>
              <Typography variant="subtitle2">{state}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack justifyContent={"center"}>
          {startTime && (
            <Stack direction={"row"}>
              <Box width={"16rem"}>
                <Typography>Start time:</Typography>
              </Box>
              <Typography>{startTime.toTimeString()}</Typography>
            </Stack>
          )}
          {completedTime && (
            <Stack direction={"row"}>
              <Box width={"16rem"}>
                <Typography>Completed time:</Typography>
              </Box>
              <Typography>{completedTime.toTimeString()}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

interface BenchmarkRunningProps {
  testCase: TestCase;
  startTime: Date;
  onUpdateRunningState: () => void;
}

const BenchmarkRunning = (props: BenchmarkRunningProps) => {
  const { testCase, startTime, onUpdateRunningState } = props;

  useEffect(() => {
    const timer = setInterval(() => {
      onUpdateRunningState();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Stack sx={{ padding: "3.2rem 6.4rem" }}>
      <Paper>
        <Box padding="4.8rem">
          <BenchmarkInfo
            testCase={testCase}
            startTime={startTime}
            state="RUNNING"
          />
        </Box>
      </Paper>
    </Stack>
  );
};

interface BenchmarkResultChartProps {
  sampleData: BenchmarkSampleData[];
}

const BenchmarkResultChart = (props: BenchmarkResultChartProps) => {
  const { sampleData } = props;
  return (
    <Stack>
      <Typography variant="h5" marginBottom={"1.2rem"}>
        Charts
      </Typography>
      <Divider />
      <BenchmarkSampleChart
        label="Power"
        data={sampleData.map((item) => [
          new Date(item.timestamp).getTime(),
          item.power,
        ])}
        unit="W"
      />
      <BenchmarkSampleChart
        label="GPU Core Uage"
        data={sampleData.map((item) => [
          new Date(item.timestamp).getTime(),
          item.gpuUtil,
        ])}
        unit="%"
      />
      <BenchmarkSampleChart
        label="GPU SM Clock"
        data={sampleData.map((item) => [
          new Date(item.timestamp).getTime(),
          item.smClk,
        ])}
        unit="MHz"
        yaxisStepSize={1000}
      />
      <BenchmarkSampleChart
        label="GPU Memory Usage"
        data={sampleData.map((item) => [
          new Date(item.timestamp).getTime(),
          item.memUtil,
        ])}
        unit="%"
      />
      <BenchmarkSampleChart
        label="GPU Memory Clock"
        data={sampleData.map((item) => [
          new Date(item.timestamp).getTime(),
          item.memClk,
        ])}
        unit="MHz"
        yaxisStepSize={1000}
      />
      <BenchmarkSampleChart
        label="CPU Power"
        data={sampleData.map((item) => [
          new Date(item.timestamp).getTime(),
          item.cpuPower,
        ])}
        unit="W"
      />
    </Stack>
  );
};

interface BenchmarkCompletedProps {
  testCase: TestCase;
  startTime: Date;
  completedTime?: Date;
  sampleData: BenchmarkSampleData[];
  summaryData: BenchmarkSummaryData;
  stdout: string;
  stderr: string;
  handleReset?: () => void;
}

const BenchmarkCompleted = (props: BenchmarkCompletedProps) => {
  const {
    testCase,
    startTime,
    completedTime,
    handleReset,
    sampleData,
    summaryData,
    stdout,
    stderr,
  } = props;
  return (
    <Stack sx={{ padding: "3.2rem 6.4rem" }}>
      <Paper>
        <Box padding="4.8rem">
          <BenchmarkInfo
            testCase={testCase}
            startTime={startTime}
            completedTime={completedTime}
            state="COMPLETED"
          />
          <Stack direction={"row"} marginBottom={"1.8rem"} spacing={"4.8rem"}>
            <Button fullWidth variant="contained" startIcon={<DownloadIcon />}>
              Download
            </Button>
            <Button fullWidth variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Stack>
          <BenchmarkSummary summaryData={summaryData} />
          <Box marginY={"2.4rem"} />
          <BenchmarkLogOutput stdout={stdout} stderr={stderr} />
          <Box marginY={"2.4rem"} />
          <BenchmarkResultChart sampleData={sampleData} />
        </Box>
      </Paper>
    </Stack>
  );
};

interface BenchmarkSummaryProps {
  summaryData: BenchmarkSummaryData;
}

interface BenchmarkSummaryContainerProps {
  label: string;
  children: React.ReactNode;
}

const BenchmarkSummaryContainer = (props: BenchmarkSummaryContainerProps) => {
  const { label, children } = props;
  return (
    <Stack>
      <Typography fontWeight={"bold"}>{label}</Typography>
      <Stack spacing="1.2rem" marginTop={"1.2rem"}>
        {children}
      </Stack>
    </Stack>
  );
};

interface BenchmarkSummaryItemBlockProps {
  label: string;
  value: string | number;
  unit: string;
}

const BenchmarkSummaryItemBlock = (props: BenchmarkSummaryItemBlockProps) => {
  const { label, value, unit } = props;
  return (
    <Stack direction={"row"} sx={{ flex: 1 }} spacing={"0.8rem"}>
      <Typography>{`${label}: `}</Typography>
      <Typography>{`${value} ${unit}`}</Typography>
    </Stack>
  );
};

const BenchmarkSummary = (props: BenchmarkSummaryProps) => {
  const { summaryData } = props;
  return (
    <Stack>
      <Typography variant="h5" marginBottom={"1.2rem"}>
        Summary
      </Typography>
      <Divider />
      <Stack>
        <Stack spacing="1.8rem" marginTop={"1.8rem"}>
          <BenchmarkSummaryContainer label="Energy & Power (All)">
            <BenchmarkSummaryItemBlock
              label="Energy"
              value={summaryData.enery}
              unit="J"
            />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <BenchmarkSummaryItemBlock
                label="Min Power"
                value={summaryData.minPower}
                unit="W"
              />
              <BenchmarkSummaryItemBlock
                label="Avg Power"
                value={summaryData.avgPower}
                unit="W"
              />
              <BenchmarkSummaryItemBlock
                label="Max Power"
                value={summaryData.maxPower}
                unit="W"
              />
            </Stack>
          </BenchmarkSummaryContainer>
          <BenchmarkSummaryContainer label="Energy & Power (Above Threshold)">
            <BenchmarkSummaryItemBlock
              label="Power Threshold"
              value={summaryData.powerAboveThreshold}
              unit="W"
            />
            <BenchmarkSummaryItemBlock
              label="Energy"
              value={summaryData.eneryAboveThreshold}
              unit="J"
            />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <BenchmarkSummaryItemBlock
                label="Min Power"
                value={summaryData.minPoweAboveThresholdr}
                unit="W"
              />
              <BenchmarkSummaryItemBlock
                label="Avg Power"
                value={summaryData.avgPowerAboveThreshold}
                unit="W"
              />
              <BenchmarkSummaryItemBlock
                label="Max Power"
                value={summaryData.maxPowerAboveThreshold}
                unit="W"
              />
            </Stack>
          </BenchmarkSummaryContainer>
          <BenchmarkSummaryContainer label="GPU SM ">
            <Stack direction={"row"} justifyContent={"space-between"}>
              <BenchmarkSummaryItemBlock
                label="Min GPU Usage"
                value={summaryData.minGPUUtil}
                unit="%"
              />
              <BenchmarkSummaryItemBlock
                label="Avg GPU Usage"
                value={summaryData.avgGPUUtil}
                unit="%"
              />
              <BenchmarkSummaryItemBlock
                label="Max GPU Usage"
                value={summaryData.maxGPUUtil}
                unit="%"
              />
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <BenchmarkSummaryItemBlock
                label="Min SM Clock"
                value={summaryData.minSMClk}
                unit="MHz"
              />
              <BenchmarkSummaryItemBlock
                label="Avg SM Clock"
                value={summaryData.avgSMClk}
                unit="MHz"
              />
              <BenchmarkSummaryItemBlock
                label="Max SM Clock"
                value={summaryData.maxSMClk}
                unit="MHz"
              />
            </Stack>
          </BenchmarkSummaryContainer>
          <BenchmarkSummaryContainer label="GPU Memory ">
            <Stack direction={"row"} justifyContent={"space-between"}>
              <BenchmarkSummaryItemBlock
                label="Min Mem Usage"
                value={summaryData.minMemUtil}
                unit="%"
              />
              <BenchmarkSummaryItemBlock
                label="Avg Mem Usage"
                value={summaryData.avgMemUtil}
                unit="%"
              />
              <BenchmarkSummaryItemBlock
                label="Max Mem Usage"
                value={summaryData.maxMemUtil}
                unit="%"
              />
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <BenchmarkSummaryItemBlock
                label="Min Mem Clock"
                value={summaryData.minMemClk}
                unit="MHz"
              />
              <BenchmarkSummaryItemBlock
                label="Avg Mem Clock"
                value={summaryData.avgMemClk}
                unit="MHz"
              />
              <BenchmarkSummaryItemBlock
                label="Max Mem Clock"
                value={summaryData.maxMemClk}
                unit="MHz"
              />
            </Stack>
          </BenchmarkSummaryContainer>
          <BenchmarkSummaryContainer label="CPU Energy & Power">
            <BenchmarkSummaryItemBlock
              label="Energy"
              value={summaryData.eneryCPU}
              unit="J"
            />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <BenchmarkSummaryItemBlock
                label="Min Power"
                value={summaryData.minPowerCPU}
                unit="W"
              />
              <BenchmarkSummaryItemBlock
                label="Avg Power"
                value={summaryData.avgPowerCPU}
                unit="W"
              />
              <BenchmarkSummaryItemBlock
                label="Max Power"
                value={summaryData.maxPowerCPU}
                unit="W"
              />
            </Stack>
          </BenchmarkSummaryContainer>
        </Stack>
      </Stack>
    </Stack>
  );
};

interface BenchmarkLogOutputProps {
  stdout: string;
  stderr: string;
}

const BenchmarkLogOutput = (props: BenchmarkLogOutputProps) => {
  const { stdout, stderr } = props;
  return (
    <Stack>
      <Typography variant="h5" marginBottom={"1.2rem"}>
        Log
      </Typography>
      <Divider />
      <Stack spacing={"1.8rem"} marginTop={"1.8rem"}>
        <Stack spacing={"1.2rem"}>
          <Typography fontWeight={"bold"}>stdout</Typography>
          <Box
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
              padding: "0.8rem",
              paddingBottom: 0,
            }}
          >
            <Highlight className="sh">
              {stdout.trim() === "" ? "N/A" : stdout}
            </Highlight>
          </Box>
        </Stack>
        <Stack spacing={"1.2rem"}>
          <Typography fontWeight={"bold"}>stderr</Typography>
          <Box
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
              padding: "0.8rem",
              paddingBottom: 0,
            }}
          >
            <Highlight className="sh">
              {stderr.trim() === "" ? "N/A" : stderr}
            </Highlight>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

interface BenchmarkSampleChartProps {
  label: string;
  unit: string;
  data: [number, number][];
  yaxisStepSize?: number;
}

const BenchmarkSampleChart = (props: BenchmarkSampleChartProps) => {
  const { label, data, unit, yaxisStepSize = 50 } = props;

  return (
    <MonitoringBlockContainer label={label} padding={"1.2rem 2.4rem"}>
      <Box height={"15rem"}>
        <ReactApexChart
          options={{
            chart: {
              type: "area",
              stacked: false,
              height: "100%",
              zoom: {
                type: "x",
                enabled: true,
                autoScaleYaxis: true,
              },
              toolbar: {
                autoSelected: "zoom",
              },
            },
            dataLabels: {
              enabled: false,
            },
            markers: {
              size: 0,
            },

            fill: {
              type: "gradient",
              gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100],
              },
            },
            yaxis: {
              title: {
                text: unit,
              },
              stepSize: yaxisStepSize,
            },
            xaxis: {
              type: "datetime",
            },
            tooltip: {
              shared: false,
            },
          }}
          series={[
            {
              name: label,
              data: data,
            },
          ]}
          type="area"
          height={"100%"}
        />
      </Box>
    </MonitoringBlockContainer>
  );
};
