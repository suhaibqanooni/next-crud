"use client";
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { localVariable } from "@/data";

function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem(localVariable.user);
      const storedAccessToken = localStorage.getItem(localVariable.accessToken);

      if (storedUser && storedAccessToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccessToken);
      }

      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return null;
  }

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
