import axios from "axios";
import { API } from "../Helper";

const token = JSON.parse(localStorage.getItem("token"));
axios.defaults.headers.common["Authorization"] = token;
const baseURL = process.env.REACT_APP_BASE_URL;

// const { GET } = API;

// export const productsListApi = async (payload) => {
//   return await axios.get(`${baseURL}/products`, payload);
// };

export const productsListApi = async (payload) => {
  return await API.GET("products", payload);
};

export const getProductApi = async (productId) => {
  return await API.GET(`products/${productId}`);
};
