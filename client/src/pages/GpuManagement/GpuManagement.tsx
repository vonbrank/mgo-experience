import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Collapse,
  Container,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { SecondaryLevelSidebarThemeProvider } from "../../theme";
import { grey } from "@mui/material/colors";
import { TransitionGroup } from "react-transition-group";
import { useState } from "react";
import { UserBase } from "../../features/auth";
import { Outlet, NavLink, useParams } from "react-router-dom";
import { useAllUserData } from "../../features/auth/authAPI";
import UserGpuTransferList from "./UserGpuTransferList";
import { useFetchAuthUserGpu } from "../../features/gpu/gpuAPI";
import { GpuModel } from "../../features/gpu";

const GpuManagement = () => {
  const [users, loading, error, fetchUsers] = useAllUserData();

  return (
    <Stack direction={"row"} height={"100vh"}>
      <Box
        width={"36rem"}
        sx={{ backgroundColor: grey[100], overflowY: "scroll" }}
        height={"100%"}
      >
        <SecondaryLevelSidebarThemeProvider>
          <Typography padding={"1.6rem 3rem"} variant="h6">
            User GPUs Authorization
          </Typography>
          <List disablePadding>
            <TransitionGroup>
              {users.map((user) => (
                <Collapse key={user._id}>
                  <ListItem disablePadding key={user._id}>
                    <ListItemButton
                      // onClick={() => handleItemClicked(user)}
                      component={NavLink}
                      to={user._id}
                      sx={{
                        "&.active": {
                          backgroundColor: (theme) =>
                            theme.palette.primary.main,
                          "& .MuiTypography-root.label-primary": {
                            color: grey[50],
                          },
                          "& .MuiTypography-root.label-secondary": {
                            color: grey[500],
                          },
                          "& .MuiChip-root": {
                            backgroundColor: alpha(grey[50], 0.08),
                            "& .MuiChip-label": {
                              color: grey[50],
                            },
                          },
                        },
                      }}
                    >
                      <Stack
                        direction={"row"}
                        width={"100%"}
                        padding={"1.2rem"}
                        justifyContent="space-between"
                      >
                        <Typography
                          fontWeight={"bold"}
                          className="label-primary"
                        >
                          {user.name}
                        </Typography>
                        <Chip label={user.role} size="small" />
                      </Stack>
                    </ListItemButton>
                  </ListItem>
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
          <Divider flexItem />
        </SecondaryLevelSidebarThemeProvider>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default GpuManagement;

export const UserGpuManagementPanel = () => {
  const { userId } = useParams();

  const [result, loading, error, fetch] = useFetchAuthUserGpu(userId || "");

  const handleConfirm = (left: GpuModel[], right: GpuModel[]) => {
    fetch();
  };

  return (
    <SecondaryLevelSidebarThemeProvider>
      <Stack height={"100vh"}>
        <Container sx={{ flex: 1, overflowY: "scroll" }}>
          <Typography marginY={"3.2rem"} variant="h4">
            Manage User GPU Permission
          </Typography>
          <Divider flexItem />
          <Box marginY={"3.2rem"} />
          <UserGpuTransferList
            initLeft={result.granted}
            initRight={result.denied}
            onConfirm={handleConfirm}
          />
        </Container>
      </Stack>
    </SecondaryLevelSidebarThemeProvider>
  );
};
