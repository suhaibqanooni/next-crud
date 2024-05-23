"use client";
import { useContext, useEffect, useState } from "react";
import apiCall from "../api/ApiCall";
import { Loader } from "../components/Loader";
import { AuthContext } from "../Context/AuthContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../components/Header";
import useAuthorization from "../Hooks/useAuthorization";
const endpoint = "user";
export default function Page() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(Array);

  const columns = [
    { field: "sno", headerName: "#", width: 100, key: "1", flex: 1 },
    { field: "id", headerName: "ID", width: 100, key: "2", flex: 1 },
    { field: "name", headerName: "Name", width: 200, key: "3", flex: 2 },
    { field: "email", headerName: "Email", width: 150, key: "4", flex: 3 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      key: "5",
      flex: 2,
    },
  ];

  const fetchData = () => {
    setLoading(true);

    apiCall("GET", endpoint)
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
  return (
    <>
      <Header />
      <div className="container mt-10">
        {loading && <Loader />}
        <>
          <div className="d-flex justify-content-between">
            <h4>Users</h4>
          </div>

          <div style={{ width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={data.map((row: any, i) => ({
                sno: i + 1,
                id: row.id,
                name: row.name,
                email: row.email,
                role: row.role,
              }))}
              slots={{
                toolbar: GridToolbar,
              }}
              onPaginationModelChange={(e) => console.log("____pagination", e)}
            />
          </div>
        </>
      </div>
    </>
  );
}
