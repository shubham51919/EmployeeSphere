import React from "react";
import { Button, Dialog, Flex, RadioGroup } from "@fluentui/react-northstar";
import { CloseIcon } from "@fluentui/react-icons-northstar";
import "./TravelServiceRequest.css";


import TravelRadioSelect from "./TravelSelectComponent/TravelRadioSelect";

const TravelServiceRequest = () => {
  return (
    <Dialog
      style={{ height: "90%", width: "70%" }}
      cancelButton="Cancel"
      confirmButton="Confirm"
      content={{
        content: (
          <>
            <TravelRadioSelect />
          </>
        ),
        styles: {
          // keep only 1 scrollbar while zooming
          height: "100%",
          maxHeight: "25rem",
          overflow: "auto",
        },
      }}
      header="Service Request form"
      headerAction={{
        icon: <CloseIcon />,
        title: "Close",
      }}
      trigger={<Button content="Add Service Request" primary />}
    />
  );
};

export default TravelServiceRequest;
