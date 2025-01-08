import React, { useEffect, useState } from "react";
import {
  Flex,
  Button,
  Text,
  Dropdown,
  TextArea,
} from "@fluentui/react-northstar";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "../Format/Editor/Editor.css";
import { setRerenderActivity } from "../../../redux/actions";
import "react-quill/dist/quill.snow.css";

import QuillToolbar, { formats, modules } from "./EditorToolbar";
import ReactQuill from "react-quill";
import newsroomApi from "../../../Apis/newsroom";
import PreviewDialog from "../Requests/PreviewDialog";

const ArticlePost = ({
  setShowFormat,
  setIsSubmittingBlog,
  setShowDefault,
  type,
}) => {
  const connectReducer = useSelector((state) => {
    return state.connectReducer;
  });
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const formReducer = useSelector((state) => {
    return state.formReducer;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const { rerenderActivity } = connectReducer;
  const { loggedInUserDetails } = formReducer;

  const dispatch = useDispatch();
  const [editorHtml, setEditorHtml] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [theme, setTheme] = useState();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = editorHtml !== "" && title !== "" && category !== "";
    setIsFormValid(isValid);
  }, [editorHtml, title, category]);

  const API = newsroomApi(accessToken);

  useEffect(() => {
    setTheme(CompanyReducer.theme);
  }, [CompanyReducer]);

  //  **** handle Dropdown Change ****
  const handleDropdownChange = (item) => {
    setCategory(item);
  };

  // **** handle Quill Change ****
  const hanldeQuillChange = (value) => {
    setEditorHtml(value);
  };

  // **** handle Change ****
  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePostSubmit = async () => {
    setIsSubmittingBlog(true);
    let data = new FormData();
    data.append("title", title);
    data.append("content", editorHtml);
    data.append("adminMail", userEmail);
    data.append(
      "employeeName",
      `${loggedInUserDetails.FirstName} ${loggedInUserDetails.LastName}`
    );
    data.append("category", category);
    data.append("userType", type);

    try {
      const response = await API.post("/addNewBlog", data);
      if (response.status === 0) {
        toast.error("Please Try Again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        setIsSubmittingBlog(false);

        setCategory("");
        setTitle("");
        setEditorHtml("");

        if (type === "admin") {
          toast.success("Blog added successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          dispatch(setRerenderActivity(!rerenderActivity));
        } else {
          toast.success("Blog sent to admin for approval", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } catch (err) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const items = ["Editorials", "Reviews"];

  return (
    <>
      <Flex column gap="gap.small" className="format">
        <Dropdown
          placeholder="Select Category"
          getA11ySelectionMessage={{
            onAdd: (item) => handleDropdownChange(item),
          }}
          items={items}
          style={{
            width: "30%",
          }}
        />
        <TextArea
          onChange={handleChange}
          value={title}
          placeholder="Write heading"
        />
        <Flex
          className={`${theme == "default" ? `text-editor` : `text-dark-editor`
            }`}
          column
          style={{
            borderRadius: "0.5rem",
          }}
        >
          <ReactQuill
            theme="snow"
            value={editorHtml}
            onChange={hanldeQuillChange}
            placeholder={"Write something here..."}
            modules={modules}
            formats={formats}
          />
          <QuillToolbar />
          <Text
            style={{
              color: `${theme == "default" ? `grey` : `white`}`,
              fontSize: "0.6rem",
            }}
            content="( Max 200KB image size upload )"
          />
        </Flex>
      </Flex>
      <Flex
        gap="gap.small"
        style={{
          justifyContent: "space-between",
        }}
      >
        {/* {type === "admin" && ( */}
        <Text
          style={{
            color: "red",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
          onClick={() => {
            setShowFormat(false);
            setShowDefault(true);
          }}
        >
          Close
        </Text>
        {/* )} */}

        <Flex>
          <PreviewDialog
            employeeEmail={userEmail}
            employeeName={formReducer.loggedInUserDetails.FirstName}
            editorHtml={editorHtml}
            title={title}
            category={category}
            type="button"
          />
          <Button
            content="Post"
            disabled={!isFormValid}
            primary
            onClick={handlePostSubmit}
            style={{
              marginLeft: "1rem",
            }}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default ArticlePost;
