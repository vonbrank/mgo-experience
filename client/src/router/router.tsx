import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { AppDefaultLayout } from "../components/Container";
import NotFound from "../pages/NotFound";
import GpuMonitoring from "../pages/GpuMonitoring";
import { GpuDetailPanel } from "../pages/GpuMonitoring";
import GpuManagement from "../pages/GpuManagement";
import { UserGpuManagementPanel } from "../pages/GpuManagement/GpuManagement";
import UserManagement from "../pages/UserManagement";
import Settings from "../pages/Settings";
import About from "../pages/About";

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
            element: <UserManagement />,
          },
          {
            path: "notification",
            element: <></>,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "help",
            element: <></>,
          },
          {
            path: "about",
            element: <About />,
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
