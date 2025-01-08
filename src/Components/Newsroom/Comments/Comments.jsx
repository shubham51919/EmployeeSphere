import React, { useEffect, useState } from "react";
import SingleComment from "../Singles/SingleComment";
import { Flex, Skeleton, Text } from "@fluentui/react-northstar";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";
const Comments = ({ blogId, rerenderComment }) => {
  const connectReducer = useSelector((state) => state.connectReducer);
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const { newComments } = connectReducer;

  const [Ids, setIds] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visibleCommentCount, setVisibleCommentCount] = useState(2);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const API = newsroomApi(accessToken);

  useEffect(() => {
    console.log(rerenderComment, "rc");
    const getAllComments = async () => {
      try {
        const response = await API.post("/getCommentIds", {
          id: blogId,
          pageNo: 1,
          limit: visibleCommentCount,
        });
        setIds(response.data.data.Ids);
        setTotalRecords(response.data.data.pages.Total_Records);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };
    getAllComments();
  }, [visibleCommentCount, rerenderComment]);

  const handleLoadMoreClick = () => {
    setIsLoadingMore(true);
    setVisibleCommentCount((prevCount) => prevCount + 5);
  };

  // Function to handle submitting a new comment

  return loading ? (
    <Skeleton animation="pulse">
      <Flex gap="gap.small">
        <Skeleton.Avatar />
        <Skeleton.Line />
      </Flex>
    </Skeleton>
  ) : (
    <>
      <Flex gap="gap.small" column>
        {Ids?.slice(0, visibleCommentCount).map((id) => (
          <SingleComment
            key={id}
            commentId={id.id}
            rerenderComment={rerenderComment}
          />
        ))}
      </Flex>
      {totalRecords > visibleCommentCount && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Text
            primary
            onClick={handleLoadMoreClick}
            disabled={isLoadingMore}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Text>
        </div>
      )}
    </>
  );
};

export default Comments;
