import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { UserBase, login as loginAction } from "./authSlice";
import { masterServerAxios } from "../../utils/axios";
import { useToast } from "material-ui-toast-wrapper";

interface UserLoginData {
  email: string;
  password: string;
}

interface UserBaseModel {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface UserLoginResponse {
  status: string;
  token: string;
  data: UserBaseModel;
}

export const LOCAL_STORAGE_JWT_KEY = "json web token";

export const useUserLogin: () => [
  UserBaseModel | null,
  boolean,
  Error | null,
  (data: UserLoginData) => Promise<void>
] = () => {
  const appDispatch = useAppDispatch();

  const [logingIn, setLogingIn] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [userLoginResponseData, setUserLoginResponseData] =
    useState<UserBaseModel | null>(null);

  const { showTemporaryText } = useToast();

  const login = useCallback(
    async (data: UserLoginData) => {
      setLoginError(null);
      setUserLoginResponseData(null);

      setLogingIn(true);

      try {
        const res = await masterServerAxios.post<UserLoginResponse>(
          "/users/login",
          {
            ...data,
          }
        );

        if (res.status === 200) {
          const { data } = res;
          const userData = data.data;
          localStorage.setItem(LOCAL_STORAGE_JWT_KEY, data.token);
          appDispatch(
            loginAction({
              ...userData,
              username: userData.name,
              id: userData._id,
            })
          );
          setUserLoginResponseData(userData);
        } else {
          setLoginError(new Error("Login Failed."));
        }
      } catch (e) {
        if (e instanceof Error) {
          setLoginError(e);
        } else if (e && (e as any).data) {
          const data: { message: string } = (e as any).data;
          showTemporaryText({ message: data.message, severity: "error" });
        } else {
          setLoginError(new Error(`${e}`));
        }
      }

      setLogingIn(false);
    },
    [setLoginError, setLogingIn, setUserLoginResponseData, appDispatch]
  );

  return [userLoginResponseData, logingIn, loginError, login];
};

interface UserFetchMeDataResponse {
  status: string;
  data: UserBaseModel;
}

export const useUserData: () => [
  UserBaseModel | null,
  boolean,
  Error | null,
  fetch: () => Promise<void>
] = () => {
  const appDispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [userFetchMeResponseData, setUserFetchMeResponseData] =
    useState<UserBaseModel | null>(null);

  const fetch = useCallback(async () => {
    setFetchError(null);
    setUserFetchMeResponseData(null);

    setLoading(true);

    const token = localStorage.getItem(LOCAL_STORAGE_JWT_KEY);
    try {
      const res = await masterServerAxios.get<UserFetchMeDataResponse>(
        "/users/me",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (res.status === 200) {
        const { data } = res;
        const userData = data.data;
        appDispatch(
          loginAction({
            ...userData,
            username: userData.name,
            id: userData._id,
          })
        );
        setUserFetchMeResponseData(userData);
      } else {
        setFetchError(new Error("Failed to get user data"));
      }
    } catch (e) {
      if (e instanceof Error) {
        setFetchError(e);
      } else {
        setFetchError(new Error(`${e}`));
      }
    }
    setLoading(false);
  }, [setLoading, setFetchError, setUserFetchMeResponseData, appDispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return [userFetchMeResponseData, loading, fetchError, fetch];
};

interface FetchAllUserDataResponse {
  status: string;
  results: number;
  data: UserBaseModel[];
}

export const useAllUserData: () => [
  UserBaseModel[],
  boolean,
  Error | null,
  fetch: () => Promise<void>
] = () => {
  const appDispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [allUserData, setAllUserData] = useState<UserBaseModel[]>([]);

  const fetch = useCallback(async () => {
    setFetchError(null);
    setAllUserData([]);

    setLoading(true);

    const token = localStorage.getItem(LOCAL_STORAGE_JWT_KEY);
    try {
      const res = await masterServerAxios.get<FetchAllUserDataResponse>(
        "/users/",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (res.status === 200) {
        const { data } = res;
        const userData = data.data;
        setAllUserData(userData);
      } else {
        setFetchError(new Error("Failed to get all users data."));
      }
    } catch (e) {
      if (e instanceof Error) {
        setFetchError(e);
      } else {
        setFetchError(new Error(`${e}`));
      }
    }
    setLoading(false);
  }, [setLoading, setFetchError, setAllUserData, appDispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return [allUserData, loading, fetchError, fetch];
};
