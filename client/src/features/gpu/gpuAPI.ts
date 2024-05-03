import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { masterServerAxios } from "../../utils/axios";
import { LOCAL_STORAGE_JWT_KEY } from "../auth/authAPI";
import axios from "axios";
import { GpuModel } from ".";

export interface FetchUserGpuStateResultItem {
  id: string;
  host: string;
  port: string;
  lastHeartBeatAt: string;
  activated: boolean;
  privilegedUsers: { _id: string }[];
}

type FetchUserGpuStateResult = FetchUserGpuStateResultItem[];

interface FetchUserGpuStateResponse {
  status: string;
  results: number;
  data: FetchUserGpuStateResult;
}

export const useFetchUserGpuState: (
  fetchIntervalInSeconds: number | undefined
) => [FetchUserGpuStateResult, boolean, Error | null, () => void] = (
  fetchIntervalInSeconds = 3
) => {
  const { userId } = useAppSelector((state) => ({
    userId: state.auth.user?.id || null,
  }));

  const [result, setResult] = useState<FetchUserGpuStateResult>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (userId === undefined) {
      return;
    }

    setLoading(true);

    setError(null);

    const token = localStorage.getItem(LOCAL_STORAGE_JWT_KEY);
    try {
      const res = await masterServerAxios.get<FetchUserGpuStateResponse>(
        "/users/gpus",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (res.status === 200) {
        const { data } = res;
        const resultData = data.data;

        if (import.meta.env.VITE_USE_TEST_GPU_INFO === "true") {
          setResult([
            {
              id: "1234",
              host: import.meta.env.VITE_TEST_GPU_SERVER_HOST,
              port: import.meta.env.VITE_TEST_GPU_SERVER_PORT,
              lastHeartBeatAt: `${new Date()}`,
              activated: true,
              privilegedUsers: [],
            },
            ...resultData,
          ]);
        } else {
          setResult([...resultData]);
        }
      } else {
        setResult([]);
        setError(new Error("Fetch user gpu state failed"));
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error(`${e}`));
      }
      setResult([]);
    }

    setLoading(false);
  }, [setResult, setLoading, setError]);

  useEffect(() => {
    fetch();

    const timerHandler = setInterval(() => {
      fetch();
    }, fetchIntervalInSeconds * 1000);

    return () => {
      clearInterval(timerHandler);
    };
  }, [fetch]);

  return [result, loading, error, fetch];
};

interface PowerData {
  cpu_whole: number;
  gpu_whole: number;
}

interface EnergyData {
  cpu_whole: number;
  gpu_whole: number;
}

interface UsageData {
  cpu_memory: number;
  gpu_core: number;
}

export interface GpuStatsData {
  power_data: PowerData;
  energy_data: EnergyData;
  usage_data: UsageData;
}

interface FetchGpuStatsResponse {
  status: string;
  data: GpuStatsData;
}

export const useFetchGpuStats: (
  host: string,
  port: string,
  maxDataItemCount: number | undefined,
  fetchIntervalInSeconds: number | undefined
) => [
  { time: number; data: GpuStatsData }[],
  boolean,
  Error | null,
  () => void
] = (
  host: string,
  port: string,
  maxDataItemCount = 10,
  fetchIntervalInSeconds = 3
) => {
  const [data, setData] = useState<{ time: number; data: GpuStatsData }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      // const res = await masterServerAxios.get<FetchUserGpuStateResponse>(
      //   "/gpu/state"
      // );

      const res = await axios.get<FetchGpuStatsResponse>(
        `http://${host}:${port}/api/v1/gpu/state`
      );

      if (res.status === 200) {
        const { data } = res;
        const resultData = data.data;
        setData((current) => {
          const newData: {
            time: number;
            data: GpuStatsData;
          }[] = [
            ...current,
            {
              time: new Date().getTime(),
              data: resultData,
            },
          ];
          if (newData.length > maxDataItemCount) {
            var elementsToRemove = newData.length - 10;
            newData.splice(0, elementsToRemove);
          }
          return newData;
        });
        console.log("after fuck", res.data.data);
      } else {
        setData([]);
        setError(new Error("Fetch user gpu state failed"));
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error(`${e}`));
      }
      setData([]);
    }

    setLoading(false);
  }, [setData, setLoading, setError]);

  useEffect(() => {
    console.log("before fuck");
    fetch();

    const timerHandler = setInterval(() => {
      fetch();
    }, fetchIntervalInSeconds * 1000);

    return () => {
      clearInterval(timerHandler);
    };
  }, [fetch, host, port, fetchIntervalInSeconds]);

  return [data, loading, error, fetch];
};

