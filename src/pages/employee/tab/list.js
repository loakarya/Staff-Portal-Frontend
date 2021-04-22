import React, { useState, useEffect } from "react";

import LoadingData from "../../../components/loading";
import UserCard from "../../../components/usercard";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

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

import Typography from "@material-ui/core/Typography";

import { useCookies } from "react-cookie";
import Axios from "axios";

export default function ListEmployee(props) {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [employees, setEmployees] = useState({ links: [] });
  const [employeeLoaded, setEmployeeLoaded] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [employeeDeleteId, setEmployeeDeleteId] = useState();
  const [employeeDeleteFullname, setEmployeeDeleteFullname] = useState();

  const [editDialog, setEditDialog] = useState(false);

  const [dataPerPage, setDataPerPage] = useState(20);
  const [activePage, setActivePage] = useState();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [employeeCode, setEmployeeCode] = useState("");
  const [privateEmail, setPrivateEmail] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountProvider, setBankAccountProvider] = useState("");

  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [chapter, setChapter] = useState("");

  const [companyEmailPassword, setCompanyEmailPassword] = useState("");

  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    return loadActiveEmployee(1);
  }, []);

  const loadActiveEmployee = (page) => {
    setEmployeeLoaded(false);
    Axios.get(`/employee?data_per_page=${dataPerPage}&page=${page}`, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    }).then((response) => {
      setEmployees(response.data.data);
      setEmployeeLoaded(true);
    });
  };

  const handleDeleteEmployee = () => {};

  const handleEditDialogOpen = (employee) => {
    setFirstName(employee.user.first_name);
    setLastName(employee.user.last_name);
    setEmployeeCode(employee.employee_code);
    setPrivateEmail(employee.private_email);
    setBankAccountNumber(employee.bank_account_number);
    setBankAccountProvider(employee.bank_account_provider);
    setStatus(employee.status);
    setPhone(employee.phone);
    setRole(employee.role);
    setLevel(employee.level);
    setChapter(employee.chapter);
    setCompanyEmailPassword(employee.company_email_password);
    setEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setEditDialog(false);
  };

  const handleDeleteDialogOpen = (id, fullname) => {
    setEmployeeDeleteId(id);
    setEmployeeDeleteFullname(fullname);
    setDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handlePaginationClick = (event) => {
    setActivePage(parseInt(event.target.innerText));
    loadActiveEmployee(parseInt(event.target.innerText));
  };

  const handleDataPerPageChange = (event) => {
    setDataPerPage(event.target.value);
  };

  const handleDataPerPageSet = () => {
    setActivePage(1);
    loadActiveEmployee(1);
  };

  const handleBeforePaginationClick = () => {
    let activePageAfter = activePage - 1;
    setActivePage(activePageAfter);
    loadActiveEmployee(activePageAfter);
  };

  const handleNextPaginationClick = () => {
    let activePageAfter = activePage + 1;
    setActivePage(activePageAfter);
    loadActiveEmployee(activePageAfter);
  };

  const handleFirstPaginationClick = () => {
    setActivePage(1);
    loadActiveEmployee(1);
  };

  const handleLastPaginationClick = (page) => {
    setActivePage(page);
    loadActiveEmployee(page);
  };

  const handleBankAccountNumberChange = (event) => {
    setBankAccountNumber(event.target.value);
  };

  const handleBankAccountProviderChange = (event) => {
    setBankAccountProvider(event.target.value);
  };

  const handleChapterChange = (event) => {
    setChapter(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleEmployeeCodeChange = (event) => {
    setEmployeeCode(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  const handlePrivateEmailChange = (event) => {
    setPrivateEmail(event.target.value);
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(event.target.value)) setEmailError(true);
    else setEmailError(false);
  };

  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchIcon style={{ marginRight: 7 }} />
            <Typography variant="subtitle1" style={{ color: "grey" }}>
              Search for Employee
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} style={{ marginTop: -30 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="First Name"
                fullWidth
                margin="dense"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Last Name"
                fullWidth
                margin="dense"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                startIcon={<SearchIcon />}
                variant="outlined"
                style={{ marginTop: 10 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1">Data per page:</Typography>
              <TextField
                variant="outlined"
                size="small"
                type="number"
                onChange={handleDataPerPageChange}
                value={dataPerPage}
                style={{ marginLeft: 5, maxWidth: "75px" }}
              />
              <IconButton color="primary" onClick={handleDataPerPageSet}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <ButtonGroup size="small" variant="contained" color="primary">
              {employees.current_page !== 1 ? (
                <Button>
                  <FirstPageIcon onClick={handleFirstPaginationClick} />
                </Button>
              ) : null}
              {employees.links.map((link, index) => {
                let buttonLabel = link.label;
                if (typeof buttonLabel == "string") {
                  if (employees.current_page != 1)
                    if (buttonLabel.search("&laquo;") > -1) {
                      // buttonLabel = buttonLabel.split(" ")[1];
                      return (
                        <Button
                          key={`pagination-${index}`}
                          onClick={handleBeforePaginationClick}
                        >
                          <NavigateBeforeIcon />
                        </Button>
                      );
                    }
                  if (employees.current_page != employees.last_page)
                    if (buttonLabel.search("&raquo;") > -1) {
                      // buttonLabel = buttonLabel.split(" ")[0];
                      return (
                        <Button
                          key={`pagination-${index}`}
                          onClick={handleNextPaginationClick}
                        >
                          <NavigateNextIcon />
                        </Button>
                      );
                    }
                } else
                  return (
                    <Button
                      disabled={link.active}
                      onClick={handlePaginationClick}
                      key={`pagination-${index}`}
                    >
                      <span>{buttonLabel}</span>
                    </Button>
                  );
                return null;
              })}
              {employees.current_page != employees.last_page ? (
                <Button>
                  <LastPageIcon
                    onClick={() =>
                      handleLastPaginationClick(employees.last_page)
                    }
                  />
                </Button>
              ) : null}
            </ButtonGroup>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              marginTop: 5,
            }}
          >
            <Typography variant="caption">
              Showing page {employees.current_page} from total{" "}
              {employees.last_page} pages with {employees.per_page} data per
              page and listing data {employees.from} to {employees.to} from
              total {employees.total} data.
            </Typography>
          </div>
        </Grid>
      </Grid>
      <div style={{ marginTop: 10 }}></div>
      {employeeLoaded ? (
        employees.data.map((employee) => {
          return (
            <UserCard user={employee.user} key={employee.id}>
              <ButtonGroup color="primary">
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEditDialogOpen(employee)}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() =>
                    handleDeleteDialogOpen(
                      employee.id,
                      employee.user.first_name + " " + employee.user.last_name
                    )
                  }
                >
                  Delete
                </Button>
              </ButtonGroup>
            </UserCard>
          );
        })
      ) : (
        <LoadingData />
      )}
      <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Employee Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete employee <b>{employeeDeleteFullname}</b>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteEmployee} color="primary">
            Yes, I am Sure
          </Button>
          <Button onClick={handleDeleteDialogClose} color="primary" autoFocus>
            No, Nevermind.
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Employee Detail</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit the <b>{firstName + " " + lastName}</b>'s employee details,
            please change the information in the specified field below:
          </DialogContentText>
          <TextField
            label="Employee Code"
            variant="outlined"
            type="number"
            value={employeeCode}
            onChange={handleEmployeeCodeChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">loakarya-</InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            label="Private Email"
            value={privateEmail}
            style={{ marginTop: 15 }}
            onChange={handlePrivateEmailChange}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Company Email Password"
            style={{ marginTop: 15 }}
            value={companyEmailPassword}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Bank Account Number"
            type="number"
            value={bankAccountNumber}
            onChange={handleBankAccountNumberChange}
            fullWidth
            style={{ marginTop: 15 }}
          />
          <TextField
            variant="outlined"
            label="Bank Account Provider"
            value={bankAccountProvider}
            onChange={handleBankAccountProviderChange}
            fullWidth
            style={{ marginTop: 15 }}
          />

          <TextField
            type="number"
            label="Phone Number"
            variant="outlined"
            style={{ marginTop: 15 }}
            value={phone}
            onChange={handlePhoneChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+62</InputAdornment>
              ),
            }}
          />

          <FormControl
            variant="outlined"
            style={{ width: "100%", marginTop: 15 }}
          >
            <InputLabel htmlFor="status-in-loakarya">Status</InputLabel>
            <Select
              native
              value={status}
              onChange={handleStatusChange}
              label="Division"
              inputProps={{
                name: "status-in-loakarya",
                id: "status-in-loakarya",
              }}
              fullWidth
            >
              <option></option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            style={{ width: "100%", marginTop: 15 }}
          >
            <InputLabel htmlFor="level-in-loakarya">Level</InputLabel>
            <Select
              native
              value={level}
              onChange={handleLevelChange}
              label="Level"
              inputProps={{
                name: "level-in-loakarya",
                id: "level-in-loakarya",
              }}
              fullWidth
            >
              <option></option>
              <option value="C Level">C Level</option>
              <option value="VP">VP</option>
              <option value="Head">Head</option>
              <option value="Lead">Lead</option>
              <option value="Senior">Senior</option>
              <option value="Junior">Junior</option>
              <option value="Intern">Intern</option>
            </Select>
          </FormControl>

          <Grid container spacing={2} style={{ marginTop: 10 }}>
            <Grid item xs={12} md={4}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <InputLabel htmlFor="chapter-in-loakarya">Chapter</InputLabel>
                <Select
                  native
                  value={chapter}
                  onChange={handleChapterChange}
                  label="Chapter"
                  inputProps={{
                    name: "chapter-in-loakarya",
                    id: "chapter-in-loakarya",
                  }}
                  fullWidth
                >
                  <option></option>
                  <option value="CEO Office">CEO Office</option>
                  <option value="Marketing and Growth">
                    Marketing and Growth
                  </option>
                  <option value="Product and Operational">
                    Product and Operational
                  </option>
                  <option value="Technology">Technology</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                value={role}
                onChange={handleRoleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditDialogClose} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
