"use client";
import React, { useContext, useEffect, useState } from "react";
import apiCall from "../api/ApiCall";
import { AuthContext } from "../Context/AuthContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../components/Header";
import useAuthorization from "../Hooks/useAuthorization";
import { Add, Edit } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { message } from "antd";
import { adminPermission } from "../Context/Actions";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
let endpoint = "orders";

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
  const [skipped, setSkipped] = useState(new Set<number>());

  const steps = [
    {
      key: 1,
      title: "Personal Information",
      fields: [
        { type: "text", name: "name", id: "name", label: "Name" },
        { type: "text", name: "phone", id: "phone", label: "Phone" },
        { type: "text", name: "address", id: "address", label: "Address" },
      ],
    },
    {
      key: 2,
      title: "Order Step 1",
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
      title: "Order Step 2",
      fields: [
        {
          type: "radio",
          name: "collarType",
          id: "full",
          value: "full",
          label:
            "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        },
        {
          type: "radio",
          name: "collarType",
          id: "single",
          value: "single",
          label:
            "https://thumbs.dreamstime.com/b/cameleon-tropical-color-70021439.jpg",
        },
        {
          type: "radio",
          name: "collarType",
          id: "singleRound",
          value: "singleRound",
          label:
            "https://thumbs.dreamstime.com/b/cameleon-tropical-color-70021439.jpg",
        },
        {
          type: "radio",
          name: "frontPocket",
          id: "yes",
          value: "yes",
          label:
            "https://thumbs.dreamstime.com/b/multicolored-exotic-cameleon-branch-multicolored-exotic-cameleon-branch-rainforest-141562363.jpg",
        },
        {
          type: "radio",
          name: "frontPocket",
          id: "no",
          value: "no",
          label:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ_mMuQgtbE8IaREJiID0xY2GcIT6ky_VFz0IM9lTY-GgcB2MpX8i-P27WjMo56qX4ayM&usqp=CAU",
        },
        // { type: "text", name: "order", label: "Order" },
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
    console.log("Form Data:", formData);
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

  const columns = [
    { field: "sno", headerName: "#", width: 100, key: "1", flex: 1 },
    { field: "name", headerName: "Name", width: 200, key: "4", flex: 2 },
    { field: "phone", headerName: "phone", key: "5", flex: 2 },
    { field: "address", headerName: "Address", key: "5", flex: 2 },
    {
      field: "qad",
      headerName: "Qad",
      key: "6",
      flex: 1,
    },
    {
      field: "width",
      headerName: "Width",
      key: "7",
      flex: 1,
    },
    {
      field: "arm",
      headerName: "Arm",
      flex: 1,
    },
    { field: "cuff", headerName: "Cuff", key: "5", flex: 1 },
    { field: "chest", headerName: "Chest", key: "5", flex: 1 },
    { field: "daman", headerName: "Daman", key: "5", flex: 1 },
    { field: "collar", headerName: "Collar", key: "5", flex: 1 },
    { field: "pant", headerName: "Pant", key: "5", flex: 1 },
    {
      field: "pantCuff",
      headerName: "PantCuff",
      key: "5",
      flex: 1,
    },
    {
      field: "frontPocket",
      headerName: "Front Pocket",
      key: "5",
      flex: 1,
    },
    {
      field: "collarType",
      headerName: "CollarType",
      key: "5",
      flex: 1,
    },
    { field: "order", headerName: "Order", key: "5", flex: 3 },
    adminPermission(authContext?.user?.role)
      ? {
          field: "action",
          headerName: "Action",

          key: "9",
          flex: 1,
          renderCell: (params: any) => (
            <div className="d-flex h-100 align-items-center">
              <a
                onClick={() => {
                  const { sno, id, ...rest } = params.row;
                  setFormData(rest);
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
        <>
          <div className="d-flex justify-content-between">
            <h4>Orders</h4>
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
              phone: row.phone,
              address: row.address,
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
            autoHeight
            slots={{
              toolbar: GridToolbar,
            }}
            onPaginationModelChange={(e) => console.log("____pagination", e)}
          />
        </>
      </div>
      {showModal && (
        <div className="container">
          <h3>{updatingId ? "Update" : "Add"} Order Record</h3>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((step, index) => (
                <Step key={step.key}>
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Step {activeStep + 1}
                </Typography>
                {activeStep === 3 ? (
                  <div>
                    <h3>Review Information</h3>
                    <div>
                      <p>Name: {formData?.name}</p>
                      <p>Phone: {formData?.phone}</p>
                      <p>Address: {formData?.address}</p>
                    </div>
                    <hr />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p>qad: {formData?.qad}</p>
                        <p>width: {formData?.width}</p>
                        <p>arm: {formData?.arm}</p>
                        <p>cuff: {formData?.cuff}</p>
                        <p>chest: {formData?.chest}</p>
                      </div>
                      <div>
                        <p>daman: {formData?.daman}</p>
                        <p>collar: {formData?.collar}</p>
                        <p>pant: {formData?.pant}</p>
                        <p>pantCuff: {formData?.pantCuff}</p>
                      </div>
                      <div>
                        <p>frontPocket: {formData?.frontPocket}</p>
                        <p>collarType: {formData?.collarType}</p>
                      </div>
                    </div>
                    <hr />
                    <p>Order: {formData?.order}</p>
                    <div>
                      <input
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
                              <img
                                src={field.label}
                                alt={field.label}
                                style={{ width: "80px", cursor: "pointer" }}
                              />
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
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />

                  <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                  {activeStep === steps.length - 1 && (
                    <button onClick={handleSubmit} className="btn btn-dark">
                      Submit
                    </button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </div>
      )}
    </>
  );
}
