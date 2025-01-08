import { Avatar, Button, Flex, Text } from "@fluentui/react-northstar";
import React, { useState, useEffect } from "react";
import { formatTimeDifference } from "../../../Utilities/utilities";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";

const PollsFooter = ({ pollsData }) => {
  const avatars = pollsData?.PollTop3Mail?.split(",");

  return (
    <Flex space="between">
      <Flex vAlign="center" gap="gap.smaller">
        <Flex className="avatar-group">
          {avatars?.map((avatarLink, index) => (
            <AvatarProfilePhoto mailId={avatarLink} key={index} />
          ))}
        </Flex>
        <Flex>
          <Flex gap="gap.smaller">
            <Flex>
              <Text content={`${pollsData.TotalVotesOnPoll} Answers •`} />
            </Flex>
            <Flex>
              <span className="total-answers">
                Added {formatTimeDifference(pollsData.PollCreatedOn)} ago
              </span>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {/* <Text
        content={`Expires in: ${formatTimeDifference(
          pollsData?.PollExpiryTime
        )}`}
      /> */}
    </Flex>
  );
};

export default PollsFooter;
