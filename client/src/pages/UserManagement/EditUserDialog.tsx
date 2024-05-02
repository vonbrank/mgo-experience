import React, { useEffect, useState } from "react";
import { ItemBlock, UserData, roleList } from ".";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface EditUserDialogProps {
  initUserData: UserData | null;
  onClose?: () => void;
}

const EditUserDialog = (props: EditUserDialogProps) => {
  const { initUserData, onClose = () => {} } = props;
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (initUserData) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [initUserData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Edit User"}</DialogTitle>
      <DialogContent>
        <Stack spacing={"1.6rem"}>
          <ItemBlock label="ID">
            <Typography variant="body1">1234</Typography>
          </ItemBlock>
          <ItemBlock label="Role">
            <TextField
              select
              defaultValue={initUserData?.role || ""}
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
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
