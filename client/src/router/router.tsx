import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { AppDefaultLayout } from "../components/Container";
import NotFound from "../pages/NotFound";
import GpuMonitoring from "../pages/GpuMonitoring";
import { GpuDetailPanel } from "../pages/GpuMonitoring/GpuMonitoring";
import GpuManagement from "../pages/GpuManagement";
import { UserGpuManagementPanel } from "../pages/GpuManagement/GpuManagement";

const customRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Outlet />
      </>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <AppDefaultLayout />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "monitoring-gpus",
            element: <GpuMonitoring />,
            children: [
              {
                path: "",
                element: <GpuDetailPanel />,
              },
              {
                path: ":gpuId",
                element: <GpuDetailPanel />,
                children: [
                  {
                    path: "",
                    element: <></>,
                  },
                  {
                    path: ":monitoringType",
                    element: <></>,
                  },
                ],
              },
            ],
          },
          {
            path: "gpu-management",
            element: <GpuManagement />,
            children: [
              {
                path: "",
                element: <></>,
              },
              {
                path: ":userId",
                element: <UserGpuManagementPanel />,
              },
            ],
          },
          {
            path: "user-management",
            element: <></>,
          },
          {
            path: "notification",
            element: <></>,
          },
          {
            path: "settings",
            element: <></>,
          },
          {
            path: "help",
            element: <></>,
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default customRouter;
