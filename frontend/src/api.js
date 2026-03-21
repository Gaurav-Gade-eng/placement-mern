import axios from "axios";

const API = axios.create({
 baseURL: "https://placement-backend-4n9z.onrender.com/"
});

API.interceptors.request.use((req) => {

 const token = localStorage.getItem("token");

 if (token) {
  req.headers.Authorization = `Bearer ${token}`;
 }

 return req;

});

export default API;