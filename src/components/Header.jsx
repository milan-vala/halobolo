import { Box, Button, Typography } from "@mui/material";
import { logoutApi } from "../API/login";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logout = async () => {
    const response = await logoutApi();
    if (response?.status === 200) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.setItem("isLoggedIn", JSON.stringify(false));
      window.location.replace("/");
    }
  };
  const cartQty = localStorage.getItem("cartQty");

  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "20px",
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box onClick={goToCart} sx={{ cursor: "pointer" }}>
        <Badge badgeContent={cartQty} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </Box>
      <Button variant="outlined" onClick={logout} sx={{ ml: 3 }}>
        <Typography variant="body">Log out</Typography>
      </Button>
    </div>
  );
};

export default Header;
