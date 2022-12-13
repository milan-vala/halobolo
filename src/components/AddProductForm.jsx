import { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { addProductApi, updateProductApi } from "../API/products";
import * as Yup from "yup";

const AddProductForm = ({ isModalVisible, setIsModalVisible, formData }) => {
  const [loading, setLoading] = useState(false);

  const addProduct = async (payload) => {
    setLoading(true);
    try {
      const response = await addProductApi(payload);
      if (response?.success) alert(response?.message);
    } catch (error) {
      console.warn("Error: Error while adding product -", error);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      formik.resetForm();
    }
  };

  const updateProduct = async (id, payload) => {
    setLoading(true);
    try {
      const imageArray = payload.images?.filter((item) => item.length > 0);
      const response = await updateProductApi(id, {
        ...payload,
        images: imageArray,
      });
      if (response.success) alert(response?.message);
      if (response?.error) alert(response.error);
    } catch (error) {
      console.warn("Error: Error while updating product -", error);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      formik.resetForm();
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      qty: 0,
      imageOne: "",
      imageTwo: "",
      imageThree: "",
      imageFour: "",
      imageFive: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      price: Yup.number().typeError("please enter number only").required(),
      qty: Yup.number().typeError("please enter number only").required(),
      imageOne: Yup.string().required("please select atlease one image"),
    }),
    onSubmit: (values) => {
      const images = [
        values.imageOne,
        values.imageTwo,
        values.imageThree,
        values.imageFour,
        values.imageFive,
      ];
      const payload = {
        name: values.name,
        price: values.price,
        qty: values.qty,
        images: images,
      };
      !formData ? addProduct(payload) : updateProduct(formData.id, payload);
    },
  });

  useEffect(() => {
    if (formData) {
      const images = formData.images;
      formik.setValues({
        name: formData.name,
        price: formData.price,
        qty: formData.qty,
        imageOne: images?.length > 0 ? formData?.images[0] : "",
        imageTwo: images?.length > 1 ? formData?.images[1] : "",
        imageThree: images?.length > 2 ? formData?.images[2] : "",
        imageFour: images?.length > 3 ? formData?.images[3] : "",
        imageFive: images?.length > 4 ? formData?.images[4] : "",
      });
    } else {
      formik.resetForm();
    }
  }, [formData]);

  return (
    <Dialog
      open={isModalVisible}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Add Product"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", width: "400px" }}>
          <TextField
            name="name"
            type="text"
            label="Product Name"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && formik.errors.name ? true : false}
          />
          {formik.touched.name && formik.errors.name && (
            <span style={{ color: "red" }}>{formik.errors.name}</span>
          )}
          <TextField
            name="price"
            type="text"
            label="Product Price"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && formik.errors.price ? true : false}
          />
          {formik.touched.price && formik.errors.price && (
            <span style={{ color: "red" }}>{formik.errors.price}</span>
          )}
          <TextField
            name="qty"
            type="text"
            label="available stock"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.qty}
            onChange={formik.handleChange}
            error={formik.touched.qty && formik.errors.qty ? true : false}
          />
          {formik.touched.qty && formik.errors.qty && (
            <span style={{ color: "red" }}>{formik.errors.qty}</span>
          )}
          <TextField
            name="imageOne"
            type="text"
            label="Product Image 1"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.imageOne}
            onChange={formik.handleChange}
            error={
              formik.touched.imageOne && formik.errors.imageOne ? true : false
            }
          />
          {formik.touched.imageOne && formik.errors.imageOne && (
            <span style={{ color: "red" }}>{formik.errors.imageOne}</span>
          )}
          <TextField
            name="imageTwo"
            type="text"
            label="Product Image 2"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.imageTwo}
            onChange={formik.handleChange}
          />
          <TextField
            name="imageThree"
            type="text"
            label="Product Image 3"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.imageThree}
            onChange={formik.handleChange}
          />
          <TextField
            name="imageFour"
            type="text"
            label="Product Image 4"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.imageFour}
            onChange={formik.handleChange}
          />
          <TextField
            name="imageFive"
            type="text"
            label="Product Image 5"
            variant="outlined"
            sx={{ mt: 4 }}
            value={formik.values.imageFive}
            onChange={formik.handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsModalVisible(false)} disabled={loading}>
          Close
        </Button>
        <Button onClick={formik.handleSubmit} autoFocus disabled={loading}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductForm;
