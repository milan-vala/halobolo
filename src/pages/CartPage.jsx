import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { cartListApi } from "../API/cart";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { buyProductsApi } from "../API/cart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const getCartProducts = async () => {
    setLoading(true);
    try {
      const response = await cartListApi();
      if (response?.success) {
        setProducts(response.data[0].products);
      }
    } catch (error) {
      console.warn("Error: Error while getting all cart products -", error);
    } finally {
      setLoading(false);
    }
  };

  const buyOne = async (productId) => {
    try {
      const _products = JSON.parse(localStorage.getItem("cart"));
      const qty =
        Object.values(_products)?.find(
          (product) => product.productId == productId
        )?.qty || 1;

      const payload = {
        products: [{ _id: productId, qty }],
      };
      const response = await buyProductsApi(payload);
      if (response?.message) {
        alert(response.message);
        const newQty = localStorage.getItem("cartQty");
        const updatedQty = newQty < 1 ? 0 : parseInt(newQty) - 1;
        localStorage.setItem("cartQty", JSON.stringify(updatedQty));
      }
    } catch (error) {
      console.warn("Error: Error while buy product -", error);
    } finally {
      getCartProducts();
    }
  };

  const buyAll = async () => {
    if (!products?.length) {
      alert("no products available in cart to buy");
      return;
    }
    const _cartProducts = JSON.parse(localStorage.getItem("cart"));
    const payload = products.map((product) => {
      const _product = Object.values(_cartProducts)?.find(
        (item) => item.productId == product._id._id
      );
      return { _id: _product.productId, qty: _product.qty };
    });
    const requestBody = {
      products: payload,
    };
    try {
      const response = await buyProductsApi(requestBody);
      if (response?.message) {
        alert(response.message);
        localStorage.setItem("cartQty", JSON.stringify(0));
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.warn("Error: Error while buying products -", error);
    } finally {
      getCartProducts();
    }
  };

  useEffect(() => {
    getCartProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        <Box sx={{ p: 5 }}>
          {products?.length > 0
            ? products.map((product, index) => {
                return (
                  <Paper
                    elevation={2}
                    sx={{ display: "flex", flexDirection: "row" }}
                    key={index}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {product._id.images?.length ? (
                        product._id.images.map((productImage, i) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                              key={i}
                            >
                              <img
                                src={productImage}
                                alt="product"
                                style={{ height: "200px", width: "200px" }}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <img
                            src="https://www.americanradiumsociety.org/global_graphics/default-store-350x350.jpg"
                            alt="product"
                            style={{ height: "200px", width: "200px" }}
                          />
                        </div>
                      )}
                    </Box>
                    <Box sx={{ px: 3 }}>
                      <Typography variant="h6">
                        Price: {product._id.price}
                      </Typography>
                      <Button
                        endIcon={<ShoppingBasketIcon />}
                        onClick={() => buyOne(product._id._id)}
                      >
                        Buy Now
                      </Button>
                    </Box>
                  </Paper>
                );
              })
            : null}
          <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => buyAll()}
            >
              <Typography variant="body">Buy all</Typography>
            </Button>
            <Button
              onClick={() => navigate("/home")}
              variant="contained"
              color="info"
              sx={{ ml: 3 }}
            >
              Go Home
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CartPage;
