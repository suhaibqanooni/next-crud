"use client";
import { useContext, useEffect, useState } from "react";
import apiCall, { baseURL } from "../api/ApiCall";
import { Loader } from "../components/Loader";
import { AuthContext } from "../Context/AuthContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../components/Header";
import useAuthorization from "../Hooks/useAuthorization";
import { Add, Edit, Person } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { message } from "antd";
import { InputField, InputSelectField } from "../components/InputFields";
import { adminPermission } from "../Context/Actions";
import axios from "axios";
let endpoint = "employees";
export default function Page() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(Array);
  const [products, setProducts] = useState(Array);
  const [updatingId, setUpdatingId] = useState(Number);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    dob: "",
    productId: 0,
    photo: "",
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
    {
      field: "photo",
      headerName: "Photo",
      width: 150,
      key: "2",
      flex: 1,
      renderCell: (params: any) =>
        params.row.photo ? (
          <img
            src={baseURL + "/" + params.row.photo}
            style={{ width: 40, height: 40, borderRadius: "40%" }}
          />
        ) : (
          <Person />
        ),
    },
    { field: "id", headerName: "ID", width: 100, key: "3", flex: 1 },
    { field: "name", headerName: "Name", width: 200, key: "4", flex: 2 },
    { field: "email", headerName: "Email", width: 150, key: "5", flex: 3 },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      key: "6",
      flex: 2,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 150,
      key: "7",
      flex: 2,
    },
    {
      field: "productId",
      headerName: "Product Alloted",
      width: 150,
      flex: 2,
    },

    adminPermission(authContext?.user?.role)
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
                    productId: Number(
                      (products as { value: string; label: string }[])?.find(
                        (op: any) => op.label === params.row.productId
                      )?.value
                    ),
                    photo: params.row.photo,
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
  const onSubmit = () => {
    if (file) {
      const multipartUpload = new FormData();
      multipartUpload.append("file", file);
      axios
        .post(`${baseURL}/${endpoint}/upload`, multipartUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          const filename = `${response.data.file.destination}/${response.data.file.filename}`;
          let data = {
            ...formData,
            addedById: authContext.user.id,
            photo: filename,
          };
          addRecord(data);
        })
        .catch((err) => {
          setLoading(false);
          console.log("File upload error", err);
        });
    } else {
      let data = {
        ...formData,
        addedById: authContext.user.id,
      };
      addRecord(data);
    }
  };

  const addRecord = (data: object) => {
    let params = {
      method: "POST",
      endpoint,
    };
    if (updatingId) {
      params.method = "PATCH";
      params.endpoint = `${endpoint}/${updatingId}`;
      apiCall("DELETE", `employees/file/${updatingId}`)
        .then((res) => {
          console.log("Deleted");
        })
        .catch((err) => {
          console.log("Error");
        });
    }
    setLoading(true);
    apiCall(params.method, params.endpoint, data)
      .then((result) => {
        fetchData();
        setUpdatingId(0);
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          position: "",
          dob: "",
          productId: 0,
          photo: "",
        });
        setFile(null);
      })
      .catch((err) => {
        setLoading(false);
        setUpdatingId(0);
        setFile(null);
        console.log(err.response.data.message);
        if (err.response.data.message === "Internal Server Error")
          message.error("Check your Internet connection");
        message.error(err.response.data.message);
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
              photo: row.photo,
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
                {updatingId && formData.photo ? (
                  <img
                    src={baseURL + "/" + formData.photo}
                    style={{ width: 100, height: 100, borderRadius: "50%" }}
                  />
                ) : null}
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
                <InputField
                  name="file"
                  label="file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      setFile(file);
                    }
                  }}
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
                        photo: "",
                      });
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => onSubmit()}
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
