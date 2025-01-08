import { Button, Flex } from "@fluentui/react-northstar";
import ProgressBar from "../Travel/Travel Tabs/TravelServiceRequest/TravelSelectComponent/ProgressBar";
import { useEffect, useState } from "react";
import BasicDetailsForm from "./Details/BasicDetailsForm";
import TravelDetailsForm from "./Details/TravelDetailsForm";
import AccomodationDetailsForm from "./Details/AccomodationDetailsForm";
import travelAdminApi from "../../Apis/travelApi";
import { useSelector } from "react-redux";

const Details = ({ item }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNextClick = () => {
    if (activeIdx < 2) {
      setActiveIdx(activeIdx + 1);
    }
  };

  const handleBackClick = () => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  };

  let currentForm = null;

  switch (item?.serviceType) {
    case "Travel&Accommodation":
      if (activeIdx === 0) {
        currentForm = <BasicDetailsForm steps={activeIdx} item={item} />;
      } else if (activeIdx === 1) {
        currentForm = <TravelDetailsForm steps={activeIdx} item={item} />;
      } else if (activeIdx === 2) {
        currentForm = <AccomodationDetailsForm steps={activeIdx} item={item} />;
      }
      break;
    case "Travel":
      if (activeIdx === 0) {
        currentForm = <BasicDetailsForm steps={activeIdx} item={item} />;
      } else if (activeIdx === 1) {
        currentForm = <TravelDetailsForm steps={activeIdx} item={item} />;
      }
      break;
    case "Accommodation":
      if (activeIdx === 0) {
        currentForm = <BasicDetailsForm steps={activeIdx} item={item} />;
      } else if (activeIdx === 1) {
        currentForm = <AccomodationDetailsForm steps={activeIdx} item={item} />;
      }
      break;
    default:
      currentForm = null;
  }

  return (
    <Flex
      column
      gap="gap.large"
      style={{
        height: "100%",
        overflowY: "auto",
        width: "100%",
      }}
    >
      <Flex>
        <ProgressBar activeIdx={activeIdx} item={item} />
      </Flex>
      {currentForm}
      <Flex
        gap="gap.small"
        style={{
          alignSelf: "flex-end",
        }}
      >
        {activeIdx > 0 && (
          <Button
            content="Back"
            onClick={handleBackClick}
            style={{
              alignSelf: "flex-end",
            }}
          />
        )}
        {activeIdx < 2 && (
          <Button
            content="Next"
            onClick={handleNextClick}
            primary
            style={{
              alignSelf: "flex-end",
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default Details;
