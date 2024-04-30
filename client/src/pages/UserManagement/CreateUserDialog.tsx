import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ItemBlock, roleList } from ".";
import { PasswordTextField } from "../../components/TextField";

interface CreateUserDialogProps {
  open: boolean;
  onClose?: () => void;
}

const CreateUserDialog = (props: CreateUserDialogProps) => {
  const { open, onClose = () => {} } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Create User"}</DialogTitle>
      <DialogContent>
        <Stack spacing={"1.6rem"}>
          <ItemBlock label="User Name" labelWidth="15rem">
            <TextField variant="outlined" fullWidth size="small" />
          </ItemBlock>
          <ItemBlock label="Email" labelWidth="15rem">
            <TextField variant="outlined" fullWidth size="small" />
          </ItemBlock>
          <ItemBlock label="Password" labelWidth="15rem">
            <PasswordTextField size="small" />
          </ItemBlock>
          <ItemBlock label="Confirm Password" labelWidth="15rem">
            <PasswordTextField size="small" />
          </ItemBlock>
          <ItemBlock label="Role" labelWidth="15rem">
            <TextField
              select
              defaultValue={"user"}
              variant="outlined"
              fullWidth
              size="small"
            >
              {roleList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </ItemBlock>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} autoFocus>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
