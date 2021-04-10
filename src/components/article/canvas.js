import React, { useState, useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Typography, Button, Grid, TextField, Paper } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

import CloseIcon from "@material-ui/icons/Close";
import PublishIcon from "@material-ui/icons/Publish";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import SaveIcon from "@material-ui/icons/Save";

import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import Axios from "axios";

export default function Article(props) {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [redirect, setRedirect] = useState();

  const [category, setCategory] = useState();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [thumbnail, setThumbnail] = useState();
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");

  const [categories, setCategories] = useState([]);

  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [articleSaving, setArticleSaving] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  useEffect(() => {
    if (props.article) {
      setTitle(props.article.title);
      setSubtitle(props.article.subtitle);
      setThumbnail(props.article.thumbnail_url);
      setContent(props.article.content);
      setSlug(props.article.slug);
      setCategory(props.article.category);
    }

    Axios.get("/article/category").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handlePublishArticle = () => {
    if (!title || !subtitle || !content || !thumbnail || !category) {
      setTimeout(
        () => handleSnackbarOpen("Please fill all the required section!"),
        500
      );
    } else {
      setArticleSaving(true);
      Axios.put(
        "/article",
        {
          title,
          subtitle,
          category,
          content,
          thumbnail_url: thumbnail,
          slug: title
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .replace(/[ ]/g, "-"),
        },
        {
          headers: {
            Authorization: "Bearer " + cookies.access_token,
          },
        }
      )
        .then(() => {
          handleSnackbarOpen(
            "The article has been saved, redirecting to menu..."
          );
          setTimeout(() => setRedirect("/article"), 2000);
        })
        .catch((error) => {
          console.log(error.response);
          handleSnackbarOpen("Failed to create article.");
        })
        .finally(() => setArticleSaving(false));
    }
  };

  const handleUpdateArticle = () => {
    if (!title || !subtitle || !content || !thumbnail || !category) {
      setTimeout(
        () => handleSnackbarOpen("Please fill all the required section!"),
        500
      );
    } else {
      setArticleSaving(true);
      Axios.patch(
        `/article/${props.article.id}`,
        {
          title,
          subtitle,
          category,
          content,
          thumbnail_url: thumbnail,
          slug: title
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .replace(/[ ]/g, "-"),
        },
        {
          headers: {
            Authorization: "Bearer " + cookies.access_token,
          },
        }
      )
        .then(() => {
          handleSnackbarOpen(
            "The article has been updated, redirecting to menu..."
          );
          setTimeout(() => setRedirect("/article"), 2000);
        })
        .catch((error) => {
          console.log(error.response);
          handleSnackbarOpen("Failed to update article.");
        })
        .finally(() => setArticleSaving(false));
    }
  };

  const uploadThumbnail = (event) => {
    // console.log(event.target.files[0]);
    setThumbnailUploading(true);

    let form = new FormData();
    form.append("upload", event.target.files[0]);

    Axios.post("/article/image", form, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then((response) => {
        setThumbnail(response.data.url.split("/").slice(-1).pop());
        handleSnackbarOpen("File uploaded.");
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("File upload failed, please refresh this page!");
      })
      .finally(() => setThumbnailUploading(false));
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setSlug(
      event.target.value
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/[ ]/g, "-")
    );
  };

  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TextField
            label="Title"
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleTitleChange}
            value={title}
          />
          <TextField
            label="Subtitle"
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleSubtitleChange}
            value={subtitle}
            margin="normal"
          />
          <CKEditor
            editor={ClassicEditor}
            config={{
              simpleUpload: {
                uploadUrl: `${process.env.REACT_APP_API_URL}/article/image`,
                headers: {
                  Authorization: "Bearer " + cookies.access_token,
                },
              },
            }}
            data={content}
            // data="<p>Hello from CKEditor 5!</p>"
            // onReady={ editor => {
            //     // You can store the "editor" and use when it is needed.
            //     console.log( 'Editor is ready to use!', editor );
            // } }
            onChange={(event, editor) => {
              handleContentChange(editor.getData());
              // const data = editor.getData();
              // console.log({ event, editor, data });
            }}
            // onBlur={(event, editor) => {
            //   console.log("Blur.", editor);
            // }}
            // onFocus={(event, editor) => {
            //   console.log("Focus.", editor);
            // }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            style={{
              padding: 12,
            }}
          >
            <Typography variant="h6" align="center">
              Article Attributes
            </Typography>
            <Typography
              variant="subtitle2"
              style={{
                marginTop: 10,
              }}
            >
              <b> Thumbnail Picture </b>
            </Typography>
            {thumbnail ? (
              <img
                src={`${process.env.REACT_APP_IMAGE_URL}/article/${thumbnail}`}
                width="100%"
              />
            ) : null}
            <Grid container spacing={1}>
              <Grid item>
                <input
                  disabled={thumbnailUploading}
                  type="file"
                  onChange={uploadThumbnail}
                  accept="image/png, image/jpeg"
                  id="upload-thumbnail"
                  style={{
                    display: "none",
                  }}
                />
                <label htmlFor="upload-thumbnail">
                  <Button
                    disabled={thumbnailUploading}
                    color="primary"
                    variant="contained"
                    startIcon={<PhotoCameraIcon />}
                    size="small"
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </Grid>
              {thumbnailUploading ? (
                <Grid item>
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      alignItems: "flex-end",
                    }}
                  >
                    <CircularProgress size={20} />{" "}
                  </div>
                </Grid>
              ) : null}
            </Grid>
            <Typography
              variant="subtitle2"
              style={{
                marginTop: 10,
              }}
            >
              <b> Category </b>
            </Typography>
            <form>
              {categories.map((cat) => {
                let radioChecked = false;
                if (cat.id == category) radioChecked = true;

                return (
                  <React.Fragment key={cat.id}>
                    <input
                      type="radio"
                      id={cat.id}
                      name="category"
                      value={cat.id}
                      onClick={handleCategoryChange}
                      defaultChecked={radioChecked}
                    />
                    <label htmlFor={cat.id}> {cat.name} </label>
                    <br />
                  </React.Fragment>
                );
              })}
            </form>
            {/* <Typography variant="subtitle2" style={classes.mt}>
                <b>Slug</b>
              </Typography> */}
            <TextField
              disabled
              label="Slug"
              variant="outlined"
              size="small"
              margin="normal"
              fullWidth
              value={slug}
            />
            <Grid container justify="flex-end">
              <Grid item>
                {props.edit ? (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateArticle}
                    style={{
                      marginTop: 10,
                    }}
                    endIcon={<SaveIcon />}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handlePublishArticle}
                    style={{
                      marginTop: 10,
                    }}
                    endIcon={<PublishIcon />}
                  >
                    Publish
                  </Button>
                )}
              </Grid>
            </Grid>
            {articleSaving ? (
              <LinearProgress
                style={{
                  marginTop: 10,
                }}
              />
            ) : null}
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
            </IconButton>{" "}
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}
