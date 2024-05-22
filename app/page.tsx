"use client";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";
export default function Home() {
  const { accessToken } = useContext(AuthContext);

  return accessToken ? <Dashboard /> : <LoginPage />;
}
