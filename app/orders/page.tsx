"use client";
import React, { useContext, useEffect, useState } from "react";
import apiCall from "../api/ApiCall";
import { AuthContext } from "../Context/AuthContext";
import Header from "../components/Header";
import useAuthorization from "../Hooks/useAuthorization";
import { Add, Edit, Loop, Search } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { message, Popconfirm, Table } from "antd";
import { adminPermission } from "../Context/Actions";
import { Step, StepLabel, Stepper } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Link from "next/link";
import UnAuthorized from "../components/UnAuthorized";
import OrderModal from "./OrderModal";
let endpoint = "orders";
const permittedTo = "ADMIN";
export default function Page() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(Array);
  const [updatingId, setUpdatingId] = useState(Number);
  const [showModal, setShowModal] = useState(false);
  const dataInterface = {
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
  const [formData, setFormData] =
    useState<Record<string, string | number>>(dataInterface);

  const [activeStep, setActiveStep] = useState(0);
  const [search, setSearch] = useState("");
  const [skipped, setSkipped] = useState(new Set<number>());

  const steps = [
    {
      key: 1,
      title: "Customer Information",
      fields: [
        { type: "text", name: "name", id: "name", label: "Name" },
        { type: "text", name: "phone", id: "phone", label: "Phone" },
        { type: "text", name: "address", id: "address", label: "Address" },
      ],
    },
    {
      key: 2,
      title: "General Order",
      fields: [
        { type: "number", name: "qad", id: "qad", label: "Qad" },
        { type: "number", name: "width", id: "width", label: "width" },
        { type: "number", name: "arm", id: "arm", label: "arm" },
        { type: "number", name: "cuff", id: "cuff", label: "cuff" },
        { type: "number", name: "chest", id: "chest", label: "chest" },
        { type: "number", name: "daman", id: "daman", label: "daman" },
        { type: "number", name: "collar", id: "collar", label: "collar" },
        { type: "number", name: "pant", id: "pant", label: "pant" },
        {
          type: "number",
          name: "pantCuff",
          id: "pantCuff",
          label: "pantCuff",
        },
      ],
    },
    {
      key: 3,
      title: "Special Order",
      fields: [
        {
          type: "radio",
          name: "collarType",
          id: "full",
          value: "full",
          label: "assets/order/color1.png",
        },
        {
          type: "radio",
          name: "collarType",
          id: "single",
          value: "single",
          label: "assets/order/color3.png",
        },
        {
          type: "radio",
          name: "collarType",
          id: "singleRound",
          value: "singleRound",
          label: "assets/order/color2.png",
        },
        {
          type: "radio",
          name: "frontPocket",
          id: "yes",
          value: "yes",
          label: "assets/order/frontPocket1.png",
        },
        {
          type: "radio",
          name: "frontPocket",
          id: "no",
          value: "no",
          label: "No Front Pocket",
        },
      ],
    },
    {
      key: 4,
      title: "Review",
      fields: [],
    },
  ];

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (!formData.name || !formData.phone)
      return message.error("Please Enter Name and Phone Number");
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({});
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    let params = {
      method: "POST",
      endpoint,
    };
    if (updatingId) {
      params.method = "PATCH";
      params.endpoint = `${endpoint}/${updatingId}`;
    }
    let data = {
      ...formData,
      addedById: Number(authContext.user.id),
    };

    setLoading(true);
    apiCall(params.method, params.endpoint, data)
      .then((result) => {
        fetchData();
        setUpdatingId(0);
        setShowModal(false);
        setFormData(dataInterface);
        setActiveStep(0);
        setLoading(false);
        message.success("Data Saved Successfully");
      })
      .catch((err) => {
        setLoading(false);
        setUpdatingId(0);
        console.log(err.response.data.message);
        if (err.response.data.message === "Internal Server Error")
          message.error("Check your Internet connection");
        message.error(err.response.data.message[0]);
      });
  };

  const deleteRecord = (id: any) => {
    setLoading(true);
    apiCall("DELETE", endpoint + "/" + id)
      .then((res) => {
        fetchData();
      })
      .catch((e) => console.log(e));
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

  useEffect(() => {
    fetchData();
  }, [authContext.user]);

  useAuthorization(authContext.user);
  if (!authContext.user) {
    return null;
  }
  const columns = [
    {
      title: "Sno",
      dataIndex: "sno",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, row: any) => (
        <Link href={`orders/${row.id}`}>{row?.name}</Link>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Returning Date",
      dataIndex: "returnDate",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, row: any) => (
        <div className="d-flex h-100 align-items-center">
          <a
            onClick={() => {
              const { sno, id, ...rest } = row;
              setFormData(rest);
              setUpdatingId(row.id);
              setShowModal(true);
            }}
          >
            <Edit style={{ color: "green" }} />
          </a>
          <Popconfirm
            title="Delete the order"
            description="Are you sure to delete this order?"
            onConfirm={() => deleteRecord(row.id)}
            onCancel={() => console.log("Cancelled")}
            okText="Yes"
            okType="danger"
            cancelText="No"
          >
            <DeleteForeverIcon style={{ color: "red" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  const filterData = () => {
    const filterData = data?.filter(
      (op: any) =>
        op.name?.toLowerCase().includes(search.toLowerCase()) ||
        op.phone?.toLowerCase().includes(search.toLowerCase())
    );
    setData(filterData);
  };
  return adminPermission(authContext.user?.role) ||
    authContext.user?.role === permittedTo ? (
    <>
      <Header />
      <div className="container mt-10 mb-30">
        <>
          <div className="d-flex justify-content-between">
            <h4>Orders</h4>
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control"
                placeholder="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-warning"
                  type="button"
                  onClick={filterData}
                >
                  <Search /> Search
                </button>
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={() => {
                    setSearch("");
                    fetchData();
                  }}
                >
                  <Loop /> Reset
                </button>
              </div>
            </div>
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
          <Table
            columns={columns}
            loading={loading}
            dataSource={data.map((row: any, i) => ({
              sno: i + 1,
              id: row.id,
              name: row?.name,
              phone: row.phone,
              address: row.address,
              returnDate: row.returnDate,
              qad: row.qad,
              width: row.width,
              arm: row.arm,
              cuff: row.cuff,
              chest: row.chest,
              daman: row.daman,
              collar: row.collar,
              pant: row.pant,
              pantCuff: row.pantCuff,
              frontPocket: row.frontPocket,
              collarType: row.collarType,
              order: row.order,
            }))}
          />
        </>
      </div>
      {showModal && (
        <OrderModal
          setShowModal={setShowModal}
          updatingId={updatingId}
          setUpdatingId={setUpdatingId}
          fetchData={fetchData}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {/* {showModal && (
        <div className="container">
          <div className="d-flex justify-content-between">
            <h3>{updatingId ? "Update" : "Add"} Order Record</h3>
            <button
              className="btn btn-danger"
              onClick={() => setShowModal(false)}
            >
              X Close
            </button>
          </div>
          <br />
          <div style={{ width: "100%", minHeight: "400px" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((step, index) => (
                <Step key={step.key}>
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <>
                <p style={{ marginTop: 2, marginBottom: 1 }}>
                  All steps completed - you&apos;re finished
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: 2,
                  }}
                >
                  <div style={{ flex: "1 1 auto" }} />
                  <button className="btn btn-dark" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginTop: 2, marginBottom: 1 }}>
                  Step {activeStep + 1}
                </p>
                {activeStep === 3 ? (
                  <div>
                    <h3>Review Information</h3>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p>Name: {formData?.name}</p>
                        <p>Phone: {formData?.phone}</p>
                        <p>Address: {formData?.address}</p>
                        <p>Extra Order: {formData?.order}</p>
                        <div>
                          <textarea
                            className="form-control"
                            placeholder="Order"
                            value={formData.order?.toString()}
                            id="order"
                            name="order"
                            onChange={(e) =>
                              handleInputChange("order", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        {steps[2].fields.map((item) => {
                          if (
                            item.id === formData.frontPocket ||
                            item.id === formData.collarType
                          )
                            return item.id === "no" ? (
                              <p style={{ color: "red" }}>{item.label}</p>
                            ) : (
                              <>
                                <img src={item.label} width={100} />
                                <hr />
                              </>
                            );
                        })}
                      </div>
                      <div>
                        <table className="table">
                          <tr>
                            <td>Qad</td>
                            <td>{formData?.qad}</td>
                          </tr>
                          <tr>
                            <td>Width</td>
                            <td>{formData?.width}</td>
                          </tr>

                          <tr>
                            <td>Arm</td>
                            <td>{formData?.arm}</td>
                          </tr>
                          <tr>
                            <td>Cuff</td>
                            <td>{formData?.cuff}</td>
                          </tr>
                          <tr>
                            <td>Chest</td>
                            <td>{formData?.chest}</td>
                          </tr>
                          <tr>
                            <td>Daman</td>
                            <td>{formData?.daman}</td>
                          </tr>
                          <tr>
                            <td>Collar</td>
                            <td>{formData?.collar}</td>
                          </tr>
                          <tr>
                            <td>Pant</td>
                            <td>{formData?.pant}</td>
                          </tr>
                          <tr>
                            <td>Pant Cuff</td>
                            <td>{formData?.pantCuff}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                    <hr />
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {steps[activeStep].fields.map((field) => (
                      <>
                        {field.type === "radio" ? (
                          <div>
                            <input
                              type="radio"
                              id={field.id}
                              name={field.name}
                              checked={formData[field.name] == field.id}
                              style={{
                                position: "absolute",
                                opacity: 0,
                                width: 100,
                                height: 70,
                              }}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.id)
                              }
                            />
                            {formData[field.name] == field.id && (
                              <CheckCircleRoundedIcon />
                            )}
                            <label>
                              {field.id === "no" ? (
                                <button style={{ color: "red" }}>
                                  {field.label}
                                </button>
                              ) : (
                                <img
                                  src={field.label}
                                  alt={field.label}
                                  style={{ width: "80px", cursor: "pointer" }}
                                />
                              )}
                            </label>
                          </div>
                        ) : (
                          <div>
                            <p>{field.label}</p>
                            <input
                              className="form-control"
                              placeholder={field.label}
                              value={formData[field.name]?.toString()}
                              id={field.name}
                              type={field.type}
                              name={field.name}
                              onChange={(e) =>
                                handleInputChange(
                                  field.name,
                                  field.type == "number"
                                    ? Number(e.target.value)
                                    : e.target.value
                                )
                              }
                            />
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: 2,
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <div style={{ flex: "1 1 auto" }} />

                  <button className="btn btn-primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </button>
                  {activeStep === steps.length - 1 && (
                    <button onClick={handleSubmit} className="btn btn-success">
                      Submit
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )} */}
    </>
  ) : (
    <UnAuthorized />
  );
}
