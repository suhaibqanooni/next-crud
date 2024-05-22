"use client";
import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import { localVariable } from "@/data";

function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem(localVariable.user)) || {}
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(localVariable.accessToken) || ""
  );

  return (
    <div>
      <AuthContext.Provider
        value={{ user, setUser, accessToken, setAccessToken }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
}

export default ContextProvider;
