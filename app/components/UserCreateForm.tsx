import React, { useState } from "react";
import { InputField, InputSelectField } from "./InputFields";
import { userRolesOptions } from "@/data";
import apiCall from "../api/ApiCall";
import { Loader } from "./Loader";
import { message } from "antd";

function UserCreateForm({ setShowUserModal }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    age: 0,
    password: "",
  });
  const addRecord = () => {
    setLoading(true);
    apiCall("POST", "user", formData)
      .then((result) => {
        setShowUserModal(false);
        message.success("User created successfully");
      })
      .catch((err) => {
        console.log("____", err.response);
        setLoading(false);
        if (err.response.data.statusCode === 403)
          setErrorMessage("You Dont have permission to perform this action");
        else setErrorMessage(err.response.data.message[0]);
      });
  };
  return (
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
            <h5 className="modal-title">Add new</h5>
          </div>
          <div className="modal-body">
            <p style={{ color: "red" }}>{errorMessage}</p>
            <InputField
              name="name"
              label="Name"
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
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  email: e.target.value,
                }));
              }}
            />
            <InputField
              name="age"
              label="age"
              type="number"
              value={formData.age}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  age: Number(e.target.value),
                }));
              }}
            />

            <InputSelectField
              name="role"
              label="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  role: e.target.value,
                }))
              }
              options={userRolesOptions}
            />

            <InputField
              name="password"
              label="Password"
              type="text"
              value={formData.password}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          <div className="modal-footer">
            {loading ? (
              <Loader />
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowUserModal(false);
                    setFormData({
                      name: "",
                      email: "",
                      age: 0,
                      role: "",
                      password: "",
                    });
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => addRecord()}
                >
                  Add
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCreateForm;
