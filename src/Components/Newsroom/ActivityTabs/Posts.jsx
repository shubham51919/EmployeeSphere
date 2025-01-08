import React, { useEffect, useState } from "react";
import PostSkeleton from "../../../Utilities/PostSkeleton";
import SinglePost from "../Singles/SinglePost";
import { Flex, Image, Loader } from "@fluentui/react-northstar";

import emptyImg from "../../../Assets/connectAssets/emptyImg.svg";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";

const Posts = ({ type, myPosts }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const connectReducer = useSelector((state) => state.connectReducer);
  const { rerenderActivity } = connectReducer;
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);
  const onDelete = (id) => {
    console.log(id, "id");
    setData((prev) => prev.filter((item) => item.id !== id));
  };
  const getPosts = async () => {
    if (!loadingMoreData) {
      setLoading(true);
    }
    let payload = {
      requestType: "post",
      pageNo: pageNo,
      limit: 10,
      mail: myPosts && userEmail,
    };
    try {
      const response = await API.post(
        `/${myPosts ? "getAdminMyPostsIds" : "getSocialDataIds"}`,
        payload
      );
      const result = await response.data;
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
    getPosts();
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
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [totalPages, hasMore, loadingMoreData]);

  useEffect(() => {
    return () => {
      setHasMore(true);
    };
  }, []);

  return loading ? (
    <PostSkeleton />
  ) : data?.length > 0 ? (
    <Flex gap="gap.medium" column>
      {data?.map((item) => {
        return (
          <SinglePost
            onDelete={onDelete}
            getPosts={getPosts}
            myPosts={myPosts}
            type={type}
            id={item?.id}
            key={item.id}
          />
        );
      })}
      {loadingMoreData && <Loader size="small" />}
      {!hasMore && <Image src={emptyImg} />}
    </Flex>
  ) : (
    <Image src={emptyImg} />
  );
};

export default Posts;
