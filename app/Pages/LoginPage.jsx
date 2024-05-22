import React, { useContext, useState } from "react";
import { InputField } from "../components/InputFields";
import apiCall from "../api/ApiCall";
import { jwtDecode } from "jwt-decode";
import { localVariable } from "@/data";
import { AuthContext } from "../Context/AuthContext";

const LoginPage = () => {
  const { setUser, setAccessToken } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [responseErrorMessage, setResponseErrorMessage] = useState();

  const login = () => {
    apiCall("POST", "user/login", { email, password })
      .then((response) => {
        if (response.data.access_token) {
          setAccessToken(response.data.access_token);
          const loggedUser = jwtDecode(response.data.access_token);
          setUser(loggedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              localVariable.accessToken,
              response.data.access_token
            );
            localStorage.setItem(
              localVariable.user,
              JSON.stringify(loggedUser)
            );
          }
        } else setResponseErrorMessage(response.data.error);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };
  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <h1>Login Info</h1>
            <div>
              <p style={{ color: "red" }}>{responseErrorMessage}</p>
              <div data-mdb-input-init className="form-outline mb-4">
                <InputField
                  name="email"
                  label="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div data-mdb-input-init className="form-outline mb-4">
                <InputField
                  name="password"
                  label="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <a href="#">Forgot password?</a>
              <button
                className="btn btn-primary btn-lg btn-block w-100"
                onClick={() => login()}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
