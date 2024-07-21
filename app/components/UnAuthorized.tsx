import { Result } from "antd";
import React from "react";

export const UnAuthorized = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <a className="btn btn-dark" href="/">
          GO BACK
        </a>
      }
    />
  );
};

export default UnAuthorized;
