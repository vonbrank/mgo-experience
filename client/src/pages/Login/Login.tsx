import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserLogin, useUserData } from "../../features/auth/authAPI";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userLoginResult, logingIn, loginError, userLogin] = useUserLogin();

  const handleSignIn = () => {
    userLogin({
      email,
      password,
    });
  };

  useEffect(() => {
    if (userLoginResult && loginError === null) {
      navigate("/");
    }
  }, [userLoginResult, loginError]);

  const [fetchUserDataResult, , fetchUserDataError] = useUserData();

  useEffect(() => {
    if (fetchUserDataResult && fetchUserDataError === null) {
      navigate("/");
    }
  }, [fetchUserDataResult, fetchUserDataError]);

  return (
    <Box
      sx={{
        background: "linear-gradient(to left, #71B280, #134E5E)",
      }}
    >
      <Container
        sx={{
          minHeight: "100vh",
        }}
      >
        <Stack
          sx={{ minHeight: "inherit", paddingY: "4.8rem" }}
          justifyContent={"center"}
        >
          <Paper sx={{ overflow: "hidden" }}>
            <Stack direction={"row"}>
              <Box sx={{ flex: 1, width: 0 }}>
                <Stack
                  paddingX={"9.6rem"}
                  paddingTop={"6.4rem"}
                  paddingBottom={"3.2rem"}
                  justifyContent={"space-between"}
                  spacing={"4.8rem"}
                >
                  <Box>
                    <Typography
                      textAlign={"center"}
                      variant="h5"
                      color={(theme) => theme.palette.primary.main}
                    >
                      MGO Experience
                    </Typography>

                    <Typography
                      textAlign={"center"}
                      variant="h6"
                      marginTop={"3.6rem"}
                    >
                      Sign In your account
                    </Typography>

                    <Stack spacing={"2.4rem"} marginTop={"1.8rem"}>
                      <Stack spacing={"1.2rem"}>
                        <Typography variant="subtitle1">Email</Typography>
                        <TextField
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          size="small"
                          autoComplete="off"
                          fullWidth
                        />
                      </Stack>
                      <Stack spacing={"1.2rem"}>
                        <Typography variant="subtitle1">Password</Typography>
                        <TextField
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          size="small"
                          autoComplete="off"
                          fullWidth
                          type="password"
                        />
                      </Stack>
                    </Stack>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ marginTop: "3.6rem" }}
                      onClick={handleSignIn}
                    >
                      SIGN IN
                    </Button>
                  </Box>
                  <Box>
                    <Typography textAlign={"center"}>
                      © Copyright 2024
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Stack sx={{ flex: 1, width: 0 }}>
                <img
                  style={{
                    objectFit: "cover",
                    flex: 1,
                    objectPosition: "left",
                  }}
                  src="https://vonbrank-images.oss-cn-hangzhou.aliyuncs.com/20240504-MGO-Experience/login-side-image.jpg"
                />
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Login;
