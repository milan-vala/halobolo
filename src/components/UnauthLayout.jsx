import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { NotMatch } from "../pages/NotMatch";

const UnauthLayout = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<LoginPage />} />
      </Route>

      <Route path="*" element={<NotMatch />} />
    </Routes>
  );
};

export default UnauthLayout;
