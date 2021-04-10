import React, { useState, useEffect } from "react";

import LoadingData from "../../components/loading";

import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import DeleteIcon from "@material-ui/icons/Delete";
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

import { Link as RouterLink } from "react-router-dom";
import Axios from "axios";
import { useCookies } from "react-cookie";

const useStyles = makeStyles({
  paper: {
    paddingTop: 6,
    paddingLeft: 12,
    paddingBottom: 6,
    paddingRight: 12,
  },
});

export default function ArticleIndexSubpage(props) {
  const classes = useStyles();

  const [cookies, setCookies, removeCookies] = useCookies();

  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const [articles, setArticles] = useState({ links: [] });
  const [articlesLoaded, setArticlesLoaded] = useState(false);

  const [articleDeleteDialog, setArticleDeleteDialog] = useState(false);
  const [articleDeleteCandidate, setArticleDeleteCandidate] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const [loadingAction, setLoadingAction] = useState(false);

  const [dataPerPage, setDataPerPage] = useState(20);
  const [activePage, setActivePage] = useState();

  useEffect(() => {
    loadArticle();
    loadCategory();
  }, []);

  const loadArticle = (page) => {
    setArticlesLoaded(false);
    let articleEndpoint = `/article/user?data_per_page=${dataPerPage}&page=${page}`;
    if (props.all)
      articleEndpoint = `/article?data_per_page=${dataPerPage}&page=${page}`;
    Axios.get(articleEndpoint, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    }).then((response) => {
      setArticles(response.data.data);
      setArticlesLoaded(true);
    });
  };

  const loadCategory = () => {
    Axios.get("/article/category").then((response) => {
      setCategories(response.data);
      setCategoriesLoaded(true);
    });
  };

  const handleArticleDeleteOpen = (article) => {
    setArticleDeleteCandidate(article);
    setArticleDeleteDialog(true);
  };

  const handleDeleteArticle = () => {
    setLoadingAction(true);
    Axios.delete("/article/" + articleDeleteCandidate.id, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then(() => {
        handleSnackbarOpen("The article has been deleted.");
        loadArticle();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to delete the article.");
        console.log(error.response);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  const handleDialogClose = () => {
    setArticleDeleteDialog(false);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePaginationClick = (event) => {
    setActivePage(parseInt(event.target.innerText));
    loadArticle(parseInt(event.target.innerText));
  };

  const handleDataPerPageChange = (event) => {
    setDataPerPage(event.target.value);
  };

  const handleDataPerPageSet = () => {
    setActivePage(1);
    loadArticle(1);
  };

  const handleBeforePaginationClick = () => {
    let activePageAfter = activePage - 1;
    setActivePage(activePageAfter);
    loadArticle(activePageAfter);
  };

  const handleNextPaginationClick = () => {
    let activePageAfter = activePage + 1;
    setActivePage(activePageAfter);
    loadArticle(activePageAfter);
  };

  const handleFirstPaginationClick = () => {
    setActivePage(1);
    loadArticle(1);
  };

  const handleLastPaginationClick = (page) => {
    setActivePage(page);
    loadArticle(page);
  };

  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchIcon style={{ marginRight: 7 }} />
            <Typography variant="subtitle1" style={{ color: "grey" }}>
              Search for Article
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
              {articles.current_page !== 1 ? (
                <Button>
                  <FirstPageIcon onClick={handleFirstPaginationClick} />
                </Button>
              ) : null}
              {articles.links.map((link, index) => {
                let buttonLabel = link.label;
                if (typeof buttonLabel == "string") {
                  if (articles.current_page !== 1)
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
                  if (articles.current_page !== articles.last_page)
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
              {articles.current_page !== articles.last_page ? (
                <Button>
                  <LastPageIcon
                    onClick={() =>
                      handleLastPaginationClick(articles.last_page)
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
              Showing page {articles.current_page} from total{" "}
              {articles.last_page} pages with {articles.per_page} data per page
              and listing data {articles.from} to {articles.to} from total{" "}
              {articles.total} data.
            </Typography>
          </div>
        </Grid>
      </Grid>
      <div style={{ marginTop: 10 }}></div>
      {articlesLoaded && categoriesLoaded ? (
        articles.data.map((article) => {
          let category = "Uncategorized";
          categories.find((cv) => {
            if (article.category == cv.id) return (category = cv.name);
            return null;
          });
          return (
            <Paper
              className={classes.paper}
              key={article.id}
              style={{ marginBottom: 12 }}
            >
              <Grid container spacing={1}>
                <Grid item>
                  <img
                    src={`${process.env.REACT_APP_IMAGE_URL}/article/${article.thumbnail_url}`}
                    style={{ maxWidth: 75, marginTop: 6, marginRight: 10 }}
                    alt="Article thumbnail."
                  />
                </Grid>
                <Grid item xs>
                  <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                      <Link
                        component={RouterLink}
                        to={"/article/" + article.id}
                      >
                        <Typography variant="h6">{article.title}</Typography>
                      </Link>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption">12/03/2020</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={11}>
                          <Typography variant="body2">
                            <b>{category}</b> &bull; {article.subtitle}
                          </Typography>
                          <Typography variant="caption">
                            {article.content
                              .replace(
                                /<[^>]*>|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g,
                                " "
                              )
                              .substring(0, 197)}
                            ...
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "flex-end",
                              marginLeft: 10,
                            }}
                          >
                            <IconButton
                              color="secondary"
                              onClick={() => handleArticleDeleteOpen(article)}
                            >
                              <DeleteIcon style={{ color: "#c2185b" }} />
                            </IconButton>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          );
        })
      ) : (
        <LoadingData />
      )}

      <Dialog open={articleDeleteDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Article Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete the article{" "}
            <b>{articleDeleteCandidate.title}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteArticle} color="primary" autoFocus>
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
    </React.Fragment>
  );
}
