import React, { useState, useEffect } from "react";

import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import AccountCard from "../../components/accountcard";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import RefreshIcon from "@material-ui/icons/Refresh";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import LinearProgress from "@material-ui/core/LinearProgress";

import Axios from "axios";
import { useCookies } from "react-cookie";

export default function IndexCompanyAccount(props) {
  const [cookies, setCookies, removeCookies] = useCookies();

  const [accounts, setAccounts] = useState({ links: [] });
  const [accountsLoaded, setAccountsLoaded] = useState(false);

  const [dataPerPage, setDataPerPage] = useState(20);
  const [activePage, setActivePage] = useState();

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(false);
  const [accountDeleteId, setAccountDeleteId] = useState();
  const [accountDeleteName, setAccountDeleteName] = useState();

  const [editDialog, setEditDialog] = useState(false);
  const [accountEditId, setAccountEditId] = useState();
  const [editProgress, setEditProgress] = useState(false);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = (page) => {
    setAccountsLoaded(false);
    Axios.get(`/account?data_per_page=${dataPerPage}&page=${page}`, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then((response) => {
        setAccounts(response.data.data);
      })
      .finally(() => setAccountsLoaded(true));
  };

  const handleDeleteAccount = () => {
    setDeleteProgress(true);
    Axios.delete(`/account/${accountDeleteId}`, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then(() => {
        loadAccount();
      })
      .finally(() => {
        setDeleteProgress(false);
        handleDeleteDialogClose();
      });
  };

  const handleDeleteDialogOpen = (id, name) => {
    setAccountDeleteId(id);
    setAccountDeleteName(name);
    setDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleEditDialogOpen = (user) => {
    // setUserEditId(user.id);
    // setFirstName(user.first_name);
    // setLastName(user.last_name);
    // setCountry(user.country);
    // setProvince(user.province);
    // setCity(user.city);
    // setZipCode(user.zip_code);
    // setAddress(user.address);
    // setEmail(user.email);
    // setAcl(user.acl);
    setEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setEditDialog(false);
  };

  const handlePaginationClick = (event) => {
    setActivePage(parseInt(event.target.innerText));
    loadAccount(parseInt(event.target.innerText));
  };

  const handleDataPerPageChange = (event) => {
    setDataPerPage(event.target.value);
  };

  const handleDataPerPageSet = () => {
    setActivePage(1);
    loadAccount(1);
  };

  const handleBeforePaginationClick = () => {
    let activePageAfter = activePage - 1;
    setActivePage(activePageAfter);
    loadAccount(activePageAfter);
  };

  const handleNextPaginationClick = () => {
    let activePageAfter = activePage + 1;
    setActivePage(activePageAfter);
    loadAccount(activePageAfter);
  };

  const handleFirstPaginationClick = () => {
    setActivePage(1);
    loadAccount(1);
  };

  const handleLastPaginationClick = (page) => {
    setActivePage(page);
    loadAccount(page);
  };

  return (
    <React.Fragment>
      <MiniDrawer title="Company Account Management" master={props.master}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchIcon style={{ marginRight: 7 }} />
              <Typography variant="subtitle1" style={{ color: "grey" }}>
                Search for Account
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} style={{ marginTop: -30 }}>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Title"
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
                {accounts.current_page !== 1 ? (
                  <Button>
                    <FirstPageIcon onClick={handleFirstPaginationClick} />
                  </Button>
                ) : null}
                {accounts.links.map((link, index) => {
                  let buttonLabel = link.label;
                  if (typeof buttonLabel == "string") {
                    if (accounts.current_page !== 1)
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
                    if (accounts.current_page !== accounts.last_page)
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
                })}
                {accounts.current_page !== accounts.last_page ? (
                  <Button>
                    <LastPageIcon
                      onClick={() =>
                        handleLastPaginationClick(accounts.last_page)
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
                Showing page {accounts.current_page} from total{" "}
                {accounts.last_page} pages with {accounts.per_page} data per
                page and listing data {accounts.from} to {accounts.to} from
                total {accounts.total} data.
              </Typography>
            </div>
          </Grid>
        </Grid>
        <div style={{ marginTop: 10 }}></div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: 12 }}
          startIcon={<AddIcon />}
        >
          Account
        </Button>
        {accountsLoaded ? (
          accounts.data.map((account) => {
            return (
              <AccountCard account={account} key={account.id}>
                <ButtonGroup color="primary">
                  <Button startIcon={<VisibilityIcon />}>View</Button>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEditDialogOpen(account)}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      handleDeleteDialogOpen(account.id, account.name)
                    }
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </AccountCard>
            );
          })
        ) : (
          <LoadingData />
        )}
      </MiniDrawer>
      <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Account Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete the account <b>{accountDeleteName}</b>?
            This action is irreversible. Make sure you aware that you want to do
            this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAccount} color="primary">
            Yes, I am Sure
          </Button>
          <Button onClick={handleDeleteDialogClose} color="primary" autoFocus>
            No, Nevermind.
          </Button>
        </DialogActions>
        {deleteProgress ? <LinearProgress /> : null}
      </Dialog>
      <Dialog open={editDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Account Detail</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit the <b></b> account details, please change the information
            in the specified field below:
          </DialogContentText>
          <TextField margin="dense" label="Name" fullWidth required />
          <TextField margin="dense" label="Description" fullWidth />
          <TextField margin="dense" label="Email" fullWidth required />
          <TextField margin="dense" label="Username" fullWidth />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            required
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
        {editProgress ? <LinearProgress /> : null}
      </Dialog>
    </React.Fragment>
  );
}
