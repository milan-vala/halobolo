import axios from "axios";
import { API } from "../Helper";

const token = JSON.parse(localStorage.getItem("token"));
axios.defaults.headers.common["Authorization"] = token;

export const productsListApi = async (payload) => {
  return await API.GET("products", payload);
};

export const getProductApi = async (productId) => {
  return await API.GET(`products/${productId}`);
};

export const addProductApi = async (payload) => {
  return await API.POST("products", payload);
};

export const updateProductApi = async (productId, payload) => {
  return await API.PUT(`products/${productId}`, payload);
};

export const deleteProductApi = async (productId) => {
  return await API.DELETE(`products/${productId}`);
};
