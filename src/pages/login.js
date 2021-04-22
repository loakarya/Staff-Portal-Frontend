import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";

import BusinessmanImage from "../assets/businessman.jpg";
import GoogleLogo from "../assets/google_logo.png";
import LoakaryaLogo from "../assets/logo.png";

import { Redirect } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import GoogleLogin from "react-google-login";
import Axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://loakarya.co/">
        Loakarya Indonesia
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${BusinessmanImage})`,
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [redirect, setRedirect] = useState();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);

    Axios.post("/auth/login", {
      email: email,
      password: password,
    })
      .then((response) => {
        removeCookie("access_token");
        setCookie("access_token", response.data.access_token);
        handleSnackbarOpen(
          "Logged in, you will be redirected to the dashboard page..."
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("Failed to login, please recheck your credentials.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const responseGoogle = (response) => {
    Axios.post("/auth/login/google", {
      token: response.getAuthResponse().id_token,
    })
      .then((response) => {
        removeCookie("access_token");
        setCookie("access_token", response.data.access_token);
        handleSnackbarOpen(
          "Logged in, you will be redirected to the dashboard page..."
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("Failed to login, please recheck your credentials.");
      });
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <CookiesProvider>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <img src={LoakaryaLogo} height={28} />
            <Typography component="h1" variant="h5" style={{ marginTop: 10 }}>
              Staff Portal
            </Typography>
            <form className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleEmailChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                style={{ marginBottom: 24 }}
              />
              {loading ? <LinearProgress /> : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                // className={classes.submit}
                onClick={handleLogin}
                style={{ marginBottom: 10 }}
                disabled={loading}
              >
                Sign In
              </Button>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLEAPI_CLIENT_ID}
                render={(renderProps) => (
                  <Button
                    fullWidth
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    variant="contained"
                    style={{ backgroundColor: "white", marginBottom: 24 }}
                  >
                    <img
                      height={18}
                      src={GoogleLogo}
                      style={{ marginRight: 10 }}
                    />
                    Sign In With Google
                  </Button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarText}
      />
    </CookiesProvider>
  );
}
