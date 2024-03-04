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

const Login = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/");
  };

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
                        <TextField size="small" autoComplete="off" fullWidth />
                      </Stack>
                      <Stack spacing={"1.2rem"}>
                        <Typography variant="subtitle1">Password</Typography>
                        <TextField size="small" autoComplete="off" fullWidth />
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
                  src="https://i.ytimg.com/vi/xFEK6Xc3pBA/sddefault.jpg"
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
