import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, IconButton } from "@mui/material";
import { UserData } from ".";

function createData(
  id: string,
  username: string,
  email: string,
  role: string,
  active: boolean
) {
  return { id, username, email, role, active };
}

interface UserTableProps {
  userDataList: UserData[];
  onEditUser?: (userId: string) => void;
}

const UserTable = (props: UserTableProps) => {
  const { userDataList, onEditUser = () => {} } = props;

  const rows = userDataList.map((userData) =>
    createData(
      userData.id,
      userData.username,
      userData.email,
      userData.role,
      true
    )
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">User Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                align="left"
                sx={{ fontWeight: "bold" }}
              >
                {row.username}
              </TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="left">{row.role}</TableCell>
              <TableCell align="left">
                {row.active ? (
                  <Chip label="Active" color="success" size="small" />
                ) : (
                  <Chip label="Deactive" color="error" size="small" />
                )}
              </TableCell>
              <TableCell align="left">
                <IconButton onClick={() => onEditUser(row.id)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
