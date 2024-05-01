import { useState } from "react";
import reactLogo from "../../assets/react.svg";
import styles from "./About.module.scss";
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

const LogoBlock = () => {
  return (
    <Box className={styles["about-root"]}>
      <Stack className={"container"}>
        <div className="row">
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </Stack>
    </Box>
  );
};

const About = () => {
  const dispatch = useAppDispatch();

  return (
    <Stack height={"100vh"} sx={{ overflowY: "scroll" }}>
      <Container maxWidth="sm">
        <Typography marginY={"3.2rem"} variant="h4">
          About
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <ListItemText
              sx={{
                flexShrink: 0,
              }}
              id="about-label-tech-author"
              primary="作者"
            />
            <Stack direction={"row"}>
              <Stack alignItems={"end"}>
                <Typography component={"span"}>Von Brank</Typography>
                <Typography component={"span"} sx={{ opacity: 0.5 }}>
                  Harbin Institute of Technology
                </Typography>
              </Stack>
            </Stack>
          </ListItem>
          <ListItem>
            <ListItemText
              sx={{
                flexShrink: 0,
              }}
              id="about-label-tech-stack"
              primary="技术栈"
            />
            <Stack alignItems={"end"} width="100%">
              <LogoBlock />
            </Stack>
          </ListItem>
        </List>
      </Container>
    </Stack>
  );
};

export default About;
