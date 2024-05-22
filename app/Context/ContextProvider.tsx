"use client";
import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import { localVariable } from "@/data";

function ContextProvider({ children }: { children: React.ReactNode }) {
  let initialUser = {};
  let initialAccessToken = {};
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem(localVariable.user);
    initialUser = storedUser ? JSON.parse(storedUser) : {};
    initialAccessToken = localStorage.getItem(localVariable.accessToken) || "";
  }

  const [user, setUser] = useState(initialUser);
  const [accessToken, setAccessToken] = useState(initialAccessToken);

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
