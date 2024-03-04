import { Box, Link } from "@mui/material";
import { useRouteError, isRouteErrorResponse, NavLink } from "react-router-dom";

const NotFound = () => {
  const error = useRouteError();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
      <Link component={NavLink} to={"/"}>
        Go back to Home
      </Link>
    </Box>
  );
};

export default NotFound;
