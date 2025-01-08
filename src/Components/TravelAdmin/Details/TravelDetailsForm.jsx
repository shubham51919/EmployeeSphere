import React, { useState } from "react";
import {
  Flex,
  FlexItem,
  Text,
  RadioGroup,
  Input,
  Divider,
} from "@fluentui/react-northstar";
import { convertUTCtoIST } from "../../../Utilities/utilities";
const TravelDetailsForm = ({ steps, item }) => {
  const tripDetails = item?.travel_details;
  return (
    <>
      <FlexItem>
        <Flex gap="gap.small">
          <Divider vertical color="brand" size={2} />
          <Text
            content={`Step ${steps + 1}: Travel Details`}
            style={{
              fontWeight: "600",
              fontSize: "1 rem",
            }}
          />
        </Flex>
      </FlexItem>
      <Flex
        column
        gap="gap.medium"
        style={{
          overflow: "auto",
          height: "calc(100%-100px)",
        }}
      >
        <FlexItem>
          <Flex
            gap="gap.small"
            style={{
              gap: `1.5rem`,
            }}
          >
            <FlexItem>
              <Text className="basicDetails__label" content="Travel Type:" />
            </FlexItem>
            <FlexItem>
              <RadioGroup
                defaultCheckedValue={item?.travel_type}
                items={[
                  {
                    key: "Domestic",
                    label: "Domestic",
                    value: "Domestic",
                    disabled: true,
                  },
                  {
                    key: "International",
                    label: "International",
                    value: "International",
                    disabled: "true",
                  },
                ]}
              />
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <Flex
            gap="gap.small"
            style={{
              gap: `1.5rem`,
            }}
          >
            <FlexItem>
              <Text className="basicDetails__label" content="Transport:" />
            </FlexItem>
            <FlexItem>
              <RadioGroup
                defaultCheckedValue={item?.transport}
                items={[
                  {
                    key: "Train",
                    label: "Train",
                    value: "Train",
                    disabled: true,
                  },
                  {
                    key: "Flight",
                    label: "Flight",
                    value: "Flight",
                    disabled: "true",
                  },
                ]}
              />
            </FlexItem>
          </Flex>
        </FlexItem>{" "}
        <FlexItem>
          <Flex
            gap="gap.small"
            style={{
              gap: `1.5rem`,
            }}
          >
            <FlexItem>
              <Text className="basicDetails__label" content="Trip" />
            </FlexItem>
            <FlexItem>
              <RadioGroup
                defaultCheckedValue={item?.trip_type}
                items={[
                  {
                    key: "One Way",
                    label: "One Way",
                    value: "One Way",
                    disabled: true,
                  },
                  {
                    key: "Round Trip",
                    label: "Round Trip",
                    value: "Round Trip",
                    disabled: "true",
                  },
                  {
                    key: "Mulit-City",
                    label: "Multi City",
                    value: "Multi-City",
                    disabled: "true",
                  },
                ]}
              />
            </FlexItem>
          </Flex>
        </FlexItem>{" "}
        <FlexItem>
          <Flex
            gap="gap.small"
            style={{
              gap: `1.5rem`,
            }}
          >
            <FlexItem>
              <Text className="basicDetails__label" content="Travel From" />
            </FlexItem>
            <FlexItem>
              <Flex
                style={{
                  flexGrow: 1,
                }}
              >
                {item?.trip_type !== "Multi-City" ? (
                  <Text content="Gandhi Nagar, Jaipur,Rajasthan" />
                ) : (
                  <Flex
                    column
                    gap="gap.small"
                    style={{
                      flexGrow: 1,
                    }}
                  >
                    {tripDetails?.map((item, index) => (
                      <FlexItem key={item?.id}>
                        <Flex column gap="gap.small">
                          <FlexItem>
                            <Text content={`City ${index + 1}`} />
                          </FlexItem>
                          <FlexItem>
                            <Flex gap="gap.large">
                              <FlexItem>
                                <Text
                                  content="Departure Date"
                                  className="multicity_label"
                                />
                              </FlexItem>
                              <FlexItem>
                                <Text
                                  content={
                                    convertUTCtoIST(item?.Departure_date).date
                                  }
                                />
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex gap="gap.large">
                              <FlexItem>
                                <Text
                                  content="Travel From"
                                  className="multicity_label"
                                />
                              </FlexItem>
                              <FlexItem>
                                <Text content={item?.travel_from} />
                              </FlexItem>
                              <FlexItem>
                                <Text
                                  content="Travel To"
                                  className="multicity_label"
                                />
                              </FlexItem>
                              <FlexItem>
                                <Text content={item?.travel_to} />
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                          <Divider size={2} />
                        </Flex>
                      </FlexItem>
                    ))}
                  </Flex>
                )}
              </Flex>
            </FlexItem>
          </Flex>
        </FlexItem>
        {item?.trip_type !== "Multi-City" && (
          <>
            <FlexItem>
              <Flex
                gap="gap.small"
                style={{
                  gap: `1.5rem`,
                }}
              >
                <FlexItem>
                  <Text className="basicDetails__label" content="Travel To" />
                </FlexItem>
                <FlexItem>
                  <Flex>
                    <Text content="Mumbai" />
                  </Flex>
                </FlexItem>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Flex
                gap="gap.small"
                style={{
                  gap: `1.5rem`,
                }}
              >
                <FlexItem>
                  <Text
                    className="basicDetails__label"
                    content="Departure Date:"
                  />
                </FlexItem>
                <FlexItem grow="0.5">
                  <Flex space="between">
                    <Text content="01/01/2021" />
                    {item?.trip_type === "Round Trip" && (
                      <Text content={`Return Date: 20/01/2003`} />
                    )}
                  </Flex>
                </FlexItem>
              </Flex>
            </FlexItem>
          </>
        )}
        <FlexItem>
          <Flex
            gap="gap.small"
            style={{
              gap: `1.5rem`,
            }}
          >
            <FlexItem>
              <Text
                className="basicDetails__label"
                content="Add Remark,if any"
              />
            </FlexItem>
            <FlexItem>
              <Flex>
                <Text content={item?.travel_remarks} />
              </Flex>
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    </>
  );
};

export default TravelDetailsForm;
