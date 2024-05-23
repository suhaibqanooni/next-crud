import React from "react";

export const UnAuthorized = () => {
  return (
    <div className="text-center">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src="https://img.freepik.com/free-vector/401-error-unauthorized-concept-illustration_114360-1934.jpg"
          width={400}
          height={400}
        />
      </div>
      <h1>401 unauthorized</h1>
      <h3>You have no access to this page</h3>
    </div>
  );
};

export default UnAuthorized;
