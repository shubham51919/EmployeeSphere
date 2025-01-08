import React, { useEffect, useState } from "react";
import { Flex, FlexItem, Pill, Text, Loader } from "@fluentui/react-northstar";
import _ from "lodash";

import { ToastContainer, toast } from "react-toastify";

import All from "../ActivityTabs/All";
import Polls from "../ActivityTabs/Polls";
import Posts from "../ActivityTabs/Posts";
import Qna from "../ActivityTabs/Qna";
const Activity = ({ myPosts, type }) => {
  const [activePill, setActivePill] = useState("All");

  useEffect(() => {
    handleActivityClick("All");
  }, []);

  const handleActivityClick = (key) => {
    if (myPosts && type == "user") {
      setActivePill("Post");
    } else {
      setActivePill(key);
    }
  };

  const pillItems = [
    {
      key: "All",
      content: "All",
      filled: true,
    },
    {
      key: "Post",
      content: "Posts",
      filled: false,
    },
    {
      key: "Poll",
      content: "Polls",
      filled: false,
    },
    {
      key: "QnA",
      content: "Q&A",
      filled: false,
    },
  ];
  const updatedPillItems = pillItems.map((item) => ({
    ...item,
    filled: item.key === activePill, // Set filled to true for the active pill
  }));

  return (
    <Flex className="main-feed-activity" column gap="gap.medium">
      <FlexItem>
        <Text as="h3" content="Activity" />
      </FlexItem>
      <FlexItem>
        <Flex space="between">
          {myPosts && type == "user" ? (
            <Flex gap="gap.small">
              <Pill
                onClick={() => handleActivityClick("Post")}
                key={"Post"}
                appearance={"filled"}
                style={{
                  backgroundColor: "#9294E7",
                  color: " #444791",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                className="pill"
              >
                <Text
                  className="pill-text"
                  content={"Posts"}
                  style={{
                    flexGrow: 1,
                  }}
                />
              </Pill>
            </Flex>
          ) : (
            <Flex gap="gap.small">
              {updatedPillItems.map((currentPill) => {
                return (
                  <>
                    <Pill
                      onClick={() => handleActivityClick(currentPill.key)}
                      key={currentPill.key}
                      appearance={currentPill.filled ? "filled" : "outline"}
                      style={{
                        backgroundColor: currentPill.filled
                          ? "#9294E7"
                          : "transparent",
                        color: " #444791",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      className="pill"
                    >
                      <Text
                        className="pill-text"
                        content={currentPill.content}
                        style={{
                          flexGrow: 1,
                        }}
                      />
                    </Pill>
                  </>
                );
              })}
            </Flex>
          )}
        </Flex>
      </FlexItem>

      <FlexItem>
        {activePill === "All" ? (
          <All type={type} myPosts={myPosts} />
        ) : activePill === "Post" ? (
          <Posts type={type} myPosts={myPosts} />
        ) : activePill === "Poll" ? (
          <Polls type={type} myPosts={myPosts} />
        ) : activePill === "QnA" ? (
          <Qna type={type} myPosts={myPosts} />
        ) : (
          <></>
        )}
      </FlexItem>

      {/* <ToastContainer /> */}
    </Flex>
  );
};

export default Activity;
