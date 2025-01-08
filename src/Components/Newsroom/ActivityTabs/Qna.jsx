import React, { useEffect, useState } from "react";
import PollSkeleton from "../../../Utilities/PollSkeleton";
import SingleQna from "../Singles/SingleQna";
import emptyImg from "../../../Assets/connectAssets/emptyImg.svg";
import { Flex, Image, Loader } from "@fluentui/react-northstar";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";

const Qna = ({ type, myPosts }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const getQnA = async () => {
    if (!loadingMoreData) {
      setLoading(true);
    }
    const myPostsPayload = {
      requestType: "qna",
      pageNo: pageNo,
      limit: 20,
      mail: userEmail,
    };
    let data = {
      requestType: "qna",
      pageNo: pageNo,
      limit: 10,
    };

    try {
      const response = await API.post(
        `${myPosts ? `/getAdminMyPostsIds` : `/getSocialDataIds`}`,
        myPosts ? myPostsPayload : data
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
    getQnA();
  }, [rerenderActivity, pageNo]);

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
    console.log(
      pageNo,
      totalPages,
      hasMore,
      loadingMoreData,
      "pageNo, totalPages, hasMore, loadingMoreData"
    );
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [totalPages, hasMore, loadingMoreData]);

  useEffect(() => {
    return () => {
      setHasMore(true);
    };
  }, []);

  return loading ? (
    <PollSkeleton />
  ) : data?.length > 0 ? (
    <Flex gap="gap.medium" column>
      {data?.map((item) => {
        return (
          <SingleQna
            onDelete={onDelete}
            getQnA={getQnA}
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

export default Qna;
