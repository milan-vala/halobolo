import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
};
