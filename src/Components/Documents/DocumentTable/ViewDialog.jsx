import React from "react";
import { Dialog, Button, EyeIcon } from "@fluentui/react-northstar";
const ViewDialog = () => {
  return (
    <Dialog
      trigger={
        <EyeIcon
          style={{
            cursor: "pointer",
          }}
        />
      }
    />
  );
};

export default ViewDialog;
