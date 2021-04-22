import React, { useState, useEffect } from "react";
import clsx from "clsx";
import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import TextField from "@material-ui/core/TextField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import AddIcon from "@material-ui/icons/Add";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import InputAdornment from "@material-ui/core/InputAdornment";

import { useCookies } from "react-cookie";
import Axios from "axios";

import uploadIcon from "../../assets/cloud-uploading-icon.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function IndexProduct(props) {
  const [cookies, setCookies, removeCookies] = useCookies();

  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStateEdit, setDialogStateEdit] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [productDeletionDialog, setProductDeletionDialog] = useState(false);
  const [productDeletionId, setProductDeletionId] = useState();
  const [productDeletionName, setProductDeletionName] = useState();

  const [productId, setProductId] = useState(0);
  const [productName, setProductName] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [productMaterial, setProductMaterial] = useState("");
  const [productThumbnailPicture, setProductThumbnailPicture] = useState("");
  const [productShowcasePicture, setProductShowcasePicture] = useState([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [productPrice, setProductPrice] = useState("");
  const [productDiscount, setProductDiscount] = useState("");
  const [productCategory, setProductCategory] = useState("0");
  const [productTokopediasLink, setProductTokopediasLink] = useState("");
  const [productBukalapaksLink, setProductBukalapaksLink] = useState("");
  const [productShopeesLink, setProductShopeesLink] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const [loadingAction, setLoadingAction] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState(false);
  const [showcase1Progress, setShowcase1Progress] = useState(false);
  const [showcase2Progress, setShowcase2Progress] = useState(false);
  const [showcase3Progress, setShowcase3Progress] = useState(false);
  const [showcase4Progress, setShowcase4Progress] = useState(false);
  const [showcase5Progress, setShowcase5Progress] = useState(false);

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleProductDetailChange = (event) => {
    setProductDetail(event.target.value);
  };

  const handleProductMaterialChange = (event) => {
    setProductMaterial(event.target.value);
  };

  const handleProductPriceChange = (event) => {
    setProductPrice(event.target.value);
  };

  const handleProductDiscountChange = (event) => {
    setProductDiscount(event.target.value);
  };

  const handleProductCategoryChange = (event) => {
    setProductCategory(event.target.value);
  };

  const handleProductTokopediasLinkChange = (event) => {
    setProductTokopediasLink(event.target.value);
  };

  const handleProductBukalapaksLinkChange = (event) => {
    setProductBukalapaksLink(event.target.value);
  };

  const handleProductShopeesLinkChange = (event) => {
    setProductShopeesLink(event.target.value);
  };

  const resetProductState = () => {
    setProductName("");
    setProductDetail("");
    setProductMaterial("");
    setProductThumbnailPicture("");
    setProductShowcasePicture([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    setProductPrice("");
    setProductDiscount("");
    setProductCategory("0");
    setProductTokopediasLink("");
    setProductBukalapaksLink("");
    setProductShopeesLink("");
    setDialogStateEdit(false);
  };

  const handleAddNewProductButtonSave = () => {
    if (!validateFilledField()) return;

    setDialogLoading(true);
    Axios.put(
      "/product",
      {
        title: productName,
        slug: productName
          .toLowerCase()
          .replace(/[^a-zA-Z ]/g, "")
          .replace(/[ ]/g, "-"),
        detail: productDetail,
        material: productMaterial,
        thumbnail_url: productThumbnailPicture,
        picture_url_1: productShowcasePicture[0],
        picture_url_2: productShowcasePicture[1],
        picture_url_3: productShowcasePicture[2],
        picture_url_4: productShowcasePicture[3],
        picture_url_5: productShowcasePicture[4],
        price: productPrice,
        discount: productDiscount,
        category: parseInt(productCategory),
        tokopedia_order_link: productTokopediasLink,
        bukalapak_order_link: productBukalapaksLink,
        shopee_order_link: productShopeesLink,
      },
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    )
      .then(() => {
        handleDialogClose();
        resetProductState();
        handleSnackbarOpen(
          "The product has been saved, reloading the index..."
        );
        setTimeout(loadProducts, 2000);
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("Failed to save product");
      })
      .finally(() => {
        setDialogLoading(false);
      });
  };

  const handleEditProductButtonSave = () => {
    if (!validateFilledField()) return;

    setDialogLoading(true);
    Axios.patch(
      `/product/${productId}`,
      {
        title: productName,
        slug: productName
          .toLowerCase()
          .replace(/[^a-zA-Z ]/g, "")
          .replace(/[ ]/g, "-"),
        detail: productDetail,
        material: productMaterial,
        thumbnail_url: productThumbnailPicture,
        picture_url_1: productShowcasePicture[0],
        picture_url_2: productShowcasePicture[1],
        picture_url_3: productShowcasePicture[2],
        picture_url_4: productShowcasePicture[3],
        picture_url_5: productShowcasePicture[4],
        price: productPrice,
        discount: productDiscount,
        category: parseInt(productCategory),
        tokopedia_order_link: productTokopediasLink,
        bukalapak_order_link: productBukalapaksLink,
        shopee_order_link: productShopeesLink,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      }
    )
      .then(() => {
        handleDialogClose();
        resetProductState();
        handleSnackbarOpen(
          "The product has been updated, reloading the index..."
        );
        setTimeout(loadProducts, 2000);
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("Failed to update product");
      })
      .finally(() => {
        setDialogLoading(false);
      });
  };

  const handleProductThumbnailUpload = (event) => {
    setThumbnailProgress(true);
    handleProductImageUpload(event);
  };

  const handleProductShowcase1Upload = (event) => {
    setShowcase1Progress(true);
    handleProductImageUpload(event);
  };

  const handleProductShowcase2Upload = (event) => {
    setShowcase2Progress(true);
    handleProductImageUpload(event);
  };

  const handleProductShowcase3Upload = (event) => {
    setShowcase3Progress(true);
    handleProductImageUpload(event);
  };

  const handleProductShowcase4Upload = (event) => {
    setShowcase4Progress(true);
    handleProductImageUpload(event);
  };

  const handleProductShowcase5Upload = (event) => {
    setShowcase5Progress(true);
    handleProductImageUpload(event);
  };

  const handleProductImageUpload = (event) => {
    // console.log(event.target.files[0]);
    let file = event.target.files[0];
    if (file.size / 1024 / 1024 > 2) {
      hideAllUploadButtonShowcase();
      handleSnackbarOpen("The file size is exceeding 2 MB");
      return;
    }

    setUploading(true);
    let form = new FormData();
    form.append("upload", file);

    Axios.post("/product/image", form, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then((response) => {
        handleSnackbarOpen("File uploaded.");

        if (!event.target.name) {
          // console.log("Url saved to state for product thumbnail");
          // console.log(response.data.url);
          setThumbnailProgress(true);
          setProductThumbnailPicture(response.data.url);
        } else {
          // console.log("Url saved to state for product showcase");
          let showcasePictureBuffer = productShowcasePicture;
          let showcasePictureIndex =
            parseInt(event.target.name.split("-")[1]) - 1;
          showcasePictureBuffer[showcasePictureIndex] = response.data.url;
          setProductShowcasePicture(showcasePictureBuffer);
          // console.log(showcasePictureBuffer);
        }
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("File upload failed, please reupload again!");
      })
      .finally(() => {
        setUploading(false);
        setThumbnailProgress(false);
        hideAllUploadButtonShowcase();
      });
  };

  const hideAllUploadButtonShowcase = () => {
    setShowcase1Progress(false);
    setShowcase2Progress(false);
    setShowcase3Progress(false);
    setShowcase4Progress(false);
    setShowcase5Progress(false);
  };

  const handleProductDeletionDialogOpen = (id, name) => {
    setProductDeletionId(id);
    setProductDeletionName(name);
    setProductDeletionDialog(true);
  };

  const handleProductDeletionDialogClose = () => {
    setProductDeletionDialog(false);
  };

  const handleProductDeletion = () => {
    setLoadingAction(true);
    Axios.delete("/product/" + productDeletionId, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then(() => {
        handleSnackbarOpen("The product has been deleted.");
        setTimeout(loadProducts, 2000);
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to delete the product.");
        console.log(error.response);
      })
      .finally(() => {
        handleProductDeletionDialogClose();
        setLoadingAction(false);
        setProductDeletionId(undefined);
        setProductDeletionName(undefined);
      });
  };

  const handleEditProductDialogOpen = (product) => {
    setProductId(product.id);
    setProductName(product.title);
    setProductDetail(product.detail);
    setProductMaterial(product.material);
    setProductThumbnailPicture(product.thumbnail_url);
    setProductShowcasePicture([
      product.picture_url_1,
      product.picture_url_2,
      product.picture_url_3,
      product.picture_url_4,
      product.picture_url_5,
    ]);
    setProductPrice(product.price);
    setProductDiscount(product.discount);
    setProductCategory(product.category.toString());
    setProductTokopediasLink(product.tokopedia_order_link);
    setProductBukalapaksLink(product.bukalapak_order_link);
    setProductShopeesLink(product.shopee_order_link);
    setDialogStateEdit(true);
    setDialogOpen(true);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProductsLoaded(false);
    Axios.get("/product").then((response) => {
      setProducts(response.data.data);
      setProductsLoaded(true);
    });
  };

  if (!productsLoaded)
    return (
      <MiniDrawer master={props.master}>
        <LoadingData />
      </MiniDrawer>
    );

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    resetProductState();
    setDialogOpen(true);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validateFilledField = () => {
    let error = [];

    if (!productName) {
      error.push("product name");
    }

    if (!productDetail) {
      error.push("product detail");
    }

    if (!productMaterial) {
      error.push("product material");
    }

    if (!productThumbnailPicture) {
      error.push("thumbnail picture");
    }

    if (!productShowcasePicture) {
      error.push("showcase picture");
    }

    if (!productPrice) {
      error.push("product price");
    }

    if (!productDiscount && productDiscount !== 0) {
      error.push("product discount");
    }

    if (!productCategory && productCategory !== 0) {
      error.push("product category");
    }

    if (error.length > 0) {
      let errorString = "";
      error.map((e, i) => {
        if (i + 1 != error.length) errorString += `${e}, `;
        else errorString += `${e}. `;
      });
      setTimeout(
        () =>
          handleSnackbarOpen(
            `Please fill all the required section! missing field: ${errorString}`
          ),
        500
      );
      return false;
    }
    return true;
  };

  return (
    <MiniDrawer title="Product Index" master={props.master}>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: 12 }}
        onClick={handleDialogOpen}
        startIcon={<AddIcon />}
      >
        Product
      </Button>
      <Grid container spacing={2}>
        {products.map((product) => {
          return (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card className={classes.root}>
                <CardActionArea
                  onClick={() => handleEditProductDialogOpen(product)}
                >
                  <CardMedia
                    className={classes.media}
                    image={product.thumbnail_url}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.title}
                    </Typography>
                    <Typography variant="subtitle2">
                      {product.category === 0
                        ? "Authentic Product"
                        : "Product on Demand"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      style={{ marginBottom: 12 }}
                    >
                      {product.detail.length < 100
                        ? product.detail
                        : product.detail.slice(0, 100) + "..."}
                    </Typography>
                    <Typography variant="caption">
                      Rp.{product.price.toLocaleString("id")}.00 (-
                      {product.discount}%)
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    color="primary"
                    onClick={() => {
                      return handleProductDeletionDialogOpen(
                        product.id,
                        product.title
                      );
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogStateEdit ? "Edit Product" : "Add a New Product"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogStateEdit
              ? "To edit the product, please change the desired section below and then click the update product button."
              : "To add a new product, please fill in the form below correctly and then click the add product button."}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Product Name"
            type="text"
            onChange={handleProductNameChange}
            value={productName}
            fullWidth
          />
          <TextField
            required
            margin="dense"
            label="Product Detail"
            onChange={handleProductDetailChange}
            value={productDetail}
            type="text"
            multiline
            rows={10}
            fullWidth
          />
          <TextField
            required
            margin="dense"
            label="Product Material"
            onChange={handleProductMaterialChange}
            value={productMaterial}
            type="text"
            fullWidth
          />
          <Typography variant="subtitle2" style={{ marginTop: 20 }}>
            Product Thumbnail Picture * <b>(Size limit on each file is 2 MB)</b>
          </Typography>
          {productThumbnailPicture ? (
            <img src={productThumbnailPicture} width="100%" />
          ) : null}
          <Grid container spacing={1}>
            <Grid item>
              <input
                disabled={uploading}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleProductThumbnailUpload}
                id="upload-thumbnail"
                style={{ display: "none" }}
              />
              <label htmlFor="upload-thumbnail">
                <Button
                  disabled={uploading}
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload
                </Button>
              </label>
            </Grid>
            {thumbnailProgress ? (
              <Grid item>
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    alignItems: "flex-end",
                  }}
                >
                  <CircularProgress size={20} />
                </div>
              </Grid>
            ) : null}
          </Grid>

          <Typography variant="subtitle2" style={{ marginTop: 20 }}>
            Product Showcase Pictures * <b>(Size limit on each file is 2 MB)</b>
          </Typography>
          <Grid container>
            <Grid item xs={4}>
              {productShowcasePicture[0] ? (
                <img src={productShowcasePicture[0]} width="90%" />
              ) : (
                <img src={uploadIcon} width="90%" />
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item>
                  <input
                    disabled={uploading}
                    type="file"
                    accept="image/png, image/jpeg"
                    name="showcase-1"
                    onChange={handleProductShowcase1Upload}
                    id={"upload-showcase-1"}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-showcase-1">
                    <Button
                      disabled={uploading}
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                    </Button>
                  </label>
                </Grid>
                {showcase1Progress ? (
                  <Grid item>
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      <CircularProgress size={20} />
                    </div>
                  </Grid>
                ) : null}
              </Grid>

              <Typography variant="subtitle1" color="secondary">
                *Required
              </Typography>
            </Grid>

            <Grid item xs={4}>
              {productShowcasePicture[1] ? (
                <img src={productShowcasePicture[1]} width="90%" />
              ) : (
                <img src={uploadIcon} width="90%" />
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item>
                  <input
                    disabled={uploading}
                    type="file"
                    accept="image/png, image/jpeg"
                    name="showcase-2"
                    onChange={handleProductShowcase2Upload}
                    id={"upload-showcase-2"}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-showcase-2">
                    <Button
                      disabled={uploading}
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                    </Button>
                  </label>
                </Grid>
                {showcase2Progress ? (
                  <Grid item>
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      <CircularProgress size={20} />
                    </div>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>

            <Grid item xs={4}>
              {productShowcasePicture[2] ? (
                <img src={productShowcasePicture[2]} width="90%" />
              ) : (
                <img src={uploadIcon} width="90%" />
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item>
                  <input
                    disabled={uploading}
                    type="file"
                    accept="image/png, image/jpeg"
                    name="showcase-3"
                    onChange={handleProductShowcase3Upload}
                    id={"upload-showcase-3"}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-showcase-3">
                    <Button
                      disabled={uploading}
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                    </Button>
                  </label>
                </Grid>
                {showcase3Progress ? (
                  <Grid item>
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      <CircularProgress size={20} />
                    </div>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>

            <Grid item xs={4}>
              {productShowcasePicture[3] ? (
                <img src={productShowcasePicture[3]} width="90%" />
              ) : (
                <img src={uploadIcon} width="90%" />
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item>
                  <input
                    disabled={uploading}
                    type="file"
                    accept="image/png, image/jpeg"
                    name="showcase-4"
                    onChange={handleProductShowcase4Upload}
                    id={"upload-showcase-4"}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-showcase-4">
                    <Button
                      disabled={uploading}
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                    </Button>
                  </label>
                </Grid>
                {showcase4Progress ? (
                  <Grid item>
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      <CircularProgress size={20} />
                    </div>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>

            <Grid item xs={4}>
              {productShowcasePicture[4] ? (
                <img src={productShowcasePicture[4]} width="90%" />
              ) : (
                <img src={uploadIcon} width="90%" />
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item>
                  <input
                    disabled={uploading}
                    type="file"
                    accept="image/png, image/jpeg"
                    name="showcase-5"
                    onChange={handleProductShowcase5Upload}
                    id={"upload-showcase-5"}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-showcase-5">
                    <Button
                      disabled={uploading}
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                    </Button>
                  </label>
                </Grid>
                {showcase5Progress ? (
                  <Grid item>
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      <CircularProgress size={20} />
                    </div>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>

          <TextField
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rp</InputAdornment>
              ),
            }}
            label="Price"
            type="text"
            onChange={handleProductPriceChange}
            value={productPrice}
            style={{ marginTop: 10 }}
            fullWidth
          />
          <TextField
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            label="Discount"
            type="text"
            onChange={handleProductDiscountChange}
            value={productDiscount}
            style={{ marginTop: 10 }}
            fullWidth
          />
          <FormControl style={{ marginTop: 20 }}>
            <FormLabel>
              <Typography variant="subtitle2">Product Category *</Typography>
            </FormLabel>
            <RadioGroup
              name="product-category"
              onChange={handleProductCategoryChange}
              value={productCategory}
            >
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="Authentic Product"
              />
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Product on Demand"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            margin="dense"
            label="Product Tokopedia's Link"
            type="text"
            onChange={handleProductTokopediasLinkChange}
            value={productTokopediasLink}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Product Bukalapak's Link"
            type="text"
            onChange={handleProductBukalapaksLinkChange}
            value={productBukalapaksLink}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Product Shopee's Link"
            type="text"
            onChange={handleProductShopeesLinkChange}
            value={productShopeesLink}
            fullWidth
          />
          {dialogLoading ? <LinearProgress style={{ marginTop: 5 }} /> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {dialogStateEdit ? (
            <Button onClick={handleEditProductButtonSave} color="primary">
              Update the Product
            </Button>
          ) : (
            <Button onClick={handleAddNewProductButtonSave} color="primary">
              Add a New Product
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
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
      <Dialog
        open={productDeletionDialog}
        onClose={handleProductDeletionDialogClose}
      >
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Product Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete product <b>{productDeletionName}</b>?
            <br />
            This action is <b>irreversible</b>. Make sure you aware want to do
            this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductDeletion} color="primary">
            Yes, i am sure
          </Button>
          <Button
            onClick={handleProductDeletionDialogClose}
            color="primary"
            autoFocus
          >
            No, nevermind
          </Button>
        </DialogActions>
      </Dialog>
    </MiniDrawer>
  );
}
