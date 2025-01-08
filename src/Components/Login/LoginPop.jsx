import React from "react";
import { Loader } from "@fluentui/react-northstar";

const LoginPop = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Loader />
    </div>
  );
};

export default LoginPop;
