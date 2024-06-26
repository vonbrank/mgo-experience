import { Badge, Stack, StackProps, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { Outlet, useNavigate } from "react-router-dom";
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
import InfoIcon from "@mui/icons-material/Info";
import { SidebarThemeProvider } from "../../theme";
import { useUserData } from "../../features/auth/authAPI";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth";
import { FormattedMessage } from "react-intl";

const drawerWidth = "30rem";

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
  text: string | React.ReactNode;
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
      text: <FormattedMessage id="menu.monitoringGpus" />,
      iconElement: <MonitorHeartIcon />,
      to: "/monitoring-gpus",
    },
    {
      text: <FormattedMessage id="menu.gpuManagement" />,
      iconElement: <DeveloperBoardIcon />,
      to: "/gpu-management",
    },
    {
      text: <FormattedMessage id="menu.userManagement" />,
      iconElement: <PeopleIcon />,
      to: "/user-management",
    },
    {
      text: <FormattedMessage id="menu.notification" />,
      iconElement: <NotificationsIcon />,
      to: "/notification",
    },
  ];
  const listItemPropsDown: ListItemProp[] = [
    {
      text: <FormattedMessage id="menu.settings" />,
      iconElement: <SettingsIcon />,
      to: "/settings",
    },
    {
      text: <FormattedMessage id="menu.help" />,
      iconElement: <HelpCenterIcon />,
      to: "/help",
    },
    {
      text: <FormattedMessage id="menu.about" />,
      iconElement: <InfoIcon />,
      to: "/about",
    },
  ];

  const { userData } = useAppSelector((state) => ({
    userData: state.auth.user,
  }));
  const appDisptach = useAppDispatch();

  const [, , , ,] = useUserData();

  const navigate = useNavigate();

  const handleUserItemClicked = () => {
    appDisptach(logout());
  };

  useEffect(() => {
    if (userData === null) {
      navigate("/login");
    }
  }, [userData]);

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
                  <ListItemButton onClick={handleUserItemClicked}>
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={userData?.email || ""}
                      secondary={userData?.id || ""}
                    />
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

interface MonitoringBlockContainerProps extends StackProps {
  label: string;
}

export const MonitoringBlockContainer = (
  props: MonitoringBlockContainerProps
) => {
  const {
    label,
    children,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    spacing = "1.2rem",
    ...others
  } = props;
  return (
    <Stack {...others}>
      <Stack
        padding={padding}
        paddingLeft={paddingLeft}
        paddingBottom={paddingBottom}
        paddingTop={paddingTop}
        paddingRight={paddingRight}
        spacing={spacing}
      >
        <Typography fontWeight={"bold"}>{label}</Typography>
        <Box>{children}</Box>
      </Stack>
    </Stack>
  );
};
