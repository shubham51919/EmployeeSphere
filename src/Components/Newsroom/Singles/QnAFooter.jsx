import { Avatar, Button, Flex, Text } from "@fluentui/react-northstar";
import React from "react";
import { formatTimeDifference } from "../../../Utilities/utilities";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
import AnswersDialog from "./AnswersDialog";

const QnAFooter = ({ type, questionData, handleSubmit }) => {
  const avatars = questionData?.top3Mails?.split(",");
  return (
    <Flex space="between">
      <Flex vAlign="center" gap="gap.smaller">
        <div className="avatar-group">
          {avatars?.map((avatarLink, index) => (
            <AvatarProfilePhoto mailId={avatarLink} />
          ))}
        </div>
        <Flex>
          <Flex gap="gap.smaller">
            <Flex>
              {type == "admin" ? (
                <AnswersDialog
                  ques_data={questionData}
                  numberAns={questionData.totalAnswers}
                />
              ) : (
                <Text content={`${questionData.totalAnswers} Answers •`} />
              )}
            </Flex>
            <Flex>
              <span className="total-answers">
                Added {formatTimeDifference(questionData.created_at)} ago
              </span>
            </Flex>
          </Flex>

        </Flex>
      </Flex>
      <Button
        primary
        onClick={handleSubmit}
        content="Answer"
        disabled={questionData?.response !== null}
      />

    </Flex>
  );
};

export default QnAFooter;
