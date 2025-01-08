import { Flex, FlexItem, Divider, Text } from "@fluentui/react-northstar";
import React from "react";
import { convertUTCtoIST } from "../../../Utilities/utilities";

const AccomodationDetailsForm = ({ steps, item }) => {
  return (
    <>
      <FlexItem>
        <Flex gap="gap.small">
          <Divider vertical color="brand" size={2} />
          <Text
            content={`Step ${steps + 1}: Accomodation Details`}
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
              <Text className="basicDetails__label" content="Check-In Date:" />
            </FlexItem>
            <FlexItem>
              <Text content={convertUTCtoIST(item?.check_in).date} />
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
              <Text className="basicDetails__label" content="Location:" />
            </FlexItem>
            <FlexItem>
              <Text content={item?.accomodation_location} />
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
                content="Preferred Accommodation Location/Hotel:"
              />
            </FlexItem>
            <FlexItem>
              <Text content={item?.accomodation_location} />
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
              <Text
                className="basicDetails__label"
                content="Remark / Instruction(If Any):"
              />
            </FlexItem>
            <FlexItem>
              <Text content={item?.accomodation_remarks} />
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    </>
  );
};

export default AccomodationDetailsForm;
