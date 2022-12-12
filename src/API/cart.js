import axios from "axios";
import { API } from "../Helper";

const token = JSON.parse(localStorage.getItem("token"));
axios.defaults.headers.common["Authorization"] = token;
const baseURL = process.env.REACT_APP_BASE_URL;

export const addToCartApi = async (payload) => {
  return await API.POST("/carts", payload);
};

export const removeFromCartApi = async (payload) => {
  return await API.DELETE("/carts", payload);
};

export const cartListApi = async (payload) => {
  return await API.GET("carts", payload);
};
