import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import "./PostByUser.css";
import {
  Flex,
  Input,
  Avatar,
  QnaIcon,
  PollIcon,
  FormatIcon,
  SendIcon,
  ChevronDownIcon,
} from "@fluentui/react-northstar";

import ArticlePost from "./ArticlePost";
import PollPost from "./PollPost";
import QnaPost from "./QnaPost";
import PollSkeleton from "../../../Utilities/PollSkeleton";

const PostOperations = ({ type }) => {
  const [showDefault, setShowDefault] = useState(true);
  const [showFormat, setShowFormat] = useState(false);
  const [showPolls, setShowPolls] = useState(false);
  const [showQNA, setShowQNA] = useState(false);
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });

  const [inputText, setInputText] = useState("");

  const profilePhoto = useSelector((state) => {
    return state.authReducer.profilePhoto;
  });
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  const clearStates = () => {
    setInputText("");
  };
  return (
    <Flex className="post-by-user-parent" gap="gap.small" column>
      <Flex gap="gap.small">
        <Flex className="avatar-container-post">
          <Avatar
            name={userEmail.toUpperCase()}
            image={profilePhoto}
            style={{ height: "3rem", width: "3rem" }}
          />
        </Flex>
        <Flex
          column
          style={{
            width: "calc(100% - 48px)",
          }}
          gap="gap.small"
        >
          {showDefault ? (
            <>
              <Flex column gap="gap.small">
                <Input
                  inverted
                  onClick={() => {
                    setShowFormat(true);
                    setShowDefault(false);
                  }}
                  placeholder="Write Something here"
                  style={{
                    width: "100%",
                    height: "3rem",
                    border: "1px solid #e1e1e1",
                    borderRadius: "6px",
                    outline: "none",
                  }}
                />
                {type != "user" ? (
                  <Flex
                    style={{
                      gap: "1rem",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Flex style={{ gap: "1rem" }}>
                      <FormatIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowFormat(true);
                          setShowDefault(false);
                          clearStates();
                        }}
                      />
                      <QnaIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowQNA(true);
                          setShowDefault(false);
                          clearStates();
                        }}
                      />
                      <PollIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowPolls(true);
                          setShowDefault(false);
                          clearStates();
                        }}
                      />
                    </Flex>
                    <SendIcon style={{ cursor: "pointer" }} />
                  </Flex>
                ) : (
                  <></>
                )}
              </Flex>
            </>
          ) : showFormat ? (
            isSubmittingBlog ? (
              <PollSkeleton />
            ) : (
              <ArticlePost
                setShowFormat={setShowFormat}
                setIsSubmittingBlog={setIsSubmittingBlog}
                setShowDefault={setShowDefault}
                type={type}
              />
            )
          ) : showPolls ? (
            <PollPost
              setShowPolls={setShowPolls}
              setIsSubmittingBlog={setIsSubmittingBlog}
              setShowDefault={setShowDefault}
            />
          ) : showQNA ? (
            <QnaPost
              setShowQNA={setShowQNA}
              setIsSubmittingBlog={setIsSubmittingBlog}
              setShowDefault={setShowDefault}
            />
          ) : (
            <></>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostOperations;
