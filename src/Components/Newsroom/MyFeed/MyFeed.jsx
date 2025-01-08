import React from "react";
import Activity from "../Activity/Activity";
import PostOperations from "../PostOperations/PostOperations";

const MyFeed = ({ type }) => {
  return (
    <>
      <PostOperations type={type} />
      <Activity type={type} />
    </>
  );
};

export default MyFeed;
