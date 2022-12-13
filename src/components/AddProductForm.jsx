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
  const [filesLen, setFilesLen] = useState(0);
  const [productImages, setProductImages] = useState([]);

  const addProduct = async (payload) => {
    if (filesLen > 5) {
      alert("please add max 5 files only");
      return;
    }
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
    if (filesLen > 5) {
      alert("please add max 5 files only");
      return;
    }
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
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      price: Yup.number().typeError("please enter number only").required(),
      qty: Yup.number().typeError("please enter number only").required(),
    }),
    onSubmit: (values) => {
      const payload = {
        name: values.name,
        price: values.price,
        qty: values.qty,
        images: productImages,
      };
      !formData ? addProduct(payload) : updateProduct(formData.id, payload);
    },
  });

  useEffect(() => {
    if (formData) {
      formik.setValues({
        name: formData.name,
        price: formData.price,
        qty: formData.qty,
      });
    } else {
      formik.resetForm();
    }
  }, [formData]);

  const handleFileChange = (event) => {
    setFilesLen(Array.from(event.target.files).length);
    if (Array.from(event.target.files).length > 5) {
      event.preventDefault();
      alert(`you can upload max ${5} images.`);
      return;
    } else {
      const files = Object.values(event.target.files);
      const fileNames = files.map((file) => file.name);
      setProductImages(fileNames);
    }
  };

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
          <input
            type="file"
            multiple
            accept="image/jpg"
            onChange={handleFileChange}
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
