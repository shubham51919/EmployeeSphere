import React, { useEffect, useState } from "react";
import PostSkeleton from "../../../Utilities/PostSkeleton";
import SinglePost from "../Singles/SinglePost";
import { Flex, Image, Loader } from "@fluentui/react-northstar";
import SinglePoll from "../Singles/SinglePoll";
import SingleQna from "../Singles/SingleQna";
import emptyImg from "../../../Assets/connectAssets/emptyImg.svg";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";

const PostType = {
  POST: "Post",
  POLL: "Poll",
  QNA: "QnA",
};

const All = ({ myPosts, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMoreData, setLoadingMoreData] = useState(false);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const connectReducer = useSelector((state) => state.connectReducer);
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);

  const { rerenderActivity } = connectReducer;
  const myPostsPayload = {
    requestType: "all",
    pageNo: pageNo,
    limit: 10,
    mail: userEmail,
  };
  const socialDataPayload = {
    requestType: "all",
    pageNo: pageNo,
    limit: 10,
  };

  const onDelete = (id) => {
    console.log(id, "id");
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const getAllSocialData = async () => {
    if (!loadingMoreData) {
      setLoading(true);
    }
    try {
      const response = await API.post(
        `${myPosts ? `/getAdminMyPostsIds` : `/getSocialDataIds`}`,
        myPosts ? myPostsPayload : socialDataPayload
      );
      const result = response.data;
      setData((prev) => [...prev, ...result.data.finalData]);
      setTotalPages(result.data.pages.Total_Pages);
      setHasMore(result.data.finalData.length > 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setLoadingMoreData(false);
    }
  };
  useEffect(() => {
    getAllSocialData();
  }, [rerenderActivity, pageNo]);

  //cleanup for hasMore
  useEffect(() => {
    return () => {
      setHasMore(true);
    };
  }, []);

  const handelInfiniteScroll = () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentPosition = window.scrollY;
    if (
      currentPosition + 1 >= scrollableHeight &&
      pageNo <= totalPages &&
      hasMore &&
      !loadingMoreData
    ) {
      setPageNo((prev) => prev + 1);
      setLoadingMoreData(true);
    }
  };
  useEffect(() => {
    // if (totalPages === null) return;
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [totalPages, hasMore, loadingMoreData]);
  return loading ? (
    <PostSkeleton />
  ) : data.length > 0 ? (
    <Flex gap="gap.medium" column>
      {data?.map((item) => {
        switch (item.type) {
          case PostType.POST:
            return (
              <SinglePost
                onDelete={onDelete}
                getAllSocialData={getAllSocialData}
                myPosts={myPosts}
                type={type}
                id={item?.id}
                key={item.id}
              />
            );
          case PostType.POLL:
            return (
              <SinglePoll
                onDelete={onDelete}
                getAllSocialData={getAllSocialData}
                myPosts={myPosts}
                type={type}
                key={item.id}
                id={item.id}
              />
            );
          case PostType.QNA:
            return (
              <SingleQna
                onDelete={onDelete}
                getAllSocialData={getAllSocialData}
                myPosts={myPosts}
                type={type}
                key={item.id}
                id={item.id}
              />
            );
          default:
            return null;
        }
      })}
      {loadingMoreData && <Loader size="small" />}
      {!hasMore && <Image src={emptyImg} />}
    </Flex>
  ) : (
    <Flex>
      <Image src={emptyImg} />
    </Flex>
  );
};

export default All;
