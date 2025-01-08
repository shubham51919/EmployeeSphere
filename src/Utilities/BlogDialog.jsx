import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Header,
  Input,
  TextArea,
  Text,
  Loader,
  Flex,
  FlexItem,
  Button,
  CloseIcon,
} from "@fluentui/react-northstar";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  mergeThemes,
} from "@fluentui/react-northstar";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setAllBlogsLoading, setBlogData } from "../redux/actions";
import { useDispatch } from "react-redux";
import "./blogDialog.css";
const BlogDialog = ({ header, type, blog }) => {
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [postBlogLoader, setPostBlogLoader] = useState(false);
  const [form, setForm] = useState({
    title: type === "edit" ? blog.title : "",
    content: type === "edit" ? blog.content : "",
    file: null,
  });
  const dialogRef = useRef(null);

  let appTheme = teamsTheme;
  const name = useSelector((state) => {
    return state.authReducer.userEmail;
  })
  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });
  if (!theme.theme) {
    // //console.log('Loading... header theme')
  } else {
    // hooks(theme.theme);
    if (theme.theme === "dark") {
      appTheme = teamsDarkTheme;
    } else if (theme.theme === "contrast") {
      appTheme = teamsHighContrastTheme;
    } else if (theme.theme === "default") {
      appTheme = teamsTheme;
    }
  }

  const ticketTheme = {
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.backgroundHover,
      }),
      Dialog: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.backgroundHover,
      }),
      Label: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.backgroundHover,
      }),
    },
    componentStyles: {
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Dialog: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Label: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };

  useEffect(() => {
    // Update the form state when the blog prop changes (during editing)
    if (type === "edit" && blog) {
      setForm({
        title: blog.title,
        content: blog.content,
        file: null, // You might need to handle the file separately
      });
    }
  }, [type, blog]);

  useEffect(() => {
    const { title, file, content } = form;
    const isValid = title !== "" && file !== null && content !== "";
    setIsFormValid(isValid);
  }, [form]);



  // *************** post blog ***************
  const handleAddBlog = () => {
    setPostBlogLoader(true);
    // setPostBlogLoader(true);
    const addFormData = new FormData();
    addFormData.append("title", form.title);
    addFormData.append("content", form.content);
    addFormData.append("file", form.file);
    axios
      .post(
        "/addNewBlog",
        addFormData
      )
      .then((res) => {
        setPostBlogLoader(false);
        toast.success("Blog added Successfully ", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowDialog(false);
        setForm((prev) => {
          return {
            ...prev,
            file: null,
            title: "",
            content: "",
          };
        });
        const fetchAllPost = async () => {
          dispatch(setAllBlogsLoading(true));
          const name = name;
          const payload = {
            email: name,
          };
          let apiUrl = "";
          axios({
            method: "post",
            url: `${apiUrl}/getAllBlogs`,
            data: payload,
          })
            .then(function (response) {
              if (response.status === 200) {
                let resData = response.data;
                dispatch(setBlogData(resData));
                dispatch(setAllBlogsLoading(false));
              } else {
                //console.log("no err");
                dispatch(setAllBlogsLoading(false));
                // toast.error("Something went wrong.")
              }
            })
            .catch(function (response) {
              //handle error
              // toast.dismiss(toastId);
            });
        };
        fetchAllPost();
      })
      .catch((err) => {
        setPostBlogLoader(false);
        toast.error("Something went wrong ", {
          position: toast.POSITION.TOP_RIGHT,
        });
        //console.log(err);
      });
  };

  // *************** edit blog ***************
  const formData = new FormData();
  formData.append("id", blog?.id);
  formData.append("title", form.title);
  formData.append("content", form.content);
  if (form.file) {
    formData.append("file", form.file);
  }

  // const handleEditChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => {
  //     return {
  //       ...prev,
  //       [name]: value,
  //     };
  //   });
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  //  ***************  handle edit blog ***************

  const handleEditBlog = () => {
    setPostBlogLoader(true);
    axios
      .post(`/editABlog`, formData)
      .then((res) => {
        setPostBlogLoader(false);
        toast.success("Blog updated Successfully ", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowDialog(false);
        setForm((prev) => {
          return {
            ...prev,
            file: null,
          };
        });
        const fetchAllPost = async () => {
          dispatch(setAllBlogsLoading(true));
          const name = name;
          const payload = {
            email: name,
          };
          let apiUrl = "";
          axios({
            method: "post",
            url: `${apiUrl}/getAllBlogs`,
            data: payload,
          })
            .then(function (response) {
              if (response.status === 200) {
                let resData = response.data;
                dispatch(setBlogData(resData));
                dispatch(setAllBlogsLoading(false));
                setShowDialog(false);
              } else {
                //console.log("no err");
                dispatch(setAllBlogsLoading(false));
                // toast.error("Something went wrong.")
              }
            })
            .catch(function (response) {
              //handle error
              // toast.dismiss(toastId);
            });
        };
        fetchAllPost();
      })
      .catch((err) => {
        setPostBlogLoader(false);
        toast.error("Something went wrong ", {
          position: toast.POSITION.TOP_RIGHT,
        });
        //console.log(err);
      });
  };

  const handleCancel = () => {
    if (type !== "edit") {
      setForm((prev) => {
        return {
          ...prev,
          file: null,
          title: "",
          content: "",
        };
      });
    }

    setShowDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <FluentUiProvider theme={mergeThemes(ticketTheme, appTheme)}>
        <Dialog
          className="blog-admin-dialog"
          // ref={dialogRef}
          header={
            <>
              <Flex
                gap="gap.small"
                space="between"
                style={{ width: "100%" }}
                vAlign="center"
              >
                <Header
                  as="h3"
                  content={
                    postBlogLoader
                      ? null
                      : type === "edit"
                        ? "Edit Blog"
                        : type === "add"
                          ? "Post Blog"
                          : null
                  }
                />
                <CloseIcon
                  onClick={() => setShowDialog(false)}
                  style={{ cursor: "pointer" }}
                />
              </Flex>
            </>
          }
          open={showDialog}
          trigger={
            <Text
              className="popup-edit"
              content={
                type === "edit" ? (
                  "Edit"
                ) : type === "add" ? (
                  <>
                    <Button primary content="Post Blog" />
                  </>
                ) : null
              }
              style={{ height: "2rem", cursor: "pointer" }}
              onClick={() => setShowDialog(true)}
            />
          }
          content={
            postBlogLoader ? (
              <Loader
                size="medium"
                style={{ margin: "auto", minHeight: "62vh" }}
              />
            ) : (
              <>
                <FluentUiProvider theme={mergeThemes(ticketTheme, appTheme)}>
                  <Flex column gap="gap.medium">
                    <FlexItem>
                      <Flex gap="gap.small" column>
                        <FlexItem>
                          <Text
                            className={`${type === "edit" ? "" : "hr-admin-input"
                              }`}
                            content={`${type === "edit" ? "Edit" : "Add"
                              } Title`}
                          />
                        </FlexItem>
                        <FlexItem styles={{ marginTop: "10px" }}>
                          <Input
                            onChange={handleChange}
                            name="title"
                            value={form.title}
                            fluid
                            inverted
                            placeholder="Enter Title"
                          />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Flex gap="gap.small" column>
                        <Text
                          className={`${type === "edit" ? "" : "hr-admin-input"
                            }`}
                          content={`${type === "edit" ? "Edit" : "Upload"
                            } Image`}
                        />
                        <FlexItem styles={{ marginTop: "10px" }}>
                          <Input
                            onChange={handleFileChange}
                            name="Image"
                            id="image"
                            type="file"
                            fluid
                            inverted
                            showSuccessIndicator={false}
                          />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Flex gap="gap.small" column>
                        <FlexItem>
                          <Text
                            className={`${type === "edit" ? "" : "hr-admin-input"
                              }`}
                            content={`${type === "edit" ? "Edit" : "Add"
                              } Description`}
                          />
                        </FlexItem>
                        <FlexItem styles={{ marginTop: "10px" }}>
                          <TextArea
                            onChange={handleChange}
                            name="content"
                            value={form.content}
                            fluid
                            inverted
                            placeholder="Enter Content"
                            styles={{ height: "25vh" }}
                          />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </FluentUiProvider>
                {/* )} */}
              </>
            )
          }
          cancelButton={
            postBlogLoader
              ? null
              : {
                content: "Cancel",
                onClick: handleCancel
              }
          }
          confirmButton={
            postBlogLoader
              ? null
              : {
                disabled: type !== "edit" && !isFormValid,
                content: "Post",
                onClick:
                  type === "edit"
                    ? handleEditBlog
                    : type === "add"
                      ? handleAddBlog
                      : null,
              }
          }
        />
      </FluentUiProvider>
    </div>
  );
};

export default BlogDialog;
