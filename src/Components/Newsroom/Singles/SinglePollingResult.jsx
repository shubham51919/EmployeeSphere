import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Flex,
  Text,
  MenuButton,
  Image,
  Divider,
  Loader,
  MoreIcon,
} from "@fluentui/react-northstar";
import { toast } from "react-toastify";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
import adminBadge from "../../../Assets/connectAssets/adminBadge.svg";
import SingleAnimatedDivider from "./SingleAnimatedDivider";
import PollsFooter from "./PollsFooter";
import newsroomApi from "../../../Apis/newsroom";
const SinglePollingResult = ({ type, pollData, onDelete }) => {
  const pollOptions = JSON.parse(pollData?.PollOption);
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const options = pollData.options;
  const existingOptions = new Map();
  options.forEach((opt) => {
    existingOptions.set(opt.option, opt);
  });
  pollOptions.forEach((pollOpt) => {
    if (!existingOptions.has(pollOpt)) {
      options.push({ option: pollOpt, PollPercentage: 0 });
    }
  });

  const highestPercentage = options.reduce((maxPercentage, option) => {
    return option.PollPercentage > maxPercentage
      ? option.PollPercentage
      : maxPercentage;
  }, 0);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const API = newsroomApi(accessToken);

  const handleDelete = async (id) => {
    setDeleteLoader(true);
    try {
      const resposne = await API.post("/deleteAPoll", {
        poll_id: id,
        email: userEmail,
      });
      setDeleteLoader(false);
      toast.success("Deleted Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      onDelete(id);
    } catch (err) {
      toast.error("Something went wrong. Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setDeleteLoader(false);
      console.log(err);
    }
  };

  return (
    <Flex
      column
      style={{
        padding: "1rem",
        border: "1px solid #E1E1E1",
        borderRadius: "0.5rem",
      }}
      gap="gap.small"
    >
      <Flex space="between">
        <Flex gap="gap.small" vAlign="center">
          <AvatarProfilePhoto
            name={pollData.PollAdminName}
            mailId={pollData?.PollAdminEmail}
          />
          <Flex>
            <Flex column>
              <Text
                style={{
                  fontWeight: "600",
                }}
                content={
                  <Flex gap="gap.small" vAlign="center">
                    <Text content={pollData.PollAdminName} />
                    <Image src={adminBadge} />
                  </Flex>
                }
              />
              <Text content={pollData?.PollAdminDepartment} />
            </Flex>
          </Flex>
        </Flex>
        <Flex gap="gap.small" vAlign="center">
          {pollData?.PollAdminEmail === userEmail || type === "admin" ? (
            <>
              {deleteLoader ? (
                <Loader size="small" />
              ) : (
                <MenuButton
                  style={{
                    cursor: "pointer",
                  }}
                  trigger={<MoreIcon />}
                  content="Click"
                  aria-label="Click button"
                  menu={[
                    {
                      content: "Delete",
                      onClick: () => handleDelete(pollData?.pollId),
                    },
                  ]}
                  on="click"
                />
              )}
            </>
          ) : (
            <></>
          )}
        </Flex>
      </Flex>

      <Flex.Item>
        <Text content={pollData?.PollQuestion} />
      </Flex.Item>
      <Flex.Item>
        <Flex column gap="gap.small">
          {options.map((item, index) => {
            return (
              <SingleAnimatedDivider
                width={item?.PollPercentage}
                title={item?.option}
                color={
                  item.PollPercentage === highestPercentage ? "green" : "brand"
                }
              />
            );
          })}
        </Flex>
      </Flex.Item>
      <Divider
        style={{
          width: "100%",
        }}
      />
      <Flex.Item>
        <PollsFooter pollsData={pollData} />
      </Flex.Item>
    </Flex>
  );
};

export default SinglePollingResult;
