import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Flex,
  Text,
  Loader,
  FlexItem,
  Dialog,
} from "@fluentui/react-northstar";

import newsroomApi from "../../../Apis/newsroom";

import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";

const AnswersDialog = ({ ques_data, numberAns }) => {
  const [ansData, setAnsData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });

  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const newsroomAPI = newsroomApi(accessToken);

  useEffect(() => {
    setLoader(true);

    let data = {
      email: userEmail,
      question_id: ques_data.question_id,
    };

    newsroomAPI
      .post(`/getEmployeeResponses`, data)
      .then((response) => {
        setLoader(false);
        setAnsData(response?.data?.data);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  }, [ques_data, numberAns, trigger]);

  return (
    <Dialog
      style={{ height: "50%" }}
      content={
        loader ? (
          <Flex
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Flex>
        ) : (
          <>
            {ansData.length > 0 ? (
              <Flex style={{ height: "100%", overflowY: "auto" }} column>
                {ansData.map((item) => {
                  return (
                    <>
                      <Flex
                        gap="gap.small"
                        vAlign="center"
                        style={{
                          padding: "0.4rem 0.5rem",
                          width: "100%",
                          height: "fit-content",
                        }}
                      >
                        <FlexItem>
                          <AvatarProfilePhoto
                            name={item?.name}
                            mailId={item?.email_id}
                          />
                        </FlexItem>
                        <FlexItem>
                          <Flex
                            column
                            style={{
                              padding: "0.5rem",
                              borderRadius: "0.5rem",
                              flexGrow: 1,
                            }}
                          >
                            <FlexItem>
                              <Text
                                content={item?.name}
                                style={{
                                  fontWeight: "bold",
                                }}
                              />
                            </FlexItem>
                            <FlexItem>
                              <Text
                                content={item?.response}
                                style={{
                                  fontWeight: "semmi-bold",
                                }}
                              />
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                      </Flex>
                    </>
                  );
                })}
              </Flex>
            ) : (
              <Flex>No Answers Yet !</Flex>
            )}
          </>
        )
      }
      header="All Answers"
      trigger={
        <Text
          style={{ cursor: "pointer", textDecoration: "underline" }}
          content={`${numberAns} Answers`}
          onClick={() => setTrigger(!trigger)}
        />
      }
    />
  );
};

export default AnswersDialog;
