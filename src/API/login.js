import axios from "axios"
const baseURL = process.env.REACT_APP_BASE_URL;

export const loginApi = async (username, password) => {
  try {
    const response = await axios.post(`${baseURL}/users/login`, { username, password });
    return response;
  } catch (error) {
    console.warn("Error: Error while logging in -",error)
  }
}

export const logoutApi = async () => {
  try {
    const response = await axios.post(`${baseURL}/users/logout`);
    console.log("response ==>", response);
    return response;
  } catch (error) {
    console.warn("Error: Error while logging out -", error);
  }
}