import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";
import { getProductApi } from "../API/products";
import { addToCartApi, removeFromCartApi, cartListApi } from "../API/cart";
import Loader from "../components/Loader";
import Header from "../components/Header";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ProductDetailPage = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const { id } = useParams();

  const getCartProducts = async () => {
    try {
      const response = await cartListApi();
      if (response?.success) {
        setCartProducts(response.data[0].products);
      }
    } catch (error) {
      console.warn("Error: Error while getting all cart products -", error);
    }
  };

  const getProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductApi(id);
      if (response?.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.warn("Error: Error while getting product -", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuantity = () => {
    if (product.qty > 0 && quantity < product.qty)
      setQuantity((prevQty) => prevQty + 1);
    else alert("you can not add more than available stock.");
  };

  const addToCart = async () => {
    const isProductInCart = cartProducts.filter(
      (product) => product._id._id == id
    );
    // if (product.qty > 0 && quantity < product.qty) {
    if (!isProductInCart?.length) {
      setLoading(true);
      const payload = {
        products: [{ _id: id }],
      };
      try {
        const response = await addToCartApi(payload);
        const cartQty = localStorage.getItem("cartQty");
        const updatedQty = cartQty ? parseInt(cartQty) + 1 : 1;
        localStorage.setItem("cartQty", JSON.stringify(updatedQty));
      } catch (error) {
        console.warn("Error: Error while add item to cart -", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("product is already available in cart.");
      // alert("you can not add more then available stock.");
    }
    getCartProducts();
  };

  const removeQuantity = () => {
    if (quantity > 0) setQuantity((prevQty) => prevQty - 1);
    else alert("please add quantity");
  };

  const removeFromCart = async () => {
    const isProductInCart = cartProducts.filter(
      (product) => product._id._id == id
    );

    if (isProductInCart?.length) {
      // if (quantity > 0) {
      setLoading(true);
      const payload = { product: id };
      try {
        const response = await removeFromCartApi(payload);
        const cartQty = localStorage.getItem("cartQty");
        const updatedQty = cartQty < 1 ? 0 : parseInt(cartQty) - 1;
        localStorage.setItem("cartQty", JSON.stringify(updatedQty));
      } catch (error) {
        console.warn("Error: Error while removing item from cart -", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("product not available in cart. you can add to cart.");
      // alert("please add quantity");
    }
    getCartProducts();
  };

  useEffect(() => {
    getCartProducts();
    getProduct();
  }, []);

  return !loading ? (
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
        <Paper elevation={2} sx={{ p: 5 }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {product.images?.length ? (
              product.images.map((image, index) => {
                return (
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                    key={index}
                  >
                    <img
                      src={image}
                      alt="product"
                      style={{ height: "200px", width: "200px" }}
                    />
                  </div>
                );
              })
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <img
                  src="https://www.americanradiumsociety.org/global_graphics/default-store-350x350.jpg"
                  alt="product"
                  style={{ height: "200px", width: "200px" }}
                />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h4" sx={{ ml: 2 }}>
                Product: {product.name}
              </Typography>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Price: {product.price}
              </Typography>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Available Quantity: {product.qty}
              </Typography>
              <Typography variant="h6" sx={{ ml: 2 }}>
                You're adding: {quantity}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  pt: 2,
                  px: 5,
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  onClick={addQuantity}
                >
                  <Typography variant="body">Add Quantity</Typography>
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<RemoveIcon />}
                  color="error"
                  sx={{ ml: 2 }}
                  onClick={removeQuantity}
                >
                  <Typography variant="body">Remove Quantity</Typography>
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  pt: 2,
                  px: 5,
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  onClick={addToCart}
                >
                  <Typography variant="body">Add to cart</Typography>
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<RemoveIcon />}
                  color="error"
                  sx={{ ml: 2 }}
                  onClick={removeFromCart}
                >
                  <Typography variant="body">Remove from cart</Typography>
                </Button>
              </Box>
            </div>
          </Box>
        </Paper>
      </Box>
    </div>
  ) : (
    <Loader />
  );
};

export default ProductDetailPage;
