import { Avatar, Flex, FlexItem, Text } from "@fluentui/react-northstar";
import { useSelector } from 'react-redux';
import React from "react";

const NewComment = ({ newComment }) => {
  const { posting, commentContent, name } = newComment;

  const profilePhoto = useSelector((state) => {
    return state.authReducer.profilePhoto;
  });
  return (
    <Flex gap="gap.small">
      <FlexItem>
        <Avatar image={profilePhoto} />
      </FlexItem>
      <FlexItem>
        <Flex
          column
          style={{
            backgroundColor: "#F8F8F8",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            flexGrow: 1,
          }}
        >
          <FlexItem>
            <Flex>
              <Text content={name} style={{ fontWeight: "bold" }} />
              {posting && <Text content="Posting..." />}
            </Flex>
          </FlexItem>
          <FlexItem>
            <Text content={commentContent} />
          </FlexItem>
        </Flex>
      </FlexItem>
    </Flex>
  );
};

export default NewComment;
