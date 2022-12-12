import axios from "axios";

const token = JSON.parse(localStorage.getItem("token"));
axios.defaults.headers.common['Authorization'] = token
const baseURL = process.env.REACT_APP_BASE_URL;

// const authApis = axios.create({
//   baseURL: "https://www.test.halobolo.com/",
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });

export const POST = async (endpoint, data) => {
  return axios
    .post(baseURL + endpoint, data)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const PUT = async (endpoint, data) => {
  return axios
    .put(baseURL + endpoint, data)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const GET = async (endpoint, params) => {
  return axios
    .get(baseURL + endpoint, { params })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const DELETE = async (endpoint, data) => {
  return axios
    .delete(baseURL + endpoint, { data })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw err;
    });
};
