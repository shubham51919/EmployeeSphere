import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Loader,
  MoreIcon,
  Image,
  Divider,
  Popup,
} from "@fluentui/react-northstar";
import {
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import { useSelector } from "react-redux";
import unlikeHeart from "../../../Assets/carrerAdviceAssets/unlikeHeart.svg";
import commentIcon from "../../../Assets/carrerAdviceAssets/commentIcon.svg";
import likeHeart from "../../../Assets/carrerAdviceAssets/likeHeart.svg";
import PostSkeleton from "../../../Utilities/PostSkeleton";
import { toast } from "react-toastify";
import adminBadge from "../../../Assets/connectAssets/adminBadge.svg";
import ErrorScreen from "../../../Utilities/ErrorScreen";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
import Comments from "../Comments/Comments";
import InputComment from "../InputComment/InputComment";
import newsroomApi from "../../../Apis/newsroom";
import Sanitize from "./Sanitize";

const SinglePost = ({ type, id, onDelete }) => {
  const [localBlog, setLocalBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalLike, setTotalLike] = useState(0);
  const [rerenderComment, setRerenderComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [totalCommnets, setTotalComments] = useState(0);
  const [toggleLike, setToggleLike] = useState(false);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const newsroomAPI = newsroomApi(accessToken);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await newsroomAPI.post("/getABlog", {
        id: id,
        mail: userEmail,
      });
      setLocalBlog(response?.data?.data[0]);
      setTotalLike(response?.data?.data[0]?.TotalLikes);
      // setUserLiked(response?.data?.data[0]?.LoggedUserLiked);
      setToggleLike(response?.data?.data[0]?.LoggedUserLiked === 1);
      setTotalComments(response?.data?.data[0]?.TotalComments);
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  const [deleteLoader, setDeleteLoader] = useState(false);
  const handleDelete = async (id) => {
    setDeleteLoader(true);
    try {
      const resposne = await newsroomAPI.post("/deleteABlog", {
        id: id,
        adminMail: userEmail,
      });
      setDeleteLoader(false);
      toast.success("Deleted Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      onDelete(id);
    } catch (err) {
      setDeleteLoader(false);
      toast.error("Something went wrong. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // hooks(theme.theme);
  if (CompanyReducer.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (CompanyReducer.theme === "default") {
    appTheme = teamsTheme;
  }
  const handleLike = () => {
    setToggleLike((prev) => !prev);
    setTotalLike((prev) => prev + 1);
    newsroomAPI.post(`/likeABlog?id=${id}`, {
      email: userEmail,
    });
  };
  const handleUnlike = () => {
    if (totalLike <= 0) {
      return;
    }
    setToggleLike((prev) => !prev);
    setTotalLike((prev) => prev - 1);
    newsroomAPI.post(`/likeABlog?id=${id}`, {
      email: userEmail,
    });
  };

  return loading ? (
    <PostSkeleton />
  ) : error ? (
    <ErrorScreen error={error} />
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
              name={localBlog?.employeeName}
              mailId={localBlog?.employeeEmail}
            />
            <Flex column>
              <Flex gap="gap.small">
                <Text
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  content={localBlog?.employeeName}
                />
                {localBlog?.userType == "admin" ? (
                  <Image src={adminBadge} />
                ) : (
                  <></>
                )}
              </Flex>
              <Text
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                  color: "#616161",
                }}
                content={localBlog?.category}
              />
            </Flex>
          </Flex>
          <Flex gap="gap.small" vAlign="center">
            {localBlog?.employeeEmail === userEmail || type === "admin" ? (
              <>
                {deleteLoader ? (
                  <Loader size="small" />
                ) : (
                  <Popup
                    trigger={
                      <MoreIcon
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    }
                    position="below"
                    content={
                      <Flex column gap="gap.small">
                        <Text
                          content="Delete"
                          style={{ color: "red" }}
                          onClick={() => handleDelete(localBlog.id)}
                        />
                      </Flex>
                    }
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </Flex>
        </Flex>
        <Text as="h3" content={localBlog?.title} />
        <Sanitize html={localBlog?.content} />
        <Divider />
        <Flex gap="gap.medium" vAlign="center">
          <Flex className="post-likes" column hAlign="center" vAlign="center">
            {!toggleLike ? (
              <>
                <Image src={unlikeHeart} onClick={handleLike} />
              </>
            ) : (
              <>
                <Image src={likeHeart} onClick={handleUnlike} />
              </>
            )}

            {/* {userLiked === 0 ? (
              <>
                <Image src={unlikeHeart} onClick={handleLike} />
              </>
            ) : (
              <>
                <Image src={likeHeart} onClick={handleUnlike} />
              </>
            )} */}
            <Text className="likes-count" content={`${totalLike} Likes`} />
          </Flex>
          <Flex
            className="post-likes"
            column
            hAlign="center"
            vAlign="center"
            onClick={() => setShowComments((prev) => !prev)}
          >
            <Image src={commentIcon} />
            <Text
              content={`${totalCommnets >= 1 ? `${totalCommnets} Comments` : `0 Comment`
                }`}
              className="likes-count"
            />
          </Flex>
        </Flex>
        {showComments && (
          <>
            <InputComment
              setTotalComments={setTotalComments}
              blogId={id}
              rerenderComment={rerenderComment}
              setRerenderComment={setRerenderComment}
            />
            <Comments blogId={id} rerenderComment={rerenderComment} />
          </>
        )}
      </Flex>
    </>
  );
};

export default SinglePost;
