import { useState } from "react";
import reactLogo from "../../assets/react.svg";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  TextField,
  Typography,
  Stack,
  List,
  ListItem,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Switch,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Divider,
  ListItemButton,
  Container,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import KeyIcon from "@mui/icons-material/Key";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import CheckIcon from "@mui/icons-material/Check";
import { PasswordTextField } from "../../components/TextField";

const Settings = () => {
  const dispatch = useAppDispatch();

  return (
    <Stack height={"100vh"} sx={{ overflowY: "scroll" }}>
      <Container maxWidth="sm">
        <Typography marginY={"2.4rem"} variant="h4">
          Settings
        </Typography>
        <Divider />
        <List subheader={<ListSubheader>常规</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText
              id="toggle-button-group-list-label-darkmode"
              primary="黑暗模式"
            />
            <ToggleButtonGroup
              // value={themeMode}
              exclusive
              // onChange={handleDarkMode}
              aria-label="text alignment"
            >
              <ToggleButton value="followSystem" aria-label="follow-system">
                跟随系统
              </ToggleButton>
              <ToggleButton value="light" aria-label="light">
                浅色
              </ToggleButton>
              <ToggleButton value="dark" aria-label="dark">
                深色
              </ToggleButton>
            </ToggleButtonGroup>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TranslateIcon />
            </ListItemIcon>
            <ListItemText id="language-select-label-language" primary="语言" />
            <Box minWidth={"14.4rem"}>
              <FormControl fullWidth>
                <Select
                  // value={language}
                  // onChange={(e) => setLanguage(e.target.value)}
                  size="small"
                >
                  <MenuItem value={"Chinese"}>中文</MenuItem>
                  <MenuItem value={"English"}>English</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ListItem>
        </List>
        <Divider />
        <List subheader={<ListSubheader>重置密码</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <KeyIcon />
            </ListItemIcon>
            <ListItemText primary="原密码" />
            <Box minWidth={"19.2rem"}>
              <PasswordTextField variant="outlined" size="small" fullWidth />
            </Box>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FiberNewIcon />
            </ListItemIcon>
            <ListItemText primary="新密码" />
            <Box minWidth={"19.2rem"}>
              <PasswordTextField variant="outlined" size="small" fullWidth />
            </Box>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText primary="确认密码" />
            <Box minWidth={"19.2rem"}>
              <PasswordTextField variant="outlined" size="small" fullWidth />
            </Box>
          </ListItem>
          <ListItem>
            <ListItemIcon></ListItemIcon>
            <Stack sx={{ flex: 1 }} spacing={"1.2rem"}>
              <Button fullWidth variant="outlined">
                Reset
              </Button>
              <Button fullWidth variant="contained">
                Confirm
              </Button>
            </Stack>
          </ListItem>
        </List>
      </Container>
    </Stack>
  );
};

export default Settings;
