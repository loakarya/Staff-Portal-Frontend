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

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [privateEmail, setPrivateEmail] = useState("");
  const [companyEmailPassword, setCompanyEmailPassword] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountProvider, setBankAccountProvider] = useState("");
  const [division, setDivision] = useState("");
  const [title, setTitle] = useState("");

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
    setEmployeeNumber(employee.employee.employee_number);
    setPrivateEmail(employee.employee.private_email);
    setCompanyEmailPassword(employee.employee.company_email_password);
    setBankAccountNumber(employee.employee.bank_account_number);
    setBankAccountProvider(employee.employee.bank_account_provider);
    setDivision(employee.employee.division);
    setTitle(employee.employee.title);
    setFirstName(employee.employee.first_name);
    setLastName(employee.employee.last_name);
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

  const handleEmployeeNumberChange = (event) => {
    setEmployeeNumber(event.target.value);
  };
  const handlePrivateEmailChange = (event) => {
    setPrivateEmail(event.target.value);
  };
  const handleCompanyEmailPasswordChange = (event) => {
    setCompanyEmailPassword(event.target.value);
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
            <UserCard user={employee} key={employee.id}>
              <ButtonGroup color="primary">
                <Button startIcon={<VisibilityIcon />}>View</Button>
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
                      employee.first_name + " " + employee.last_name
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
            label="Employee Number"
            margin="dense"
            variant="outlined"
            type="number"
            value={employeeNumber}
            onChange={handleEmployeeNumberChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">loakarya-</InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Private Email"
            value={privateEmail}
            onChange={handlePrivateEmailChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Company Email Password"
            value={companyEmailPassword}
            onChange={handleCompanyEmailPasswordChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Bank Account Number"
            type="number"
            value={bankAccountNumber}
            onChange={handleBankAccountNumberChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Bank Account Provider"
            value={bankAccountProvider}
            onChange={handleBankAccountProviderChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Division"
            value={division}
            onChange={handleDivisionChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Title"
            value={title}
            onChange={handleTitleChange}
            fullWidth
          />
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