interface FetchAuthUserGpuResult {
  granted: GpuModel[];
  denied: GpuModel[];
}

export const useFetchAuthUserGpu: (
  userId: string
) => [FetchAuthUserGpuResult, boolean, Error | null, () => void] = (
  userId: string
) => {
  const [data, setData] = useState<FetchAuthUserGpuResult>({
    granted: [],
    denied: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);

    setError(null);
    const token = localStorage.getItem(LOCAL_STORAGE_JWT_KEY);
    try {
      const res = await masterServerAxios.get<FetchUserGpuStateResponse>(
        "/users/gpus",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (res.status === 200) {
        const { data } = res;
        const resultData = data.data;
        setData({
          granted: resultData.filter(
            (item) =>
              item.privilegedUsers.findIndex(
                (privilegedUser) => privilegedUser._id === userId
              ) !== -1
          ),
          denied: resultData.filter(
            (item) =>
              item.privilegedUsers.findIndex(
                (privilegedUser) => privilegedUser._id === userId
              ) === -1
          ),
        });
      } else {
        setData({ granted: [], denied: [] });
        setError(new Error("Fetch user auth gpus failed"));
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error(`${e}`));
      }
      setData({ granted: [], denied: [] });
    }

    setLoading(false);
  }, [setData, setLoading, setError]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return [data, loading, error, fetch];
};

export type BenchmarkState = "IDLE" | "RUNNING" | "COMPLETED";

export interface GpuBenchmarkTestCase {
  name: string;
  label: string;
  description: string;
  imageUrl: string;
}

interface GpuBenchmarkReport {
  startTime: string;
  completedTime: string;
  stdout: string;
  stderr: string;
  data: any[];
  testCase: GpuBenchmarkTestCase;
}

type FetchGpuBenchmarkStateResult =
  | {
      state: "IDLE";
      testCases: GpuBenchmarkTestCase[];
    }
  | {
      state: "RUNNING";
      info: {
        startTime: string;
        testCase: GpuBenchmarkTestCase;
      };
    }
  | {
      state: "COMPLETED";
      report: GpuBenchmarkReport;
    };

interface FetchGpuBenchmarkStateResponse {
  status: string;
  data: FetchGpuBenchmarkStateResult;
}

export const useFetchGpuBenchmarkState: (
  host: string,
  port: string
) => [
  FetchGpuBenchmarkStateResult | null,
  boolean,
  Error | null,
  () => void
] = (host, port) => {
  const [data, setData] = useState<FetchGpuBenchmarkStateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const res = await axios.get<FetchGpuBenchmarkStateResponse>(
        `http://${host}:${port}/api/v1/gpu/benchmark`
      );

      if (res.status === 200 && res.data.status === "success") {
        const { data } = res;
        const resultData = data.data;
        setData(resultData);
      } else {
        setData(null);
        setError(new Error("Faied to fetch GPU benchmark state."));
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error(`${e}`));
      }
      setData(null);
    }

    setLoading(false);
  }, [setData, setLoading, setError]);

  return [data, loading, error, fetch];
};

type UpdateGpuBenchmarkStateConfig =
  | {
      actionType: "Run";
      actionOption: {
        testCaseName: string;
        enableMfGpoeo: boolean;
      };
    }
  | {
      actionType: "Reset";
      actionOption: null;
    };

interface UpdateGpuBenchmarkStateResponse {
  status: string;
  data: UpdateGpuBenchmarkStateResult;
}
interface UpdateGpuBenchmarkStateResult {
  benchmarkState: BenchmarkState;
}

export const useUpdateGpuBenchmarkState: (
  host: string,
  port: string
) => [
  UpdateGpuBenchmarkStateResult | null,
  boolean,
  Error | null,
  (config: UpdateGpuBenchmarkStateConfig) => void
] = (host, port) => {
  const [data, setData] = useState<UpdateGpuBenchmarkStateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(
    async (config: UpdateGpuBenchmarkStateConfig) => {
      setLoading(true);

      setError(null);

      try {
        const res = await axios.post<UpdateGpuBenchmarkStateResponse>(
          `http://${host}:${port}/api/v1/gpu/benchmark`,
          config
        );

        if (res.status === 200 && res.data.status === "success") {
          const { data } = res;
          const resultData = data.data;
          setData(resultData);
        } else {
          setData(null);
          setError(new Error("Faied to update GPU benchmark state."));
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error(`${e}`));
        }
        setData(null);
      }

      setLoading(false);
    },
    [setData, setLoading, setError]
  );

  return [data, loading, error, fetch];
};
