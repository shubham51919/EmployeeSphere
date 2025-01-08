import React, { useEffect, useState } from "react";
import { Flex, FlexItem, Text, Pill } from "@fluentui/react-northstar";

import AnnounceCard from "./AnnounceCard.jsx";
import CreateAnnouncementDialog from "./CreateAnnouncementDialog";
import PollSkeleton from "../../../Utilities/PollSkeleton";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom.js";

const Announcement = () => {
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [activePill, setActivePill] = useState("all");

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);
  const getAcc = async () => {
    setNewsLoading(true);
    try {
      const response = await API.get("/getAnnouncement", {
        params: {
          status: activePill === "scheduled" ? "scheduling" : activePill,
          pageNo: 1,
          pageLimit: 10,
          email: userEmail,
        },
      });
      if (response.status === 200) {
        setNewsData(response?.data?.data?.data);
        setNewsLoading(false);
      } else {
        console.log("no err");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAcc();
  }, [activePill]);
  const pillItems = [
    {
      key: "all",
      content: "All",
      filled: true,
    },
    {
      key: "scheduled",
      content: "Scheduled",
      filled: false,
    },
    {
      key: "active",
      content: "Active",
      filled: false,
    },
    {
      key: "past",
      content: "Past",
      filled: false,
    },
  ];

  const handleActivityClick = (key) => {
    if (key === "scheduled") {
      setActivePill("scheduled");
    } else if (key === "past") {
      setActivePill("past");
    } else if (key === "active") {
      setActivePill("active");
    } else if (key === "all") {
      setActivePill("all");
    }
  };

  const updatedPillItems = pillItems.map((item) => ({
    ...item,
    filled: item.key === activePill, // Set filled to true for the active pill
  }));

  return (
    <Flex className="main-feed-announcements" column gap="gap.medium">
      <FlexItem>
        <Text as="h3" content="Announcements" />
      </FlexItem>
      <FlexItem>
        <Flex space="between">
          <Flex gap="gap.small">
            {updatedPillItems.map((item) => {
              return (
                <Pill
                  onClick={() => handleActivityClick(item.key)}
                  key={item.key}
                  appearance={item.filled ? "filled" : "outline"}
                  style={{
                    backgroundColor: item.filled ? "#9294E7" : "transparent",
                    color: " #444791",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  className="pill"
                >
                  <Text
                    className="pill-text"
                    content={item.content}
                    style={{
                      flexGrow: 1,
                    }}
                  />
                </Pill>
              );
            })}
          </Flex>
          <CreateAnnouncementDialog getAcc={getAcc} />
        </Flex>
      </FlexItem>
      <FlexItem>
        <Text
          content="⚡Announcement"
          style={{ fontSize: "14px", fontWeight: "bold" }}
        />
      </FlexItem>

      <Flex column gap="gap.small">
        {newsLoading ? (
          <>
            <PollSkeleton />
            <PollSkeleton />
            <PollSkeleton />
          </>
        ) : newsData.length === 0 ? (
          <Flex
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text content="No Announcements" />
          </Flex>
        ) : (
          newsData?.map((item) => {
            return <AnnounceCard item={item} />;
          })
        )}
      </Flex>
    </Flex>
  );
};

export default Announcement;
