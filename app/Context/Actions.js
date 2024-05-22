import { useContext } from "react";
import { localVariable } from "../../data";
import AuthContext from "../Context/AuthContext";
import Cookies from "js-cookie";
export const logOut = () => {
  const authContext = useContext(AuthContext);
  localStorage.removeItem(localVariable.accessToken);
  localStorage.removeItem(localVariable.user);
  authContext.setUser(null);
  authContext.setAccessToken(null);
  Cookies.remove();
};
