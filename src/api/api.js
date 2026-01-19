import axios from "axios";

const api = axios.create({
  baseURL: "https://alright-hetti-faculdade-49bca0ed.koyeb.app/api"
});

export default api;
