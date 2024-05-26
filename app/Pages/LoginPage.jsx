import React, { useContext, useState } from "react";
import { InputField } from "../components/InputFields";
import apiCall from "../api/ApiCall";
import { jwtDecode } from "jwt-decode";
import { localVariable } from "@/data";
import { AuthContext } from "../Context/AuthContext";
import { Loader } from "../components/Loader";
import { storeInLocalStorage } from "../Context/Actions";
const LoginPage = () => {
  const { setUser, setAccessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [responseErrorMessage, setResponseErrorMessage] = useState();

  const login = () => {
    if (!email || !password)
      return setResponseErrorMessage("Please provide both email and password");
    setLoading(true);
    apiCall("POST", "user/login", { email, password })
      .then((response) => {
        setLoading(false);
        if (response.data.access_token) {
          setAccessToken(response.data.access_token);
          const loggedUser = jwtDecode(response.data.access_token);
          setUser(loggedUser);
          storeInLocalStorage(
            localVariable.accessToken,
            response.data.access_token
          );
          storeInLocalStorage(localVariable.user, JSON.stringify(loggedUser));
        } else setResponseErrorMessage(response.data.error);
      })
      .catch((error) => {
        console.log("Error", error);
        setLoading(false);
      });
  };

  return (
    <section class="vh-100 gradient-custom">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/46/PGL_Logo.png"
                width={200}
                height={200}
              />
            </div>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              class="img-fluid"
              alt="Sample image"
            ></img>
          </div>
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              class="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div class="card-body p-5 text-center">
                <div class="mb-md-5 mt-md-4 pb-5">
                  <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                  <p class="text-white-50 mb-5">
                    Please enter your login and password!
                  </p>

                  <p style={{ color: "red" }}>{responseErrorMessage}</p>
                  <div data-mdb-input-init className="form-outline mb-4">
                    <InputField
                      type="email"
                      name="email"
                      value={email}
                      label="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div data-mdb-input-init className="form-outline mb-4">
                    <InputField
                      name="password"
                      label="Password"
                      value={password}
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <p class="small mb-5 pb-lg-2">
                    <a class="text-white-50" href="#!">
                      Forgot password?
                    </a>
                  </p>

                  <button
                    disabled={loading}
                    class="btn btn-outline-light btn-lg px-5"
                    onClick={() => login()}
                  >
                    {loading ? <Loader /> : "Sign in"}
                  </button>

                  <div class="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#" class="text-white">
                      <i class="fab fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="#" class="text-white">
                      <i class="fab fa-twitter fa-lg mx-4 px-2"></i>
                    </a>
                    <a href="#" class="text-white">
                      <i class="fab fa-google fa-lg"></i>
                    </a>
                  </div>
                </div>

                <div>
                  <p class="mb-0">
                    Don&apos;t have an account?
                    <a href="#" class="text-white-50 fw-bold">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
