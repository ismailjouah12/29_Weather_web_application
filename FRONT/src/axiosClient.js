
  

  import axios from "axios";
import { useUserContext } from "./UserContext.jsx";

const axiosClient = axios.create({
  baseURL: 'http://192.168.110.50:8000/api/'
  //baseURL: "http://localhost:8000/api",
 // baseURL: "https://libbie-nonvanishing-increasedly.ngrok-free.dev/api"

})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  config.headers.Authorization = `Bearer ${token}`
  return config;
})

axiosClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  const {response} = error;
  if (response.status === 401) {
    localStorage.removeItem('ACCESS_TOKEN')
  } else if (response.status === 404) {
  }

  throw error;
})

export default axiosClient