import React, { useState } from "react";
import "./ProgressBar.css"; // Import your CSS file
import bullet from "../../../../../Assets/Travel/GroupTrackedActive.svg";
import check from "../../../../../Assets/Travel/check.svg";
import { Flex } from "@fluentui/react-northstar";

const ServiceType = {
  Travel: "Travel",
  Accommodation: "Accommodation",
  TravelAndAccommodation: "Travel&Accommodation",
};

const ProgressBar = ({ activeIdx, item }) => {
  // const [activeIdx, setactiveIdx] = useState(activeIdx);
  let progressPoints = [];
  let progressSteps = [];

  switch (item?.serviceType) {
    case ServiceType.Travel:
      progressPoints = [0, 1, 2];
      progressSteps = ["Basic Details", "Travel Details"];
      break;
    case ServiceType.Accommodation:
      progressPoints = [0, 1, 3];
      progressSteps = ["Basic Details", "Accommodation Details"];
      break;
    case ServiceType.TravelAndAccommodation:
      progressPoints = [0, 1, 2, 3];
      progressSteps = [
        "Basic Details",
        "Travel Details",
        "Accommodation Details",
      ];
      break;
    default:
      progressPoints = [0, 1, 2];
      progressSteps = ["Basic Details", "Travel Details"];
      break;
  }

  return (
    <Flex
      column
      style={{
        backgroundColor: "transparent",
        flexGrow: "1",
      }}
    >
      <div id="progress__base">
        <div
          id="progress__bar"
          style={{
            width: `${(100 * (activeIdx + 1)) / (progressPoints.length - 1)}%`,
          }}
        ></div>
        <div
          id="progress__bar__no_progress"
          style={{
            width: `${
              100 - (100 * (activeIdx + 1)) / (progressPoints.length - 1)
            }%`,
          }}
        ></div>
        {progressPoints.map((point, index) => (
          <div
            key={index}
            className={`progress__bullet ${
              index <= activeIdx ? "active" : ""
            } ${index < activeIdx ? "completed" : ""}`}
          >
            {index === activeIdx && (
              <img
                className=" current active"
                src={bullet}
                alt="myimage"
                style={{ height: "100%" }}
              />
            )}
            {index < activeIdx && (
              <img
                className=" current active"
                src={check}
                alt="myimage"
                style={{
                  height: "100%",
                  backgroundColor: "#494cab",
                  borderRadius: "50%",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="steps-container">
        {progressSteps.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${100 / (progressPoints.length - 1)}%` }}
          >
            <p className="title">{item}</p>
            <p className="steps">Step : {idx + 1}</p>
          </div>
        ))}
      </div>
    </Flex>
  );
};

export default ProgressBar;
