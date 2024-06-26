"use client";
import { useContext, useEffect, useState } from "react";
import apiCall from "../api/ApiCall";
import { Loader } from "../components/Loader";
import { categoryOptions, localVariable, userRolesOptions } from "../../data";
import { InputField, InputSelectField } from "../components/InputFields";
import { AuthContext } from "../Context/AuthContext";
import { DataGrid, GridPagination, GridToolbar } from "@mui/x-data-grid";
import { message } from "antd";
import UserCreateForm from "../components/UserCreateForm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Header from "../components/Header";
import { Add, Edit } from "@mui/icons-material";
import { adminPermission } from "../Context/Actions";
const endpoint = "product";
export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(Number);
  const [data, setData] = useState(Array);
  const [checkedList, setCheckedList] = useState(
    authContext.user?.productTableViewColumns
      ? JSON.parse(authContext.user?.productTableViewColumns)
      : []
  );
  const columns = [
    { field: "sno", headerName: "#", key: "1", flex: 1 },
    { field: "id", headerName: "ID", key: "2", flex: 1 },
    { field: "title", headerName: "Title", key: "3", flex: 2 },
    {
      field: "price",
      headerName: "Price",
      key: "4",
      flex: 1,
      renderCell: (params) => `$ ${params.row.price?.toFixed(2)}`,
    },
    {
      field: "category",
      headerName: "Category",
      key: "5",
      flex: 1,
    },
    adminPermission(authContext?.user?.role)
      ? {
          field: "action",
          headerName: "Action",
          key: "6",
          flex: 1,
          renderCell: (params) => (
            <div className="d-flex h-100 align-items-center">
              <a
                onClick={() => {
                  setFormData({
                    title: params.row.title,
                    price: params.row.price,
                    category: params.row.category,
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
  const getMUIColumns = columns.reduce((acc, column) => {
    acc[column.field] = checkedList.includes(column.key);
    return acc;
  }, {});
  const [columnVisibility, setColumnVisibility] = useState(getMUIColumns);
  const changeSettings = (e) => {
    setCheckedList(e);
    apiCall("PATCH", `user/${authContext?.user?.id}`, {
      productTableViewColumns: JSON.stringify(e),
    })
      .then((response) => {
        console.log(response);
        apiCall("GET", `user/getOne/${authContext.user.id}`)
          .then((response) => {
            authContext.setUser(response.data.user);
            localStorage.setItem(
              localVariable.user,
              JSON.stringify(response.data.user)
            );
          })
          .catch((error) => {
            console.log("GET USER Error", error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    category: "",
  });

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
    setLoading(true);
    apiCall("POST", endpoint, formData)
      .then((result) => {
        fetchData();
        setShowModal(false);
        setFormData({
          title: "",
          price: 0,
          category: "",
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
    console.log(formData);
    apiCall("PATCH", `${endpoint}/${updatingId}`, formData)
      .then((res) => {
        fetchData();
      })
      .catch((err) => {
        console.log(err.response.data.message);
        alert(err.response.data.message);
      })
      .finally(() => {
        setUpdatingId(0);
        setFormData({
          title: "",
          price: 0,
          category: "",
        });
        setShowModal(false);
      });
  };

  const deleteRecord = (id) => {
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

  useEffect(() => {
    fetchData();
  }, [authContext.user]);

  const handleColumnVisibilityChange = (newColumns) => {
    setColumnVisibility(newColumns);
    const selectedKeys = [];
    columns.forEach((column) => {
      if (newColumns[column.field] || newColumns[column.field] === undefined) {
        selectedKeys.push(column.key);
      }
    });
    changeSettings(selectedKeys);
  };

  const CustomPagination = () => {
    const [pageSize, setPageSize] = useState(5);

    const handlePageSizeChange = (event) => {
      setPageSize(event.target.value);
    };

    return (
      <GridPagination
        rowsPerPageOptions={[2, 5, 10, 25]}
        rowCount={data?.length || 0}
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
            <h4>Products</h4>
            <a
              className="btn btn-success"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <Add /> Add
            </a>
          </div>

          <div style={{ width: "100%" }}>
            <DataGrid
              columns={columns}
              loading={loading}
              autoHeight
              rows={data.map((row, i) => ({
                sno: i + 1,
                id: row.id,
                title: row.title,
                price: row.price,
                category: row.category,
              }))}
              slots={{
                toolbar: GridToolbar,
                pagination: CustomPagination,
              }}
              onPaginationModelChange={(e) => console.log("____pagination", e)}
              columnVisibilityModel={columnVisibility}
              onColumnVisibilityModelChange={handleColumnVisibilityChange}
              disableRowSelectionOnClick
              disableColumnMenu
            />
          </div>
        </>

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
                    {updatingId ? "Update" : "Add New"} Product Record
                  </h5>
                </div>
                <div className="modal-body">
                  <InputField
                    name="title"
                    label="Title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        title: e.target.value,
                      }));
                    }}
                  />

                  <InputSelectField
                    name="category"
                    label="Category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        category: e.target.value,
                      }))
                    }
                    options={categoryOptions}
                  />

                  <InputField
                    name="price"
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        price: Number(e.target.value),
                      }));
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
                          title: "",
                          price: 0,
                          category: "",
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
        {showUserModal && (
          <UserCreateForm setShowUserModal={setShowUserModal} />
        )}
      </div>
    </>
  );
}
