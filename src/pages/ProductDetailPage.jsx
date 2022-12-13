import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";
import { getProductApi, deleteProductApi } from "../API/products";
import { addToCartApi, removeFromCartApi, cartListApi } from "../API/cart";
import Loader from "../components/Loader";
import Header from "../components/Header";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddProductForm from "../components/AddProductForm";

const ProductDetailPage = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (product.qty > 0 && quantity < product.qty) {
      setQuantity((prevQty) => prevQty + 1);
      const userCart = localStorage.getItem("cart");
      if (userCart) {
        const cartObj = JSON.parse(userCart);
        if (cartObj[id]) {
          localStorage.setItem(
            "cart",
            JSON.stringify({
              ...cartObj,
              [id]: { qty: (cartObj[id].qty += 1), productId: id },
            })
          );
        } else {
          localStorage.setItem(
            "cart",
            JSON.stringify({
              ...cartObj,
              [id]: { qty: 1, productId: id },
            })
          );
        }
      } else {
        localStorage.setItem(
          "cart",
          JSON.stringify({ [id]: { qty: 1, productId: id } })
        );
      }
    } else {
      alert("you can not add more than available stock.");
    }
  };

  const addToCart = async () => {
    const isProductInCart = cartProducts.filter(
      (product) => product._id._id == id
    );
    if (product.qty < 1) {
      alert("no quantity available");
      return;
    }
    if (quantity < 1) {
      alert("add some quantity first");
      return;
    }
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
    }
    getCartProducts();
  };

  const removeQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQty) => prevQty - 1);
      const userCart = localStorage.getItem("cart");
      if (userCart) {
        const cartObj = JSON.parse(userCart);
        if (cartObj[id]) {
          localStorage.setItem(
            "cart",
            JSON.stringify({
              ...cartObj,
              [id]: { qty: (cartObj[id].qty -= 1), productId: id },
            })
          );
        } else {
          localStorage.setItem(
            "cart",
            JSON.stringify({
              ...cartObj,
              [id]: { qty: 0, productId: id },
            })
          );
        }
      }
    } else {
      alert("please add quantity");
    }
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

  const setProductQtys = () => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart && cart[id]) {
      setQuantity(cart[id].qty);
    }
  };

  const updateProduct = () => {
    setIsModalVisible(true);
    const images =
      product.images?.length > 0 ? product.images.map((image) => image) : [];
    const formData = {
      id: id,
      name: product.name,
      qty: product.qty,
      price: product.price,
      images,
    };
    setFormData(formData);
  };

  const deleteProduct = async () => {
    setLoading(true);
    try {
      const response = await deleteProductApi(id);
      if (response?.success) alert(response.message);
      navigate("/home");
    } catch (error) {
      console.warn("Error: Error while deleting product -", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    const data = window.confirm("Are you sure you want to delete?");
    if (data) deleteProduct();
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("role")) !== "admin") {
      getCartProducts();
      setProductQtys();
    }
    getProduct();
    setRole(JSON.parse(localStorage.getItem("role")));
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
          flexDirection: "column",
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
              {role !== "admin" && (
                <>
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
                </>
              )}
            </div>
          </Box>
        </Paper>
        {role === "admin" && (
          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setFormData(undefined);
                setIsModalVisible(true);
              }}
            >
              <Typography variant="body">Add product</Typography>
            </Button>
            <Button
              variant="contained"
              color="info"
              sx={{ ml: 2 }}
              onClick={() => updateProduct()}
            >
              <Typography variant="body">Update product</Typography>
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 2 }}
              onClick={() => confirmDelete()}
            >
              <Typography variant="body">Delete product</Typography>
            </Button>
          </Box>
        )}
      </Box>

      <AddProductForm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        formData={formData}
      />
    </div>
  ) : (
    <Loader />
  );
};

export default ProductDetailPage;
