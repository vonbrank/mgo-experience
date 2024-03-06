import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { masterServerAxios } from "../../utils/axios";
import { LOCAL_STORAGE_JWT_KEY } from "../auth/authAPI";

interface FetchUserGpuStateResultItem {
  id: string;
  host: string;
  port: string;
  lastHeartBeatAt: string;
  activated: boolean;
}

type FetchUserGpuStateResult = FetchUserGpuStateResultItem[];

interface FetchUserGpuStateResponse {
  status: string;
  results: number;
  data: FetchUserGpuStateResult;
}

export const useFetchUserGpuState: () => [
  FetchUserGpuStateResult,
  boolean,
  Error | null,
  () => void
] = (fetchIntervalInSeconds = 3) => {
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
        setResult(resultData);
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
  }, []);

  return [result, loading, error, fetch];
};
