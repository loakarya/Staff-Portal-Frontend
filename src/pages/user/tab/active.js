import React, { useState, useEffect } from "react";

import LoadingData from "../../../components/loading";
import UserCard from "../../../components/usercard";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";

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

export default function ActiveUser(props) {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [users, setUsers] = useState({ links: [] });
  const [userLoaded, setUserLoaded] = useState(false);

  const [dataPerPage, setDataPerPage] = useState(20);
  const [activePage, setActivePage] = useState();

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userDeleteId, setUserDeleteId] = useState();
  const [userDeleteFullname, setUserDeleteFullname] = useState();

  const [editDialog, setEditDialog] = useState(false);

  const [userEditId, setUserEditId] = useState();

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [country, setCountry] = useState();
  const [province, setProvince] = useState();
  const [city, setCity] = useState();
  const [zipCode, setZipCode] = useState();
  const [address, setAddress] = useState();
  const [email, setEmail] = useState();
  const [acl, setAcl] = useState();

  useEffect(() => {
    return loadActiveUser(1);
  }, []);

  const loadActiveUser = (page) => {
    setUserLoaded(false);
    Axios.get(`/user/man?data_per_page=${dataPerPage}&page=${page}`, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    }).then((response) => {
      setUsers(response.data.data);
      setUserLoaded(true);
    });
  };

  const handlePaginationClick = (event) => {
    setActivePage(parseInt(event.target.innerText));
    loadActiveUser(parseInt(event.target.innerText));
  };

  const handleDataPerPageChange = (event) => {
    setDataPerPage(event.target.value);
  };

  const handleDataPerPageSet = () => {
    setActivePage(1);
    loadActiveUser(1);
  };

  const handleBeforePaginationClick = () => {
    let activePageAfter = activePage - 1;
    setActivePage(activePageAfter);
    loadActiveUser(activePageAfter);
  };

  const handleNextPaginationClick = () => {
    let activePageAfter = activePage + 1;
    setActivePage(activePageAfter);
    loadActiveUser(activePageAfter);
  };

  const handleFirstPaginationClick = () => {
    setActivePage(1);
    loadActiveUser(1);
  };

  const handleLastPaginationClick = (page) => {
    setActivePage(page);
    loadActiveUser(page);
  };

  const handleDeleteDialogOpen = (id, fullname) => {
    // console.table({
    //   id,
    //   fullname,
    // });
    setUserDeleteId(id);
    setUserDeleteFullname(fullname);
    setDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteUser = () => {
    Axios.delete(`/user/man/${userDeleteId}`, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then(() => {
        loadActiveUser();
      })
      .finally(handleDeleteDialogClose);
  };

  const handleEditDialogOpen = (user) => {
    setUserEditId(user.id);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setCountry(user.country);
    setProvince(user.province);
    setCity(user.city);
    setZipCode(user.zip_code);
    setAddress(user.address);
    setEmail(user.email);
    setAcl(user.acl);
    setEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setEditDialog(false);
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchIcon style={{ marginRight: 7 }} />
            <Typography variant="subtitle1" style={{ color: "grey" }}>
              Search for User
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
              {users.current_page !== 1 ? (
                <Button>
                  <FirstPageIcon onClick={handleFirstPaginationClick} />
                </Button>
              ) : null}
              {users.links.map((link, index) => {
                let buttonLabel = link.label;
                if (typeof buttonLabel == "string") {
                  if (users.current_page != 1)
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
                  if (users.current_page != users.last_page)
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
              {users.current_page != users.last_page ? (
                <Button>
                  <LastPageIcon
                    onClick={() => handleLastPaginationClick(users.last_page)}
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
              Showing page {users.current_page} from total {users.last_page}{" "}
              pages with {users.per_page} data per page and listing data{" "}
              {users.from} to {users.to} from total {users.total} data.
            </Typography>
          </div>
        </Grid>
      </Grid>
      <div style={{ marginTop: 10 }}></div>
      {userLoaded ? (
        users.data.map((user) => {
          return (
            <UserCard user={user} key={user.id}>
              <ButtonGroup color="primary">
                <Button startIcon={<VisibilityIcon />}>View</Button>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEditDialogOpen(user)}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() =>
                    handleDeleteDialogOpen(
                      user.id,
                      user.first_name + " " + user.last_name
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
        <DialogTitle>User Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete user <b>{userDeleteFullname}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUser} color="primary">
            Yes, I am Sure
          </Button>
          <Button onClick={handleDeleteDialogClose} color="primary" autoFocus>
            No, Nevermind.
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit User Detail</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit the <b>{firstName + " " + lastName}</b>'s user details,
            please change the information in the specified field below:
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                margin="dense"
                label="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            label="Access Control Level"
            defaultValue={aclDescription(acl)}
            fullWidth
            disabled
          />
          <TextField
            margin="dense"
            label="Email Address"
            value={email}
            onChange={handleEmailChange}
            fullWidth
          />
          <Typography variant="caption" style={{ color: "grey", marginTop: 5 }}>
            Email Verified At
          </Typography>
          <br />
          <Button color="primary" variant="outlined">
            Calendar
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Country"
                value={country}
                onChange={handleCountryChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="City"
                value={city}
                onChange={handleCityChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Province"
                value={province}
                onChange={handleProvinceChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Zip Code"
                value={zipCode}
                onChange={handleZipCodeChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            label="Address"
            value={address}
            onChange={handleAddressChange}
            multiline
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

function aclDescription(aclIndex) {
  switch (aclIndex) {
    case 0:
      return "Regular";

    case 1:
      return "Administrator";

    case 2:
      return "Master";

    default:
      return "Unknown";
  }
}
