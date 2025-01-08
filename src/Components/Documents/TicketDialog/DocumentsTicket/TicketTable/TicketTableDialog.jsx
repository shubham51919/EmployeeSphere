import { Dialog, EyeIcon } from "@fluentui/react-northstar";
import React from "react";

const TicketTableDialog = () => {
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

export default TicketTableDialog;
