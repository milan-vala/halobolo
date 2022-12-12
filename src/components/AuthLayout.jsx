import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";

const AuthLayout = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
};

export default AuthLayout;
