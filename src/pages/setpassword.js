import React, { useState, useEffect } from "react";
import Axios from "axios";

import LoadingData from "../components/loading";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";

import SaveIcon from "@material-ui/icons/Save";

import { Redirect } from "react-router-dom";

import LogoLoakarya from "../assets/logo.png";

export default function SetPassword(props) {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [snackbarText, setSnackbarText] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState();
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState();
  const [checkToken, setCheckToken] = useState(false);

  useEffect(() => {
    Axios.get("/user/me", {
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then(() => {
        setCheckToken(true);
      })
      .catch(() => {
        setRedirect("/");
      });
  }, []);

  const handleChangePassword = (event) => {
    event.preventDefault();
    if (
      password &&
      confirmPassword &&
      password == confirmPassword &&
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
    ) {
      setLoading(true);
      Axios.patch(
        "/user/password",
        {
          old_password: process.env.REACT_APP_EMPLOYEE_DEFAULT_PASSWORD,
          new_password: password,
          new_password_confirm: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
        .then((response) => {
          setSnackbarText(
            "Your password has been saved. You will be redirected to the login page..."
          );
          setSnackbarOpen(true);
          setTimeout(() => {
            setRedirect("/login");
          }, 2000);
        })
        .catch((error) => {
          console.log(error.response);
          if ((error.response.status = 401)) {
            setSnackbarText(
              "This link is expired. Please contact the system administrator."
            );
          } else {
            setSnackbarText(
              "Error saving your password, please refresh the page and try again."
            );
          }

          setSnackbarOpen(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSnackbarText(
        "The password length must be 8 characters minimal, contains character and number, and has the same value with the confirmation value."
      );
      setSnackbarOpen(true);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (redirect) return <Redirect to={redirect} />;

  if (!checkToken) return <LoadingData />;

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          backgroundColor: "#e8eaf6",
          height: "100vh",
          width: "100vv",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container style={{ width: 500 }}>
          <Grid item xs={12}>
            <img src={LogoLoakarya} alt="logo-loakarya" width={400} />
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <Paper style={{ padding: 20 }}>
              <Typography variant="subtitle1">
                Please enter your desired password in the form below:
              </Typography>
              <form>
                <TextField
                  style={{ marginTop: 10 }}
                  label="Enter Password"
                  variant="outlined"
                  type="password"
                  onChange={handlePasswordChange}
                  fullWidth
                />
                <TextField
                  style={{ marginTop: 10 }}
                  label="Re-enter Password"
                  variant="outlined"
                  type="password"
                  onChange={handleConfirmPasswordChange}
                  fullWidth
                />
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                    marginTop: 10,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SaveIcon />}
                    type="submit"
                    onClick={handleChangePassword}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
              </form>
              {loading ? (
                <LinearProgress
                  style={{
                    marginTop: 16,
                    marginBottom: -20,
                    marginLeft: -19,
                    marginRight: -19,
                  }}
                />
              ) : null}
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 10 }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <Typography variant="caption" style={{ color: "#9fa8da" }}>
                Loakarya Indonesia &copy; 2021
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
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
    </React.Fragment>
  );
  //   return <h1>{props.token}</h1>;
}
