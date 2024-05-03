import reactLogo from "../../assets/react.svg";
import expressLogo from "../../assets/express.svg";
import muiLogo from "../../assets/material-ui.svg";
import mongodbLogo from "../../assets/mongodb.svg";
import reduxLogo from "../../assets/redux.svg";
import styles from "./About.module.scss";
import Box from "@mui/material/Box";

import {
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";

import { useAppDispatch } from "../../store/hooks";

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
          <a href="https://redux.js.org/" target="_blank">
            <img src={reduxLogo} className="logo redux" alt="Redux logo" />
          </a>
          <a href="https://mui.com/" target="_blank">
            <img
              src={muiLogo}
              className="logo mui"
              alt="MUI logo"
              style={{
                width: "6rem",
                height: "6rem",
                padding: "1.2rem",
              }}
            />
          </a>
          <a href="https://expressjs.com/" target="_blank">
            <img
              src={expressLogo}
              className="logo express"
              alt="Express logo"
            />
          </a>

          <a href="https://www.mongodb.com/" target="_blank">
            <img
              src={mongodbLogo}
              className="logo mongodb"
              alt="MongoDB logo"
            />
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
