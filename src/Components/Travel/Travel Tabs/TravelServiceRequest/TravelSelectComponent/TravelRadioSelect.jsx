import React from "react";
import { Flex, RadioGroup } from "@fluentui/react-northstar";
import bothimg from "../../../../../Assets/Travel/Both.svg";
import accomodationimg from "../../../../../Assets/Travel/Accomodation.svg";
import travelimg from "../../../../../Assets/Travel/Travel.svg";

import { Text, Image } from "@fluentui/react-northstar";
const TravelSelectComponent = ({ textheading, imageTravel }) => {
  return (
    <Flex
      column
      style={{
        width: "8rem",
        height: "5rem",
        maxHeight: "10rem",
        maxWidth: "10rem",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "2rem",
        backgroundColor: "transparent",
      }}
    >
      <Image src={imageTravel} />
      <Text>{textheading}</Text>
    </Flex>
  );
};

const TravelRadioSelect = () => {
  return (
    <Flex column style={{ padding: "2.2rem 0rem", background: "transparent" }}>
      <p style={{ textAlign: "center", fontSize: "1rem" }}>
        Select Service Requirement From Below
      </p>
      <Flex
        style={{
          justifyContent: "space-evenly",
          backgroundColor: "transparent",
        }}
      >
        <RadioGroup
          className="radio-travel-pages"
          items={[
            {
              key: "1",
              label: (
                <Flex className="travel-inside-radio">
                  <TravelSelectComponent
                    textheading={"Traveling"}
                    imageTravel={travelimg}
                  />
                </Flex>
              ),
              value: "1",
            },
            {
              key: "2",
              label: (
                <Flex className="travel-inside-radio">
                  <TravelSelectComponent
                    textheading={"Accomodation"}
                    imageTravel={accomodationimg}
                  />
                </Flex>
              ),
              value: "2",
            },
            {
              key: "3",
              label: (
                <Flex className="travel-inside-radio">
                  <TravelSelectComponent
                    textheading={"Both"}
                    imageTravel={bothimg}
                  />
                </Flex>
              ),
              value: "3",
            },
          ]}
        />
      </Flex>
    </Flex>
  );
};

export default TravelRadioSelect;
