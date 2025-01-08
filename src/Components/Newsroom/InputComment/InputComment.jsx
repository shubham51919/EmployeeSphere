import {
  Avatar,
  Flex,
  FlexItem,
  Input,
  Loader,
  SendIcon,
  Text,
} from "@fluentui/react-northstar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import newsroomApi from "../../../Apis/newsroom";

const InputComment = ({
  blogId,
  rerenderComment,
  setRerenderComment,
  setTotalComments,
}) => {
  const [commentByUser, setCommentByUser] = useState("");
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const profilePhoto = useSelector((state) => {
    return state.authReducer.profilePhoto;
  });
  const formReducer = useSelector((state) => state.formReducer);
  const { loggedInUserDetails } = formReducer;
  const { FirstName, LastName, EmployeeID, Department } = loggedInUserDetails;

  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const newsroomMain = newsroomApi(accessToken);

  const handleClick = () => {
    let data = {
      Name: FirstName + " " + LastName,
      hrmId: EmployeeID,
      email: userEmail,
      department: Department,
      comment: commentByUser,
    };
    toast(
      <Flex
        gap="gap.small"
        vAlign="center"
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Loader size="small" />
        <Text
          content="Posting Comment"
          style={{
            backgroundColor: "transparent",
          }}
        />
      </Flex>,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false,
        hideProgressBar: true,
        closeButton: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      }
    );
    newsroomMain
      .post(`/commentOnABlog?blogId=${blogId}`, data)
      .then((response) => {
        setRerenderComment(!rerenderComment);

        toast.dismiss();
        toast.success("Comment added successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setCommentByUser("");
        setTotalComments((prev) => prev + 1);
      })
      .catch((error) => {
        toast.dismiss();
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  return (
    <Flex gap="gap.small">
      <FlexItem>
        <Avatar image={profilePhoto} name={userEmail.toUpperCase()} />
      </FlexItem>
      <FlexItem>
        <Input
          className="input-comment"
          onChange={(e) => setCommentByUser(e.target.value)}
          type="text"
          placeholder="Comment here..."
          style={{
            cursor: "pointer",
            border: "1px solid #E1E1E1",
            borderRadius: "50px",
            flexGrow: 1,
            backgroundColor: "transparent",
          }}
          inverted={true}
          icon={<SendIcon onClick={handleClick} />}
          iconPosition="end"
        />
      </FlexItem>
    </Flex>
  );
};

export default InputComment;
