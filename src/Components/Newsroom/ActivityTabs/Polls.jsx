import React, { useEffect, useState } from "react";
import _ from "lodash";
import PostSkeleton from "../../../Utilities/PostSkeleton";

import { Flex, Image, Loader } from "@fluentui/react-northstar";
import SinglePoll from "../Singles/SinglePoll";
import emptyImg from "../../../Assets/connectAssets/emptyImg.svg";

import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";

const Polls = ({ type, myPosts }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const onDelete = (id) => {
    console.log(id, "id");
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const connectReducer = useSelector((state) => state.connectReducer);
  const { rerenderActivity } = connectReducer;

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);

  const getPolls = async () => {
    if (!loadingMoreData) {
      setLoading(true);
    }

    let normalPayload = {
      requestType: "poll",
      pageNo: pageNo,
      limit: 10,
    };
    const myPostsPayload = {
      requestType: "poll",
      pageNo: pageNo,
      limit: 10,
      mail: userEmail,
    };
    try {
      const response = await API.post(
        `${myPosts ? `getAdminMyPostsIds` : `getSocialDataIds`}`,
        myPosts ? myPostsPayload : normalPayload
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
    getPolls();
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

  return (
    <div>
      {
        // If loading state is true, show the skeleton component
        loading ? (
          <PostSkeleton />
        ) : data.length > 0 ? (
          <Flex gap="gap.medium" column>
            {data?.map((item) => {
              return (
                <SinglePoll
                  onDelete={onDelete}
                  getPolls={getPolls}
                  myPosts={myPosts}
                  type={type}
                  key={item.id}
                  id={item.id}
                />
              );
            })}
            {loadingMoreData && <Loader size="small" />}
            {!hasMore && <Image src={emptyImg} />}
          </Flex>
        ) : (
          <Flex>
            <Image src={emptyImg} />
          </Flex>
        )
      }
    </div>
  );
};

export default Polls;
