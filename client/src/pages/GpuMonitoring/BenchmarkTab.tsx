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

interface TestCase {
  name: string;
  label: string;
  description: string;
  imageUrl: string;
}
const testCases: TestCase[] = [
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

type BenchmarkState = "IDLE" | "RUNNING" | "COMPLETED";

const BenchmarkTab = () => {
  const [benchmarkState, setBenmarkState] = useState<BenchmarkState | null>(
    "IDLE"
  );

  const [currentRunningTimer, setCurrentRunningTimer] = useState<number | null>(
    null
  );

  const handleRun = () => {
    if (currentRunningTimer) {
      setCurrentRunningTimer(null);
    }

    const timer = setTimeout(() => {
      setBenmarkState("COMPLETED");
      setCurrentRunningTimer(null);
    }, 5000);

    setBenmarkState("RUNNING");
    setCurrentRunningTimer(timer);
  };

  const handleReset = () => {
    if (currentRunningTimer) {
      setCurrentRunningTimer(null);
    }
    setBenmarkState("IDLE");
  };

  useEffect(() => {
    return () => {
      if (currentRunningTimer) {
        setCurrentRunningTimer(null);
      }
    };
  }, [setCurrentRunningTimer]);

  return (
    <Stack
      sx={{
        flex: 1,
        position: "relative",
      }}
    >
      <Stack sx={{ zIndex: 10 }}>
        {benchmarkState === "IDLE" && (
          <BenchmarkIdlePanel handleRun={handleRun} />
        )}
        {benchmarkState === "RUNNING" && (
          <BenchmarkRunning testCase={testCases[0]} startTime={new Date()} />
        )}
        {benchmarkState === "COMPLETED" && (
          <BenchmarkCompleted
            testCase={testCases[0]}
            startTime={new Date()}
            completedTime={new Date()}
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
          // filter: "blur(10px)",
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
            backgroundColor: alpha("#fff", 0.5),
            flex: 1,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default BenchmarkTab;

interface BenchmarkIdlePanelProps {
  handleRun?: () => void;
}

const BenchmarkIdlePanel = (props: BenchmarkIdlePanelProps) => {
  const { handleRun } = props;

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
}

const BenchmarkRunning = (props: BenchmarkRunningProps) => {
  const { testCase, startTime } = props;
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

const BenchmarkResultChart = () => {
  return (
    <Stack>
      <Typography variant="h5" marginBottom={"1.2rem"}>
        Charts
      </Typography>
      <Divider />
    </Stack>
  );
};

interface BenchmarkCompletedProps {
  testCase: TestCase;
  startTime: Date;
  completedTime?: Date;
  handleReset?: () => void;
}

const BenchmarkCompleted = (props: BenchmarkCompletedProps) => {
  const { testCase, startTime, completedTime, handleReset } = props;
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
          <BenchmarkResultChart />
        </Box>
      </Paper>
    </Stack>
  );
};
