import React from "react";
import {
  Flex,
  FlexItem,
  Text,
  RadioGroup,
  Input,
  Divider,
} from "@fluentui/react-northstar";
import { convertUTCtoIST } from "../../../Utilities/utilities";
const BasicDetailsForm = ({ steps, item }) => {
  const getItems = () => [
    {
      name: "High",
      key: "High",
      label: "High",
      value: "High",
    },
    {
      name: "Medium",
      key: "Medium",
      label: "Medium",
      value: "Medium",
    },
    {
      name: "Low",
      key: "Low",
      label: "Low",
      value: "Low",
    },
  ];
  return (
    <>
      <FlexItem>
        <Flex gap="gap.small">
          <Divider vertical color="brand" size={2} />
          <Text
            content={`Step ${steps + 1}: Basic Details`}
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
              <Text className="basicDetails__label" content="HRM ID :" />
            </FlexItem>
            <FlexItem>
              <Text content={item?.hrm_id} />
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
              <Text className="basicDetails__label" content="Full Name :" />
            </FlexItem>
            <FlexItem>
              <Text content={item?.employee_name} />
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
                content="Employee Full Name (As per Gov ID):"
              />
            </FlexItem>
            <FlexItem>
              <Text content={item?.name_as_per_government} />
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
              <Text className="basicDetails__label" content="Department:" />
            </FlexItem>
            <FlexItem>
              <Text content={item?.department} />
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
              <Text className="basicDetails__label" content="Date of Birth:" />
            </FlexItem>
            <FlexItem>
              <Text content={convertUTCtoIST(item?.DOB).date} />
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
              <Text className="basicDetails__label" content="Mobile No.:" />
            </FlexItem>
            <FlexItem>
              <Text content={item?.mobile_number} />
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
              <Text className="basicDetails__label" content="Office Mail ID:" />
            </FlexItem>
            <FlexItem>
              <Text content={item?.office_mail_id} />
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
              <Text className="basicDetails__label" content="Urgency:" />
            </FlexItem>
            <FlexItem>
              <RadioGroup defaultCheckedValue="High" items={getItems()} />
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
              <Text className="basicDetails__label" content="Travel Purpose:" />
            </FlexItem>
            <FlexItem>
              <Text
                content={
                  item?.travel_purpose === null ? "NA" : item?.travel_purpose
                }
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
              <Text
                className="basicDetails__label"
                content="Explain Purpose in details:"
              />
            </FlexItem>
            <FlexItem>
              <Text
                content={
                  item?.travel_remarks === null ? "NA" : item?.travel_remarks
                }
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
              <Text className="basicDetails__label" content="CRM ID:" />
            </FlexItem>
            <FlexItem>
              <Text content={item?.CRMId === null ? "NA" : item?.CRMId} />
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
              <Text className="basicDetails__label" content="Project Head:" />
            </FlexItem>
            <FlexItem>
              <Text
                content={item?.projectHead === null ? "NA" : item?.projectHead}
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
              <Text
                className="basicDetails__label"
                content="Project Details:"
              />
            </FlexItem>
            <FlexItem>
              <Text
                content={
                  item?.projectDetails === null ? "NA" : item?.projectDetails
                }
              />
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    </>
  );
};

export default BasicDetailsForm;
