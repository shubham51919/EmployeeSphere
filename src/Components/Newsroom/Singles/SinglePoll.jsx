import {
  Divider,
  Flex,
  FlexItem,
  Image,
  Loader,
  MenuButton,
  MoreIcon,
  RadioGroup,
  Text,
} from "@fluentui/react-northstar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import newsroomApi from "../../../Apis/newsroom";
import adminBadge from "../../../Assets/connectAssets/adminBadge.svg";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
import PollSkeleton from "../../../Utilities/PollSkeleton";
import PollsFooter from "./PollsFooter";
import SinglePollingResult from "./SinglePollingResult";

const SinglePoll = ({ myPosts, type, id, onDelete }) => {
  const [pollData, setPollData] = useState([]);
  const [pollLoader, setPollLoader] = useState(false);
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  let data = {
    mail: userEmail,
    poll_id: id,
  };

  const API = newsroomApi(accessToken);

  const getSinglePoll = async () => {
    try {
      const response = await API.post("/getAPollPercentage", data);
      setPollData(response.data.data.finalData);
    } catch (err) {
      console.log(err);
    } finally {
      setPollLoader(false);
    }
  };

  const [deleteLoader, setDeleteLoader] = useState(false);

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
      setDeleteLoader(false);
      console.log(err);
      toast.error("Something went wrong. Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleChange = (e, option) => {
    setPollLoader(true);
    const submitAPoll = async () => {
      try {
        const response = await API.post("/addPollResponse", {
          mail: userEmail,
          poll_id: id,
          pollResponse: option.value,
        });
        toast.success("Poll Submitted Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        getSinglePoll();
      } catch (err) {
        console.log(err);
      }
    };
    submitAPoll();
  };

  useEffect(() => {
    getSinglePoll();
  }, []);
  return pollLoader ? (
    <>
      <PollSkeleton />
    </>
  ) : (
    <>
      {pollData.length > 0 ? (
        pollData[0].LoggedUserPollResponse !== null ? (
          <>
            <SinglePollingResult
              onDelete={onDelete}
              myPosts={myPosts}
              type={type}
              pollData={pollData[0]}
            />
          </>
        ) : (
          <>
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
                    name={pollData[0]?.PollAdminName}
                    mailId={pollData[0]?.PollAdminEmail}
                  />
                  <Flex>
                    <Flex column>
                      <Text
                        style={{
                          fontWeight: "600",
                        }}
                        content={
                          <Flex gap="gap.small" vAlign="center">
                            <Text content={pollData[0]?.PollAdminName} />
                            <Image src={adminBadge} />
                          </Flex>
                        }
                      />
                      <Text content={pollData[0]?.PollAdminDepartment} />
                    </Flex>
                  </Flex>
                </Flex>
                <Flex gap="gap.small" vAlign="center">
                  {pollData[0]?.PollAdminEmail == userEmail ||
                  type == "admin" ? (
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
                              onClick: () => handleDelete(pollData[0]?.pollId),
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
                <Flex column>
                  <FlexItem>
                    <Text content={pollData[0]?.PollQuestion} />
                  </FlexItem>
                  <FlexItem>
                    <Flex column>
                      <RadioGroup
                        className="connect-radio-group"
                        vertical
                        items={JSON.parse(
                          pollData[0]?.PollOption?.replace(/'/g, '"')
                        ).map((option) => ({
                          key: option,
                          label: option,
                          value: option,
                        }))}
                        onCheckedValueChange={(e, option) =>
                          handleChange(e, option)
                        }
                      />
                    </Flex>
                  </FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
                <Divider />
              </FlexItem>
              <FlexItem>
                <PollsFooter pollsData={pollData[0]} />
              </FlexItem>
            </Flex>
          </>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default SinglePoll;
