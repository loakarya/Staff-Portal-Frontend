import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import ArticleIndexSubpage from "./list";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";

import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Axios from "axios";
import { useCookies } from "react-cookie";
import CircularProgress from "@material-ui/core/CircularProgress";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box pt={1}>{children}</Box>}
    </div>
  );
}
export default function ArticleIndex(props) {
  const [cookies, setCookies, removeCookies] = useCookies();

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const [categories, setCategories] = useState([]);

  const [categoryDeleteDialog, setCategoryDeleteDialog] = useState(false);
  const [categoryDeleteCandidate, setCategoryDeleteCandidate] = useState([]);
  const [categoryEditDialog, setCategoryEditDialog] = useState(false);
  const [categoryEditCandidate, setCategoryEditCandidate] = useState([]);
  const [categoryNewNameCandidate, setCategoryNewNameCandidate] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [categoryAddDialog, setCategoryAddDialog] = useState(false);
  const [categoryAddCandidate, setCategoryAddCandidate] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDialogClose = () => {
    setCategoryDeleteDialog(false);
    setCategoryAddDialog(false);
    setCategoryEditDialog(false);
  };

  const handleCategoryDeleteOpen = (category) => {
    setCategoryDeleteCandidate(category);
    setCategoryDeleteDialog(true);
  };

  const handleCategoryEditOpen = (category) => {
    setCategoryEditCandidate(category);
    setCategoryNewNameCandidate(category.name);
    setCategoryEditDialog(true);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCategoryAddChange = (event) => {
    setCategoryAddCandidate(event.target.value);
  };

  const handleCategoryEditChange = (event) => {
    setCategoryNewNameCandidate(event.target.value);
  };

  const handleCategoryAdd = () => {
    setCategoryAddDialog(true);
  };

  const handleDeleteCategory = () => {
    setLoadingAction(true);
    Axios.delete(`/article/category/${categoryDeleteCandidate.id}`, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then(() => {
        handleSnackbarOpen("The article category has been deleted.");
        refreshCategory();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to delete the article category.");
        console.log(error.response);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  const handleAddCategory = () => {
    setLoadingAction(true);
    Axios.put(
      "/article/category",
      {
        name: categoryAddCandidate,
      },
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    )
      .then(() => {
        handleSnackbarOpen("The new article category has been added.");
        refreshCategory();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to add the new article category.");
        console.log(error.response.data);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  const handleEditCategory = () => {
    setLoadingAction(true);
    Axios.patch(
      `/article/category/${categoryEditCandidate.id}`,
      {
        name: categoryNewNameCandidate,
      },
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    )
      .then(() => {
        handleSnackbarOpen("The article category has been edited.");
        refreshCategory();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to edit the new article category.");
        console.log(error.response.data);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  useEffect(() => {
    refreshCategory();
  }, []);

  const refreshCategory = () => {
    Axios.get("/article/category").then((response) => {
      setCategories(response.data);
      setCategoriesLoaded(true);
    });
  };

  return (
    <MiniDrawer title="Article Index" master={props.master}>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: 12 }}
        component={RouterLink}
        to="/article/create"
        startIcon={<AddIcon />}
      >
        Article
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          {props.master ? (
            <React.Fragment>
              <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Owned" />
                  <Tab label="All" />
                </Tabs>
              </AppBar>
              <TabPanel value={tabValue} index={0}>
                <ArticleIndexSubpage />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <ArticleIndexSubpage all />
              </TabPanel>
            </React.Fragment>
          ) : (
            <ArticleIndexSubpage />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper style={{ padding: 6, marginBottom: 12 }}>
            <Typography variant="h6" align="center">
              Category
            </Typography>
            {!categoriesLoaded ? (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 25,
                  marginBottom: 20,
                }}
              >
                <CircularProgress size={30} />
              </div>
            ) : null}
            <List>
              {categories.map((category) => {
                return (
                  <React.Fragment key={category.id}>
                    <ListItem
                      button
                      onClick={() => handleCategoryEditOpen(category)}
                    >
                      <ListItemText primary={category.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="secondary"
                          onClick={() => handleCategoryDeleteOpen(category)}
                        >
                          <DeleteIcon style={{ color: "#c2185b" }} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
            {categoriesLoaded ? (
              <Grid container justify="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginBottom: 12 }}
                  onClick={handleCategoryAdd}
                  endIcon={<AddIcon />}
                >
                  Category
                </Button>
              </Grid>
            ) : null}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={categoryDeleteDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Article Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete the category{" "}
            <b>{categoryDeleteCandidate.name}</b>? The articles related to this
            category will be set to uncategorized. You'll need to update the
            category in each article.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="primary" autoFocus>
            I'm Sure
          </Button>
        </DialogActions>
      </Dialog>
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
      <Dialog open={categoryAddDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Add a New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To insert a new article category, please fill the category name on
            the section below and then click the <b>Add</b> button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            onChange={handleCategoryAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={categoryEditDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are going to edit <b>{categoryEditCandidate.name}</b> article
            category. To continue, please fill the category name on the section
            below and then click the <b>Edit</b> button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Category Name"
            value={categoryNewNameCandidate}
            fullWidth
            onChange={handleCategoryEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditCategory} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </MiniDrawer>
  );
}
