import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import { loginApi } from "../API/login";

const LoginPage = () => {
  const signin = async (payload) => {
    const response = await loginApi(payload.username, payload.password);
    if (response?.status === 200) {
      console.log(response.data)
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("role", JSON.stringify(response.data.role));
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      console.log("login token =>", response.data.token)
      window.location.replace("/home");
    } else {
      console.log("something went wrong!")
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log({ values });
      signin(values);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Login</Typography>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          sx={{ mt: 4 }}
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          variant="outlined"
          sx={{ mt: 4 }}
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          sx={{ mt: 4 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
