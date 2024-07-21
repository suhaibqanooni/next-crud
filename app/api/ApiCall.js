import axios from "axios";
export const baseURL = "http://localhost:8000";
// export const baseURL = "https://nest-crud-2e5o.onrender.com";

const apiCall = async (method, endpoint, data) => {
  let user = {};
  if (typeof window !== "undefined") {
    user = JSON.parse(window.localStorage.getItem("user"));
  }
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
