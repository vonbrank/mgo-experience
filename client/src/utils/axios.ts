import axios from "axios";
import { LOCAL_STORAGE_JWT_KEY } from "../features/auth/authAPI";
import router from "../router";

const masterServerAxios = axios.create({
  baseURL: import.meta.env.VITE_MASTER_SERVER_BASE_URL,
  timeout: 2000,
});

masterServerAxios.interceptors.response.use(
  (reponse) => {
    return reponse;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const { response } = error;

      if (response) {
        if (response.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_JWT_KEY);
          router.navigate("/login");
        }
        return Promise.reject(response);
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const gpuServerAxios = axios.create({
  timeout: 2000,
});

const axiosInstances = [masterServerAxios, gpuServerAxios];

export { masterServerAxios, gpuServerAxios };
