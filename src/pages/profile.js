import React, { useState, useEffect } from "react";
import MiniDrawer from "../components/drawer";
import LoadingData from "../components/loading";
import { useCookies } from "react-cookie";
import Axios from "axios";
import { Redirect } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function aclDescription(aclIndex) {
  if (aclIndex == 0) return "Regular";
  else if (aclIndex == 1) return "Administrator";
  else if (aclIndex == 2) return "Master";

  return "Unknown";
}

export default function Profile(props) {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [redirect, setRedirect] = useState();
  const [userLoaded, setUserLoaded] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPasswordConfirm, setNewPasswordConfirm] = useState();

  const [acl, setAcl] = useState();
  const [email, setEmail] = useState();
  const [emailVerifiedAt, setEmailVerifiedAt] = useState();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    Axios.get("/auth/me", {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    }).then((response) => {
      setAcl(response.data.acl);
      setEmail(response.data.email);
      setEmailVerifiedAt(response.data.email_verified_at);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setCountry(response.data.country);
      setProvince(response.data.province);
      setCity(response.data.city);
      setZipCode(response.data.zip_code);
      setAddress(response.data.address);
      setUserLoaded(true);
    });
  }, []);

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleNewPasswordConfirmChange = (event) => {
    setNewPasswordConfirm(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleProfileUpdate = () => {
    Axios.patch(
      "/user",
      {
        first_name: firstName,
        last_name: lastName,
        address,
        zip_code: zipCode,
        city,
        province,
        country,
      },
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    ).then(() => {
      handleSnackbarOpen("Your profile details have been updated.");
    });
  };

  const handleChangePassword = () => {
    Axios.patch(
      "/user/password",
      {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      },
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    )
      .then(() => {
        handleSnackbarOpen(
          "The password has been changed. Please re-login to continue using your account."
        );
        setTimeout(() => {
          removeCookies("access_token");
          setRedirect("/login");
        }, 2000);
      })
      .catch((error) => {
        if (error.response.status === 422)
          handleSnackbarOpen(
            "Please ensure the all the field is filled and the password field value is same with the confirmation field value."
          );

        if (error.response.status === 401)
          handleSnackbarOpen("Please ensure the old password is correct.");
      });
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (redirect) return <Redirect to={redirect} />;

  if (!userLoaded)
    return (
      <MiniDrawer master={props.master}>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer title="Modify User Profile" master={props.master}>
      <Typography variant="subtitle1">
        Please edit the form below to update your profile information or to
        change your password.
      </Typography>
      <Grid container spacing={2} style={{ marginTop: 5 }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  value={lastName}
                  onChange={handleLastNameChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Access Control Level"
              defaultValue={aclDescription(acl)}
              variant="outlined"
              style={{ marginTop: 15 }}
              fullWidth
              disabled
            />

            <TextField
              label="Email"
              defaultValue={email}
              variant="outlined"
              style={{ marginTop: 15 }}
              fullWidth
              disabled
            />

            <TextField
              label="Email Verified At"
              defaultValue={emailVerifiedAt}
              variant="outlined"
              style={{ marginTop: 15 }}
              fullWidth
              disabled
            />

            <TextField
              label="Country"
              variant="outlined"
              style={{ marginTop: 15 }}
              value={country}
              onChange={handleCountryChange}
              fullWidth
            />

            <TextField
              label="Province"
              variant="outlined"
              style={{ marginTop: 15 }}
              value={province}
              onChange={handleProvinceChange}
              fullWidth
            />
            <TextField
              label="City"
              variant="outlined"
              style={{ marginTop: 15 }}
              value={city}
              onChange={handleCityChange}
              fullWidth
            />
            <TextField
              label="Zip Code"
              variant="outlined"
              style={{ marginTop: 15 }}
              value={zipCode}
              onChange={handleZipCodeChange}
              fullWidth
            />
            <TextField
              label="Address"
              variant="outlined"
              style={{ marginTop: 15 }}
              value={address}
              onChange={handleAddressChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 10 }}
              onClick={handleProfileUpdate}
            >
              Update Profile
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 15 }}>
            <Typography variant="h6">Change Password</Typography>
            <Typography variant="subtitle2">
              Please enter the old and the new password below then click the
              save new password button
            </Typography>
            <TextField
              label="Old Password"
              type="password"
              variant="outlined"
              style={{ marginTop: 10 }}
              margin="dense"
              onChange={handleOldPasswordChange}
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              style={{ marginTop: 10 }}
              margin="dense"
              onChange={handleNewPasswordChange}
              fullWidth
            />
            <TextField
              label="New Password Confirm"
              type="password"
              variant="outlined"
              margin="dense"
              style={{ marginTop: 10 }}
              onChange={handleNewPasswordConfirmChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              style={{ marginTop: 10 }}
            >
              Update Password
            </Button>
          </Paper>
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
        action={
          <React.Fragment>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </MiniDrawer>
  );
}
