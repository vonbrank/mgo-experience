import { Badge, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet } from "react-router-dom";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import Menu from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import PeopleIcon from "@mui/icons-material/People";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { SidebarThemeProvider } from "../../theme";

const drawerWidth = "24rem";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface ListItemProp {
  text: string;
  iconElement: React.ReactNode;
  to: string;
}

export const AppDefaultLayout = () => {
  const theme = useTheme();
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [allowToggleSideBar, setAllowToggleSideBar] = useState(false);

  const handleSideBarDrawerOpen = () => {
    setSideBarOpen(true);
  };

  const handleSideBarDrawerClose = () => {
    setSideBarOpen(false);
  };

  const listItemPropsUp: ListItemProp[] = [
    {
      text: "Monitoring GPUs",
      iconElement: <MonitorHeartIcon />,
      to: "/monitoring-gpus",
    },
    {
      text: "GPU Management",
      iconElement: <DeveloperBoardIcon />,
      to: "/gpu-management",
    },
    {
      text: "User Management",
      iconElement: <PeopleIcon />,
      to: "/user-management",
    },
    {
      text: "Notification",
      iconElement: <NotificationsIcon />,
      to: "/notification",
    },
  ];
  const listItemPropsDown: ListItemProp[] = [
    {
      text: "Settings",
      iconElement: <SettingsIcon />,
      to: "/settings",
    },
    {
      text: "Help",
      iconElement: <HelpCenterIcon />,
      to: "/help",
    },
  ];

  return (
    <Stack direction={"row"} sx={{ position: "relative" }}>
      <SidebarThemeProvider>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={sideBarOpen}
        >
          <Stack justifyContent={"space-between"} sx={{ height: "100%" }}>
            <Box>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                padding={"1.8rem"}
              >
                <Typography variant="h6" fontWeight="bold">
                  127.0.0.1:5000
                </Typography>
                {allowToggleSideBar && (
                  <IconButton onClick={handleSideBarDrawerClose}>
                    {theme.direction === "ltr" ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                )}
              </Stack>

              <List>
                {listItemPropsUp.map((listItemProp, index) => {
                  if (listItemProp.text === "Notification") {
                    return (
                      <ListItem
                        key={index}
                        disablePadding
                        sx={{
                          "&.MuiListItem-root .MuiBadge-badge": {
                            marginRight: "0",
                          },
                        }}
                      >
                        <ListItemButton
                          component={NavLink}
                          to={listItemProp.to}
                          sx={{
                            "&.active": {
                              background: theme.palette.primary.main,
                            },
                          }}
                        >
                          <ListItemIcon>
                            {listItemProp.iconElement}
                          </ListItemIcon>
                          <ListItemText primary={listItemProp.text} />
                          <Badge badgeContent={4} color="secondary" />
                        </ListItemButton>
                      </ListItem>
                    );
                  }

                  return (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={listItemProp.to}
                        sx={{
                          "&.active": {
                            background: theme.palette.primary.main,
                          },
                        }}
                      >
                        <ListItemIcon>{listItemProp.iconElement}</ListItemIcon>
                        <ListItemText primary={listItemProp.text} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              <Divider />
              <List>
                {listItemPropsDown.map((listItemProp, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      component={NavLink}
                      to={listItemProp.to}
                      sx={{
                        "&.active": {
                          background: theme.palette.primary.main,
                        },
                      }}
                    >
                      <ListItemIcon>{listItemProp.iconElement}</ListItemIcon>
                      <ListItemText primary={listItemProp.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={"User Name"} secondary="username" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Stack>
        </Drawer>
      </SidebarThemeProvider>
      <Main open={sideBarOpen}>
        <Outlet />
      </Main>
      <Zoom in={!sideBarOpen}>
        <Fab
          sx={{ position: "absolute", top: "1.2rem", left: "1.2rem" }}
          onClick={handleSideBarDrawerOpen}
        >
          <Menu />
        </Fab>
      </Zoom>
    </Stack>
  );
};
