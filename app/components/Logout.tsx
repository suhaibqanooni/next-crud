"use client";
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { localVariable } from "@/data";
import Cookies from "js-cookie";
function Logout() {
  const logOut = () => {
    const authContext = useContext(AuthContext);
    localStorage.removeItem(localVariable.accessToken);
    localStorage.removeItem(localVariable.user);
    authContext.setUser(null);
    authContext.setAccessToken(null);
    Cookies.remove();
  };
  return (
    <button className="btn btn-dark" onClick={logOut}>
      Logout
    </button>
  );
}

export default Logout;
