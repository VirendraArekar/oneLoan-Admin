import axios from "axios";
import {BASE_URL} from "../utils/Constant";

// export const BASE_URL = "http://50.17.107.208:3004/v1";

const userToken = localStorage.getItem("accessToken");

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: !!userToken ? { Authorization: `Bearer ${userToken}` } : null,
});
