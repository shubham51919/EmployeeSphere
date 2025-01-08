import React, { useEffect, useState } from "react";
import {
  Flex,
  FlexItem,
  Text,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
import { formatTimeDifference } from "../../../Utilities/utilities";
import { useSelector } from "react-redux";
import { app } from "@microsoft/teams-js";
import { useDispatch } from "react-redux";

import { setTheme } from "../../../redux/actions";
import newsroomApi from "../../../Apis/newsroom";

const SingleComment = ({ commentId, rerenderComment }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState(null);
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [mainTheme, setMainAppTheme] = useState(teamsTheme);

  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);

  useEffect(() => {
    app.initialize().then(() => {
      app.registerOnThemeChangeHandler((theme) => {
        setCurrTheme(theme);
      });
      app.getContext().then((context) => {
        setCurrTheme(context.app.theme);
      });
    });
  }, []);

  useEffect(() => {
    dispatch(setTheme(currTheme));
    if (currTheme === "dark") {
      // hooks(teamsDarkTheme);
      setMainAppTheme(teamsDarkTheme);
    } else if (currTheme === "contrast") {
      // hooks(teamsHighContrastTheme);
      setMainAppTheme(teamsHighContrastTheme);
    } else {
      // hooks(teamsTheme);
      setMainAppTheme(teamsTheme);
    }
  }, [currTheme]);

  useEffect(() => {
    const getComment = async () => {
      try {
        const response = await API.post("/getAComment", {
          id: commentId,
        });
        setComment(response.data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getComment();
  }, [commentId, rerenderComment]);
  return (
    <FluentUiProvider theme={mainTheme}>
      <Flex gap="gap.small">
        <FlexItem>
          <AvatarProfilePhoto name={comment?.name} mailId={comment?.email} />
        </FlexItem>
        <FlexItem>
          <Flex
            column
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              // flexGrow: 1,
              width: "100%",
              border: "1px solid #e1e1e1",
            }}
          >
            <FlexItem>
              <Flex space="between">
                <Text content={comment?.name} style={{ fontWeight: "bold" }} />
                {comment?.createdAt.length > 0 && (
                  <Text
                    content={`${formatTimeDifference(comment?.createdAt)} ago`}
                  />
                )}
              </Flex>
            </FlexItem>
            <FlexItem>
              <Text content={comment?.comment} />
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    </FluentUiProvider>
  );
};

export default SingleComment;
