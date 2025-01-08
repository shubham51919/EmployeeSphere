import React from "react";
import Activity from "../Activity/Activity";

const MyPosts = ({type}) => {
  return (
    <div>
      <Activity myPosts={true} type={type}/>
    </div>
  );
};

export default MyPosts;
