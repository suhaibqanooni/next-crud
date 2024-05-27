"use client";
import React, { useContext, useEffect, useState } from "react";
import apiCall from "../../api/ApiCall";
import { AuthContext } from "../../Context/AuthContext";
import Header from "../../components/Header";
import useAuthorization from "../../Hooks/useAuthorization";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

let endpoint = "orders";
const dataInterface = {
  id: 0,
  name: "",
  phone: "",
  address: "",
  qad: 0,
  width: 0,
  arm: 0,
  cuff: 0,
  chest: 0,
  daman: 0,
  collar: 0,
  collarType: "",
  pant: 0,
  pantCuff: 0,
  frontPocket: "",
  order: "",
};
export default function Page({ params }: any) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(dataInterface);
  const fetchData = () => {
    setLoading(true);
    apiCall("GET", `${endpoint}/${params.id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [authContext.user]);

  useAuthorization(authContext.user);
  if (!authContext.user) {
    return null;
  }

  return data.name ? (
    <>
      <Header />
      <div className="container mt-10">
        <>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {data?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {data.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {data.address}
              </Typography>
            </CardContent>
          </Card>
          <h3>Order Details</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p>qad: {data?.qad}</p>
              <p>width: {data?.width}</p>
              <p>arm: {data?.arm}</p>
              <p>cuff: {data?.cuff}</p>
              <p>chest: {data?.chest}</p>
            </div>
            <div>
              <p>daman: {data?.daman}</p>
              <p>collar: {data?.collar}</p>
              <p>pant: {data?.pant}</p>
              <p>pantCuff: {data?.pantCuff}</p>
            </div>
            <div>
              <p>frontPocket: {data?.frontPocket}</p>
              <p>collarType: {data?.collarType}</p>
            </div>
          </div>
          <p>
            <strong>Order:</strong> {data?.order}
          </p>
        </>
      </div>
    </>
  ) : (
    <h1>Order Details Not Found 404</h1>
  );
}
