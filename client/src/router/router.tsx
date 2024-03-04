import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { AppDefaultLayout } from "../components/Container";

const customRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/",
        element: <AppDefaultLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "monitoring-gpus",
            element: <></>,
          },
          {
            path: "gpu-management",
            element: <></>,
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
