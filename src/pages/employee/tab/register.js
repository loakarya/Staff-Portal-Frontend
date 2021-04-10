import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import LoadingData from "../../../components/loading";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from "@material-ui/core/LinearProgress";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import DoneIcon from "@material-ui/icons/Done";

import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import Axios from "axios";

import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = React.createRef();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function getSteps() {
  return [
    "Fill the user profile information",
    "Fill the user employee information",
    "Input the employee email passwords",
  ];
}

export default function RegisterUser(props) {
  const [cookies, setCookies, removeCookies] = useCookies();

  const [captchaValue, setCaptchaValue] = useState("");
  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [privateEmail, setPrivateEmail] = useState("");

  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountProvider, setBankAccountProvider] = useState("");
  const [division, setDivision] = useState("");
  const [title, setTitle] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");

  const [companyEmailPassword, setCompanyEmailPassword] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [redirect, setRedirect] = useState();

  useEffect(() => {}, []);

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    if (activeStep !== steps.length - 1)
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    else setDialogOpen(true);
    setCaptchaValue("");
  };

  const handleBack = () => {
    if (activeStep !== 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCaptchaValue("");
  };

  const handleSaveEmployee = () => {
    if (
      email &&
      firstName &&
      lastName &&
      address &&
      zipCode &&
      city &&
      province &&
      country &&
      privateEmail &&
      bankAccountNumber &&
      bankAccountProvider &&
      division &&
      title &&
      employeeNumber
    ) {
      if (captchaValue) {
        console.table({
          email: `${email}@loakarya.co`,
          first_name: firstName,
          last_name: lastName,
          address,
          zip_code: zipCode,
          city,
          province,
          country,
          private_email: privateEmail,
          bank_account_number: bankAccountNumber,
          bank_account_provider: bankAccountProvider,
          division,
          title,
          employee_number: employeeNumber,
        });
        setLoading(true);
        Axios.put(
          "/employee",
          {
            email: `${email}@loakarya.co`,
            first_name: firstName,
            last_name: lastName,
            address,
            zip_code: zipCode,
            city,
            province,
            country,
            private_email: privateEmail,
            bank_account_number: bankAccountNumber,
            bank_account_provider: bankAccountProvider,
            division,
            title,
            employee_number: employeeNumber,
          },
          {
            headers: {
              Authorization: `Bearer${cookies.access_token}`,
            },
          }
        )
          .then((response) => {
            setCompanyEmailPassword(response.data.data.company_email_password);
            handleSnackbarOpen("The new employee account has been saved.");
            handleNext();
          })
          .catch((error) => {
            console.error(error.response.data);
            handleSnackbarOpen(
              "Failed to save the new employee. Please recheck all the filled value."
            );
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        handleSnackbarOpen(
          "Please finish the reCAPTCHA challange to ensure you are not a robot."
        );
      }
    } else {
      handleSnackbarOpen("Please fill all the required section!");
    }
  };

  const handleRedirectToEmployeeList = () => {
    handleSnackbarOpen(
      "You will be redirected to the employee list section..."
    );
    setTimeout(() => {
      handleDialogClose();
      window.location.reload();
    }, 2000);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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

  const handlePrivateEmailChange = (event) => {
    setPrivateEmail(event.target.value);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBankAccountNumberChange = (event) => {
    setBankAccountNumber(event.target.value);
  };

  const handleBankAccountProviderChange = (event) => {
    setBankAccountProvider(event.target.value);
  };

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleEmployeeNumberChange = (event) => {
    setEmployeeNumber(event.target.value);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 20 }}>
                <Typography variant="subtitle1">
                  Please fill the form below to input the new employee's basic
                  profile information.
                </Typography>
                <Grid container spacing={2} style={{ marginTop: 10 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      autoFocus
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
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                  variant="outlined"
                  style={{ marginTop: 15 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        @loakarya.co
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
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
                  multiline
                  rows={4}
                  fullWidth
                />
              </Paper>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 20 }}>
                <Typography variant="subtitle1">
                  Please fill the form below to input the new employee's basic
                  profile information.
                </Typography>
                <Grid container spacing={2} style={{ marginTop: 10 }}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      autoFocus
                      label="Account Number"
                      variant="outlined"
                      type="number"
                      value={bankAccountNumber}
                      onChange={handleBankAccountNumberChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl variant="outlined" style={{ width: "100%" }}>
                      <InputLabel htmlFor="bank-account-provider">
                        Bank
                      </InputLabel>
                      <Select
                        native
                        value={bankAccountProvider}
                        onChange={handleBankAccountProviderChange}
                        label="Bank"
                        inputProps={{
                          name: "bank-account-provider",
                          id: "bank-account-provider",
                        }}
                      >
                        <option></option>
                        <option value="Bank BRI">Bank BRI</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="Bank BNI">Bank BNI</option>
                        <option value="Bank BTN">Bank BTN</option>
                        <option value="Bank BCA">Bank BCA</option>
                        <option value="Bank Syariah Indonesia">
                          Bank Syariah Indonesia
                        </option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="Bank Danamon">Bank Danamon</option>
                        <option value="Bank Muamalat">Bank Muamalat</option>
                        <option value="Bank BTN Syariah">
                          Bank BTN Syariah
                        </option>
                        <option value="Panin Bank">Panin Bank</option>
                        <option value="Bank Bukopin">Bank Bukopin</option>
                        <option value="Bank Sinarmas">Bank Sinarmas</option>
                        <option value="Bank Permat">Bank Permata</option>
                        <option value="CIMB Niag">CIMB Niaga</option>
                        <option value="OCBC NISP">OCBC NISP</option>
                        <option value="Bank Mega">Bank Mega</option>
                        <option value="Bank Mega Syariah">
                          Bank Mega Syariah
                        </option>
                        <option value="Bank BTPN">Bank BTPN</option>
                        <option value="Bank Jago">Bank Jago</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TextField
                  label="Private Email"
                  variant="outlined"
                  style={{ marginTop: 15 }}
                  value={privateEmail}
                  onChange={handlePrivateEmailChange}
                  fullWidth
                />

                <Grid container spacing={2} style={{ marginTop: 10 }}>
                  <Grid item xs={12} md={4}>
                    <FormControl variant="outlined" style={{ width: "100%" }}>
                      <InputLabel htmlFor="division-in-loakarya">
                        Division
                      </InputLabel>
                      <Select
                        native
                        value={division}
                        onChange={handleDivisionChange}
                        label="Division"
                        inputProps={{
                          name: "division-in-loakarya",
                          id: "division-in-loakarya",
                        }}
                        fullWidth
                      >
                        <option></option>
                        <option value="Marketing">Marketing</option>
                        <option value="Technology">Technology</option>
                        <option value="Product">Product</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Position"
                      variant="outlined"
                      fullWidth
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Employee Number"
                  variant="outlined"
                  style={{ marginTop: 15 }}
                  fullWidth
                  type="number"
                  value={employeeNumber}
                  onChange={handleEmployeeNumberChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        loakarya-
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography variant="subtitle2" style={{ marginTop: 10 }}>
                  If you have rechecked all the filled value, click next to save
                  the new employee user to the system.
                </Typography>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 10,
                  }}
                >
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                </div>
                {loading ? (
                  <LinearProgress
                    style={{
                      marginTop: 17,
                      marginBottom: -20,
                      marginLeft: -19,
                      marginRight: -19,
                    }}
                  />
                ) : null}
              </Paper>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 20 }}>
                <Typography variant="subtitle1">
                  The new <b>{`"${firstName} ${lastName}"`}</b> employee's
                  account has been created. The instruction to set the user
                  password was sent to employee's private email{" "}
                  <b>({privateEmail})</b>. Please add a new email account{" "}
                  <Link href="https://loakarya.co:2083" target="_blank">
                    <b>in the hosting</b>
                  </Link>{" "}
                  with email <b>{`${email}@loakarya.co`}</b> and the secure
                  password below:
                </Typography>

                <TextField
                  label="User's Company Email Password"
                  variant="outlined"
                  style={{ marginTop: 15 }}
                  value={companyEmailPassword}
                  onChange={null}
                  fullWidth
                />

                <Typography variant="subtitle2" style={{ marginTop: 10 }}>
                  If you have finished adding the new email account in the
                  hosting, please click the finish button below to close this
                  menu.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  function onCaptchaChange(value) {
    setCaptchaValue(value);
  }

  if (redirect) return <Redirect to={redirect} />;

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          <div>
            <Box className={classes.instructions}>
              {getStepContent(activeStep)}
            </Box>
            <Grid container>
              <Grid item xs={12} md={6}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                    marginTop: 15,
                  }}
                >
                  <Button
                    variant="contained"
                    disabled={
                      activeStep === 0 || activeStep === steps.length - 1
                    }
                    onClick={handleBack}
                    className={classes.button}
                    startIcon={<NavigateBeforeIcon />}
                  >
                    Back
                  </Button>
                  {activeStep === 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveEmployee}
                      className={classes.button}
                      endIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                      endIcon={
                        activeStep === steps.length - 1 ? (
                          <DoneIcon />
                        ) : (
                          <NavigateNextIcon />
                        )
                      }
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
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
        action={
          <React.Fragment>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>{" "}
          </React.Fragment>
        }
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{"Email Saving Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you have added the employee's company email{" "}
            <b>manually</b> to the hosting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRedirectToEmployeeList} color="primary">
            Yes, I am Sure
          </Button>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            No, I am not Sure
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
