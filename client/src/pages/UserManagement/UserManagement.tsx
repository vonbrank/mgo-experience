import {
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import { useAllUserData } from "../../features/auth/authAPI";

import EditUserDialog from "./EditUserDialog";
import { SearchBar } from "../../components/TextField";
import CreateUserDialog from "./CreateUserDialog";

export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

const UserManagement = () => {
  const [data, loading, error, fetch] = useAllUserData();

  const [currentEditingUser, setCurrentEditingUser] = useState<UserData | null>(
    null
  );

  const handleEditUser = (userId: string) => {
    const userData = data.find((item) => item._id === userId) || null;
    if (userData) {
      setCurrentEditingUser({
        ...userData,
        username: userData.name,
        id: userData._id,
      });
    }
  };

  const handleUserEditClose = () => {
    setCurrentEditingUser(null);
  };

  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);

  return (
    <Stack height={"100vh"} sx={{ overflowY: "scroll" }}>
      <Container>
        <Typography marginY={"3.2rem"} variant="h4">
          User Management
        </Typography>
        <Divider />
        <Box marginTop={"3.2rem"}>
          <Stack
            direction={"row"}
            justifyContent="space-between"
            marginBottom={"1.6rem"}
          >
            <Box>
              <SearchBar />
            </Box>
            <Button
              variant="contained"
              onClick={() => setOpenCreateUserDialog(true)}
            >
              Create
            </Button>
          </Stack>
          <UserTable
            userDataList={data.map((item) => ({
              ...item,
              username: item.name,
              id: item._id,
            }))}
            onEditUser={handleEditUser}
          />
        </Box>
      </Container>
      <EditUserDialog
        initUserData={currentEditingUser}
        onClose={handleUserEditClose}
      />
      <CreateUserDialog
        open={openCreateUserDialog}
        onClose={() => setOpenCreateUserDialog(false)}
      />
    </Stack>
  );
};

export default UserManagement;

interface ItemBlockProps {
  label: string;
  labelWidth?: string;
  children: React.ReactNode;
}

export const ItemBlock = (props: ItemBlockProps) => {
  const { label, labelWidth = "12rem", children } = props;
  return (
    <Stack direction={"row"}>
      <Stack width={labelWidth} justifyContent={"center"}>
        <Typography variant="subtitle1">{label}</Typography>
      </Stack>
      <Box width={"24rem"}>{children}</Box>
    </Stack>
  );
};

export const roleList = [
  {
    value: "supervisor",
    label: "Supervisor",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "user",
    label: "User",
  },
];
