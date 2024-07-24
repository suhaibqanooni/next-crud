import React, { useContext, useState } from "react";
import apiCall from "../api/ApiCall";
import { message } from "antd";
import { Step, StepLabel, Stepper } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { AuthContext } from "../Context/AuthContext";
interface UserCreateFormProps {
  setShowModal: (show: boolean) => void; // Explicitly define the type
  updatingId: number;
  setUpdatingId: (show: any) => void;
  fetchData: any;
  formData: any;
  setFormData: (data: any) => void;
}

function OrderModal({
  setShowModal,
  updatingId,
  setUpdatingId,
  fetchData,
  formData,
  setFormData,
}: UserCreateFormProps) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  let endpoint = "orders";
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
    returnDate: "",
  };

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
    setUpdatingId(null);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prevFormData: any) => ({
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
      addedById: Number(user?.id),
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
  return (
    <div
      className="modal bd-example-modal-xl"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        role="document"
      >
        <div className="modal-content model-large">
          {/* <div className="modal-header flex justify-content-between">
            <h5 className="modal-title">Create New Order</h5>
          </div> */}
          <div className="modal-body">
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
                              <p>Return Date:</p>
                              <input
                                className="form-control"
                                type="date"
                                value={formData.returnDate}
                                id="returnDate"
                                name="returnDate"
                                onChange={(e) =>
                                  handleInputChange(
                                    "returnDate",
                                    e.target.value
                                  )
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
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
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
                                      style={{
                                        width: "80px",
                                        cursor: "pointer",
                                      }}
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
                                  value={formData[field.name]}
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
                        marginTop: activeStep != 3 ? 30 : 0,
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
                        <button
                          onClick={handleSubmit}
                          className="btn btn-success"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
