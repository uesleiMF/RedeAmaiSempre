import axios from "axios";

const apiPublica = axios.create({
  baseURL: "https://backtestmar.onrender.com",
});

export default apiPublica;
