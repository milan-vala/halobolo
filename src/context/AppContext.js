import { createContext } from "react";

const AppContext = createContext({
  token: JSON.parse(localStorage.getItem("token")),
  role: JSON.parse(localStorage.getItem("role")),
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")),
});
export default AppContext;