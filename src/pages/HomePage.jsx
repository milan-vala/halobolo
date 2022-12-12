import React, { useEffect, useState } from "react";
import { productsListApi } from "../API/products";
import { Box, Paper, Typography } from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await productsListApi();
      if (response?.data?.length) {
        setProducts(response.data);
      }
    } catch (err) {
      console.warn("Error: ", err?.message);
    } finally {
      setLoading(false);
    }
  };

  const viewProduct = (product) => {
    navigate(`/product/${product._id}`);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return !loading ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      {products.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {products.map((product) => (
            <Paper
              elevation={2}
              key={product._id}
              sx={{
                marginBottom: "20px",
                height: "250px",
                width: "500px",
                cursor: "pointer",
              }}
              onClick={() => viewProduct(product)}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                {product.images.length ? (
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
                    Quantity: {product.qty}
                  </Typography>
                </div>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : null}
    </div>
  ) : (
    <Loader />
  );
};

export default HomePage;
