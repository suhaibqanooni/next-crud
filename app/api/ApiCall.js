import axios from "axios";
const baseURL = "http://localhost:8000";

const apiCall = async (method, endpoint, data) => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const headers = {
    "Content-Type": "application/json",
    authorization: user?.role,
  };
  const response = await axios({
    method,
    url: `${baseURL}/${endpoint}`,
    data,
    headers,
  });
  return response;
};
export default apiCall;
