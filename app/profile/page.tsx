"use client";
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { localVariable } from "@/data";
import useAuthorization from "../Hooks/useAuthorization";

function Page() {
  const { user, setUser, setAccessToken } = useContext(AuthContext);
  const logout = () => {
    window.location.replace("/");
    if (typeof window !== "undefined") {
      localStorage.removeItem(localVariable.accessToken);
      localStorage.removeItem(localVariable.user);
    }
    setTimeout(() => {
      setUser(null);
      setAccessToken(null);
    }, 1000);
  };

  useAuthorization(user);
  if (!user) {
    return null;
  }
  return (
    <section className="vh-100" style={{ backgroundColor: "#f4f5f7" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-6 mb-4 mb-lg-0">
            <div className="card mb-3" style={{ borderRadius: ".5rem" }}>
              <div className="row g-0">
                <div
                  className="col-md-4  text-center text-white "
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem",
                    background:
                      "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 8%, rgba(252,176,69,1) 100%)",
                  }}
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="Avatar"
                    className="img-fluid my-5"
                    style={{ width: "80px", marginLeft: 70 }}
                  />
                  <h5>{user?.name}</h5>
                  <p>{user?.role}</p>
                </div>
                <div className="col-md-8">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                      <h6>Information</h6>
                      <a onClick={() => alert("Edit feature will be added...")}>
                        <img
                          src="assets/images/pencil.png"
                          width={30}
                          height={30}
                        />
                      </a>
                    </div>
                    <hr className="mt-0 mb-4" />
                    <div className="row pt-1">
                      <div className="col-6 mb-3">
                        <h6>Email</h6>
                        <p className="text-muted">{user?.email}</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h6>Age</h6>
                        <p className="text-muted">{user?.age}</p>
                      </div>
                    </div>
                    <h6>Projects</h6>
                    <hr className="mt-0 mb-4" />
                    <div className="row pt-1">
                      <div className="col-6 mb-3">
                        <h6>Recent</h6>
                        <p className="text-muted">Lorem ipsum</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h6>Most Viewed</h6>
                        <p className="text-muted">Dolor sit amet</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-dark" onClick={() => logout()}>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
