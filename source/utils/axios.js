// axiosInstance.js
import axios from "axios";
import { Platform } from "react-native";
import { clientId, clientSecret, url } from "../constant";

const instance = axios.create({
  baseURL: url, // replace with your API base URL
  //   timeout: 5000, // set a timeout for requests
  headers: {
    "Content-Type": "application/json",
    "Client-ID": clientId,
    "Client-Secret": clientSecret,
    "Platform": Platform.OS,
  },
});

export default instance;
