import React, { useEffect, useState } from "react";
import {
  Flex,
  FlexItem,
  Text,
  Divider,
  SendIcon,
  MoreIcon,
  Loader,
  MenuButton,
  Input,
  Image,
} from "@fluentui/react-northstar";

import adminBadge from "../../../Assets/connectAssets/adminBadge.svg";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
import { capitalizeFirstLetter } from "../../../Utilities/utilities";
import PollSkeleton from "../../../Utilities/PollSkeleton";
import SingleChoice from "./SingleChoice";
import QnAFooter from "./QnAFooter";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";

const QuestionType = {
  OpenEnded: "Open Ended",
  MultiChoice: "Multi Choice",
  SingleChoice: "Single Choice",
};

const SingleQna = ({ myPosts, type, id, getQnA, onDelete }) => {
  const [responseData, setResponseData] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [openEndedResponse, setOpenEndedResponse] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(false);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const formReducer = useSelector((state) => state.formReducer);

  const { loggedInUserDetails } = formReducer;
  const { FirstName, LastName } = loggedInUserDetails;

  const newsroomAPI = newsroomApi(accessToken);

  const handleChange = (e, option) => {
    setSelectedOption(option.value);
  };
  const getQuestion = async () => {
    setLoading(true);
    try {
      const resposne = await newsroomAPI.post("/getAQuestionAnswers", {
        question_id: id,
        mail: userEmail,
      });
      setResponseData(resposne.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getQuestion();
  }, []);
  const oneQuestion = responseData?.data[0];

  // ********** DELETE A QUESTION **********
  const handleDelete = async (id) => {
    setDeleteLoader(true);
    try {
      const resposne = await newsroomAPI.post("/deleteQuestion", {
        question_id: id,
        email: userEmail,
      });
      setDeleteLoader(false);
      toast.success("Deleted Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      onDelete(id);
    } catch (err) {
      setDeleteLoader(false);
      toast.error("Something went wrong. Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (
      oneQuestion.questionType === QuestionType.SingleChoice &&
      selectedOption.length === 0
    ) {
      return;
    }
    if (
      oneQuestion.questionType === QuestionType.OpenEnded &&
      openEndedResponse.length === 0
    ) {
      return;
    }

    try {
      const resposne = await newsroomAPI.post("/addResponse", {
        question_id: id,
        email: userEmail,
        response:
          oneQuestion.questionType === QuestionType.SingleChoice
            ? selectedOption
            : openEndedResponse,
        name: `${FirstName} ${LastName}`,
      });
      getQuestion();
      toast.success("Answer submitted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenEndedResponse("");
      setSelectedOption("");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const renderInputBasedOnQuestionOptions = () => {
    switch (oneQuestion.questionType) {
      case QuestionType.OpenEnded:
        return (
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Enter your answer..."
            disabled={oneQuestion?.response}
            value={
              oneQuestion?.response === null
                ? openEndedResponse
                : oneQuestion?.response
            }
            onChange={(e) => setOpenEndedResponse(e.target.value)}
            icon={
              <SendIcon
                onClick={handleSubmit}
                style={{
                  cursor: "pointer",
                }}
              />
            }
          />
        );
      case QuestionType.SingleChoice:
        return (
          <SingleChoice
            options={JSON.parse(oneQuestion.questionOptions)}
            questionData={oneQuestion}
            handleChange={handleChange}
          />
        );
      default:
        return null; // Return null for unknown or unsupported question types
    }
  };

  return loading ? (
    <PollSkeleton />
  ) : (
    <>
      <Flex
        column
        style={{
          border: "1px solid #E1E1E1",
          padding: "1rem",
          borderRadius: "4px",
          gap: "1rem",
        }}
      >
        <Flex space="between">
          <Flex gap="gap.small" vAlign="center">
            <AvatarProfilePhoto
              mailId={oneQuestion?.adminMail}
              name={oneQuestion?.adminName}
            />
            <Flex column>
              <Flex gap="gap.small">
                <Text
                  style={{
                    fontWeight: "600",
                  }}
                  content={oneQuestion?.adminName}
                />
                <Image src={adminBadge} />
              </Flex>
              <Text content={oneQuestion?.adminDepartment} />
            </Flex>
          </Flex>
          <Flex gap="gap.small" vAlign="center">
            {oneQuestion?.adminMail === userEmail || type === "admin" ? (
              <>
                {deleteLoader ? (
                  <Loader size="small" />
                ) : (
                  <MenuButton
                    trigger={
                      <MoreIcon
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    }
                    content="Click"
                    aria-label="Click button"
                    menu={[
                      {
                        content: "Delete",
                        onClick: () => handleDelete(oneQuestion?.question_id),
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
        <FlexItem>
          <Flex column gap="gap.small">
            <FlexItem>
              <Text content={capitalizeFirstLetter(oneQuestion?.question)} />
            </FlexItem>
            <FlexItem>
              <Flex column>
                {
                  // Render input based on question type
                  renderInputBasedOnQuestionOptions()
                }
              </Flex>
            </FlexItem>
          </Flex>
        </FlexItem>
        {
          // Render responses based on question type if open ended
          oneQuestion.questionType !== QuestionType.OpenEnded && (
            <FlexItem>
              <Divider />
            </FlexItem>
          )
        }
        {
          // Render responses based on question type
          oneQuestion.questionType === QuestionType.SingleChoice && (
            <QnAFooter
              type={type}
              questionData={oneQuestion}
              handleSubmit={handleSubmit}
            />
          )
        }
        {
          // Render responses based on question type if poll
        }
      </Flex>
    </>
  );
};

export default SingleQna;
