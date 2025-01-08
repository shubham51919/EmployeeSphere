import {
  AcceptIcon,
  Button,
  CloseIcon,
  Dropdown,
  Flex,
  FlexItem,
  Image,
  Input,
  Text,
} from "@fluentui/react-northstar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import travelAdminApi from "../../../Apis/travelApi";
import { toast } from "react-toastify";
import PollSkeleton from "../../../Utilities/PollSkeleton";
const ServiceRequestForm = ({ id, serviceType }) => {
  const items = ["Under Process", "Resolved", "Rejected"];
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [remark, setRemark] = useState(null);
  const [serviceRequestIsSaving, setServiceRequestIsSaving] = useState(false);
  const { accessToken, userEmail } = useSelector((state) => state.authReducer);
  const processTravelRequest = travelAdminApi(accessToken);
  const handleSaveClick = async () => {
    setServiceRequestIsSaving(true);
    const data = {
      id: id,
      status: selectedItem,
      remark: remark,
      mail: userEmail,
    };
    try {
      const response = await processTravelRequest.post(
        "/processTravelRequest",
        data
      );
      toast.success("Status Updated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setServiceRequestIsSaving(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setServiceRequestIsSaving(false);
    }
  };

  return serviceRequestIsSaving ? (
    <PollSkeleton />
  ) : (
    <Flex
      gap="gap.small"
      style={{
        width: "100%",
        borderBottom: "1px solid #DEDEDE",
        paddingBottom: "1rem",
      }}
      column
    >
      <FlexItem>
        <Flex
          gap="gap.small"
          style={{
            width: "100%",
          }}
        >
          <FlexItem>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M10.5925 17.4664L8.16321 17.9754C8.02487 18.0049 7.88396 18.0208 7.7425 18.0229C7.203 18.0213 6.68596 17.8067 6.30393 17.4257C6.06411 17.1865 5.88813 16.891 5.79211 16.5661C5.69608 16.2413 5.68308 15.8976 5.75429 15.5664L6.26321 13.1371C6.34169 12.7475 6.53556 12.3905 6.81964 12.1125L13.205 5.72714C13.3191 5.614 13.4416 5.50965 13.5714 5.415V2.03571C13.5698 1.4963 13.3548 0.979448 12.9734 0.598027C12.592 0.216605 12.0751 0.00161099 11.5357 0H2.03571C1.4963 0.00161099 0.979448 0.216605 0.598027 0.598027C0.216605 0.979448 0.00161099 1.4963 0 2.03571V16.9643C0.00161099 17.5037 0.216605 18.0206 0.598027 18.402C0.979448 18.7834 1.4963 18.9984 2.03571 19H11.5357C12.0751 18.9984 12.592 18.7834 12.9734 18.402C13.3548 18.0206 13.5698 17.5037 13.5714 16.9643V14.9557L11.6171 16.91C11.3392 17.1941 10.9821 17.388 10.5925 17.4664ZM3.39286 2.71429H10.1786C10.3585 2.71429 10.5311 2.78578 10.6584 2.91303C10.7857 3.04029 10.8571 3.21289 10.8571 3.39286C10.8571 3.57283 10.7857 3.74542 10.6584 3.87268C10.5311 3.99994 10.3585 4.07143 10.1786 4.07143H3.39286C3.21289 4.07143 3.04029 3.99994 2.91303 3.87268C2.78578 3.74542 2.71429 3.57283 2.71429 3.39286C2.71429 3.21289 2.78578 3.04029 2.91303 2.91303C3.04029 2.78578 3.21289 2.71429 3.39286 2.71429ZM3.39286 5.42857H10.1786C10.3585 5.42857 10.5311 5.50006 10.6584 5.62732C10.7857 5.75458 10.8571 5.92717 10.8571 6.10714C10.8571 6.28711 10.7857 6.45971 10.6584 6.58697C10.5311 6.71422 10.3585 6.78571 10.1786 6.78571H3.39286C3.21289 6.78571 3.04029 6.71422 2.91303 6.58697C2.78578 6.45971 2.71429 6.28711 2.71429 6.10714C2.71429 5.92717 2.78578 5.75458 2.91303 5.62732C3.04029 5.50006 3.21289 5.42857 3.39286 5.42857ZM2.71429 8.82143C2.71429 8.64146 2.78578 8.46886 2.91303 8.34161C3.04029 8.21435 3.21289 8.14286 3.39286 8.14286H6.10714C6.28711 8.14286 6.45971 8.21435 6.58697 8.34161C6.71422 8.46886 6.78571 8.64146 6.78571 8.82143C6.78571 9.0014 6.71422 9.17399 6.58697 9.30125C6.45971 9.42851 6.28711 9.5 6.10714 9.5H3.39286C3.21289 9.5 3.04029 9.42851 2.91303 9.30125C2.78578 9.17399 2.71429 9.0014 2.71429 8.82143Z"
                fill="#494CA8"
              />
              <path
                d="M17.0474 6.68396C16.6596 6.31381 16.144 6.1073 15.6078 6.1073C15.0717 6.1073 14.5561 6.31381 14.1683 6.68396L7.77612 13.0754C7.68327 13.1683 7.61939 13.2862 7.59222 13.4147L7.08194 15.8447C7.06114 15.9434 7.06265 16.0456 7.08634 16.1437C7.11004 16.2419 7.15532 16.3335 7.2189 16.4119C7.28248 16.4903 7.36276 16.5535 7.45387 16.5969C7.54498 16.6404 7.64464 16.663 7.74558 16.663C7.79257 16.6631 7.83944 16.6581 7.88537 16.6481L10.3153 16.1371C10.4438 16.11 10.5617 16.0461 10.6546 15.9532L17.0461 9.56246C17.2352 9.37342 17.3851 9.14899 17.4875 8.90198C17.5898 8.65498 17.6424 8.39023 17.6424 8.12287C17.6424 7.85551 17.5898 7.59076 17.4875 7.34375C17.3851 7.09675 17.2352 6.87232 17.0461 6.68328L17.0474 6.68396Z"
                fill="#494CA8"
              />
            </svg>
          </FlexItem>
          <FlexItem>
            <Flex
              style={{
                width: "100%",
              }}
              column
            >
              <FlexItem>
                <Flex
                  space="between"
                  style={{
                    width: "100%",
                  }}
                >
                  <Text
                    content="Service Request Form"
                    style={{
                      fontWeight: "600",
                    }}
                  />
                  <Dropdown
                    items={items}
                    activeSelectedIndex={selectedItem}
                    placeholder="Select Status"
                    getA11ySelectionMessage={{
                      onAdd: (item) => setSelectedItem(item),
                    }}
                  />
                </Flex>
              </FlexItem>
              <FlexItem>
                <Text content={`Service Type: ${serviceType}`} />
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </FlexItem>
      <FlexItem>
        <Flex
          gap="gap.small"
          column
          style={{
            width: "80%",
          }}
        >
          <Input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Add Remark (Optional)"
            inverted
            style={{
              border: "1px solid #D5D5D5",
            }}
          />
          <Flex gap="gap.small">
            <Button
              onClick={handleSaveClick}
              className="service-request-admin-form-button"
              content="Save"
              iconPosition="left"
              icon={
                <AcceptIcon
                  style={{
                    color: "#2F8E40",
                  }}
                />
              }
            />
            <Button
              className="service-request-admin-form-button"
              content="Don't Save"
              iconPosition="left"
              icon={
                <CloseIcon
                  style={{
                    color: "#A4262C",
                  }}
                />
              }
            />
          </Flex>
        </Flex>
      </FlexItem>
    </Flex>
  );
};

export default ServiceRequestForm;
