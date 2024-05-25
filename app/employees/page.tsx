"use client";
import { useContext, useEffect, useState } from "react";
import apiCall from "../api/ApiCall";
import { Loader } from "../components/Loader";
import { AuthContext } from "../Context/AuthContext";
import { DataGrid, GridPagination, GridToolbar } from "@mui/x-data-grid";
import Header from "../components/Header";
import useAuthorization from "../Hooks/useAuthorization";
import { Add, Edit } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { message } from "antd";
import { InputField, InputSelectField } from "../components/InputFields";
import { adminPermission } from "../Context/Actions";
let endpoint = "employees";
export default function Page() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(Array);
  const [products, setProducts] = useState(Array);
  const [updatingId, setUpdatingId] = useState(Number);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    dob: "",
    productId: 0,
  });
  const fetchProducts = () => {
    setLoading(true);
    apiCall("GET", "product")
      .then((res) => {
        const pros = res.data?.map((product: any) => ({
          value: product.id,
          label: product.title,
        }));
        setProducts(pros);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const columns = [
    { field: "sno", headerName: "#", width: 100, key: "1", flex: 1 },
    { field: "id", headerName: "ID", width: 100, key: "2", flex: 1 },
    { field: "name", headerName: "Name", width: 200, key: "3", flex: 2 },
    { field: "email", headerName: "Email", width: 150, key: "4", flex: 3 },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      key: "5",
      flex: 2,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 150,
      key: "6",
      flex: 2,
    },
    {
      field: "productId",
      headerName: "Product Alloted",
      width: 150,
      flex: 2,
    },

    adminPermission(authContext.user.role)
      ? {
          field: "action",
          headerName: "Action",
          width: 150,
          key: "9",
          flex: 1,
          renderCell: (params: any) => (
            <div className="d-flex h-100 align-items-center">
              <a
                onClick={() => {
                  setFormData({
                    name: params.row.name,
                    email: params.row.email,
                    position: params.row.position,
                    dob: params.row.dob,
                    productId: products?.find(
                      (op: any) => op.label === params.row.productId
                    )?.value,
                  });
                  setUpdatingId(params.row.id);
                  setShowModal(true);
                }}
              >
                <Edit style={{ color: "green" }} />
              </a>
              <a onClick={() => deleteRecord(params.row.id)}>
                <DeleteForeverIcon style={{ color: "red" }} />
              </a>
            </div>
          ),
        }
      : {},
  ];
  const deleteRecord = (id: any) => {
    setLoading(true);
    if (confirm("You are deleting this record. press ok to confirm!") == true) {
      apiCall("DELETE", endpoint + "/" + id)
        .then((res) => {
          fetchData();
        })
        .catch((e) => console.log(e));
    }
    setLoading(false);
  };
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
  const addRecord = () => {
    const data = { ...formData, addedById: authContext.user.id };
    setLoading(true);
    apiCall("POST", endpoint, data)
      .then((result) => {
        fetchData();
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          position: "",
          dob: "",
          productId: 0,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response.data.message);
        if (err.response.data.message === "Internal Server Error")
          message.error("Check your Internet connection");
        message.error(err.response.data.message);
      });
  };

  const updateRecord = () => {
    const data = { ...formData, addedById: authContext.user.id };
    apiCall("PATCH", `${endpoint}/${updatingId}`, data)
      .then((res) => {
        fetchData();
        message.success("Record updated successfully");
      })
      .catch((err) => {
        message.error(err.response.data.message);
      })
      .finally(() => {
        setUpdatingId(0);
        setFormData({
          name: "",
          email: "",
          position: "",
          dob: "",
          productId: 0,
        });
        setShowModal(false);
      });
  };
  useEffect(() => {
    fetchProducts();
    fetchData();
  }, [authContext.user]);

  useAuthorization(authContext.user);
  if (!authContext.user) {
    return null;
  }
  const CustomPagination = () => {
    const [pageSize, setPageSize] = useState(2);

    const handlePageSizeChange = (event: any) => {
      setPageSize(event.target.value);
    };

    return (
      <GridPagination
        rowsPerPageOptions={[2, 5, 10, 25]}
        rowCount={data?.length}
        pageSize={pageSize}
        pageSizeChange={handlePageSizeChange}
      />
    );
  };
  return (
    <>
      <Header />
      <div className="container mt-10">
        <>
          <div className="d-flex justify-content-between">
            <h4>Employees</h4>
            {adminPermission(authContext.user.role) && (
              <a
                className="btn btn-success"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <Add /> Add
              </a>
            )}
          </div>
          <DataGrid
            columns={
              columns as {
                field: string;
                headerName: string;
                width: number;
                key: string;
                flex: number;
                renderCell?: undefined;
              }[]
            }
            loading={loading}
            rows={data.map((row: any, i) => ({
              sno: i + 1,
              id: row.id,
              name: row.name,
              email: row.email,
              position: row.position,
              dob: row.dob,
              productId:
                (products as { value: string; label: string }[]).find(
                  (op) => op.value === row.productId
                )?.label || "",
            }))}
            autoHeight
            slots={{
              toolbar: GridToolbar,
              pagination: CustomPagination,
            }}
            onPaginationModelChange={(e) => console.log("____pagination", e)}
          />
        </>
      </div>
      {showModal && (
        <div
          className="modal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header flex justify-content-between">
                <h5 className="modal-title">
                  {updatingId ? "Update" : "Add New"} Employee Record
                </h5>
              </div>
              <div className="modal-body">
                <InputField
                  name="name"
                  label="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      name: e.target.value,
                    }));
                  }}
                />
                <InputField
                  name="email"
                  label="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      email: e.target.value,
                    }));
                  }}
                />
                <InputField
                  name="position"
                  label="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      position: e.target.value,
                    }));
                  }}
                />
                <InputField
                  name="dob"
                  label="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      dob: e.target.value,
                    }));
                  }}
                />

                <InputSelectField
                  name="productId"
                  label="Product Alloted"
                  value={formData.productId.toString()}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      productId: Number(e.target.value),
                    }))
                  }
                  options={products as { value: string; label: string }[]}
                />
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setUpdatingId(0);
                      setFormData({
                        name: "",
                        email: "",
                        position: "",
                        dob: "",
                        productId: 0,
                      });
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() =>
                      updatingId > 0 ? updateRecord() : addRecord()
                    }
                  >
                    {updatingId > 0 ? "Update" : "Add"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
