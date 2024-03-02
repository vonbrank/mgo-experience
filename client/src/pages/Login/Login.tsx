import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
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
                <Box paddingX={"6.4rem"} paddingY={"6.4rem"}>
                  <Typography textAlign={"center"} variant="h5">
                    MGO Experience
                  </Typography>

                  <Typography
                    textAlign={"center"}
                    variant="h6"
                    marginTop={"4.8rem"}
                  >
                    Sign In your account
                  </Typography>

                  <Stack spacing={"3rem"} marginTop={"3.6rem"}>
                    <Stack spacing={"1.2rem"}>
                      <Typography variant="subtitle1">Email</Typography>
                      <TextField fullWidth />
                    </Stack>
                    <Stack spacing={"1.2rem"}>
                      <Typography variant="subtitle1">Password</Typography>
                      <TextField fullWidth />
                    </Stack>
                  </Stack>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ marginTop: "3.6rem" }}
                  >
                    SIGN IN
                  </Button>
                </Box>
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
