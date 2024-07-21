"use client";
import { useContext, useEffect, useState } from "react";
import apiCall from "../api/ApiCall";
import { AuthContext } from "../Context/AuthContext";
import Header from "../components/Header";
import useAuthorization from "../Hooks/useAuthorization";
import { Table } from "antd";
import { adminPermission } from "../Context/Actions";
import UnAuthorized from "../components/UnAuthorized";
const permittedTo = "ADMIN";
const endpoint = "user";
export default function Page() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(Array);

  const columns = [
    { dataIndex: "sno", title: "#", width: 100, key: "1", flex: 1 },
    { dataIndex: "id", title: "ID", width: 100, key: "2", flex: 1 },
    { dataIndex: "name", title: "Name", width: 200, key: "3", flex: 2 },
    { dataIndex: "email", title: "Email", width: 150, key: "4", flex: 3 },
    {
      dataIndex: "role",
      title: "Role",
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
  return adminPermission(authContext.user?.role) ||
    authContext.user?.role === permittedTo ? (
    <>
      <Header />
      <div className="container mt-10">
        <>
          <h4>Users</h4>
          <Table
            columns={columns}
            loading={loading}
            dataSource={data?.map((row: any, i) => ({
              sno: i + 1,
              id: row.id,
              name: row.name,
              email: row.email,
              role: row.role,
            }))}
          />
        </>
      </div>
    </>
  ) : (
    <UnAuthorized />
  );
}
