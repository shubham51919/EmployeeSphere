import React, { useEffect, useState } from "react";
import "./PostByUser.css";
import {
  Flex,
  Input,
  Button,
  Text,
  Loader,
  Avatar,
  Dropdown,
  Image,
  Checkbox,
  Divider,
  QnaIcon,
  PollIcon,
  FormatIcon,
  SendIcon,
  ChevronDownIcon,
} from "@fluentui/react-northstar";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  mergeThemes,
  Skeleton,
} from "@fluentui/react-northstar";

import { ToastContainer, toast } from "react-toastify";
import plusIcon from "../../../Assets/connectAssets/plusIcon.svg";
import Format from "./Format/Format";
import PreviewDialog from "./PreviewDialog";
import { useSelector } from "react-redux";
import axios from "axios";
import { ACC_TKN, API_URL } from "../../../config";
import { useDispatch } from "react-redux";
import {
  setRerenderActivity,
  showSuccessMessage,
} from "../../../redux/actions";
import Activity from "../Activity/Activity";

const PostByUser = ({ type, myUser }) => {
  const dispatch = useDispatch();
  const profilePhoto = useSelector((state) => {
    return state.authReducer.profilePhoto;
  });
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const connectReducer = useSelector((state) => {
    return state.connectReducer;
  });
  const formReducer = useSelector((state) => {
    return state.formReducer;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });

  const { rerenderActivity } = connectReducer;
  const { editorHtml, title, category } = connectReducer;
  const { loggedInUserDetails } = formReducer;

  const [showFormat, setShowFormat] = useState(false);
  const [showDefault, setShowDefault] = useState(true);

  const [showPoll, setShowPoll] = useState(false);
  const [showQNA, setShowQNA] = useState(false);

  const inputItems = ["Open Ended", "Single Option", "Multi Option"];

  const inputItemshr = Array.from(Array(24), (_, index) => index).map(
    (h) => `${h}`
  );
  const inputItemsdays = Array.from(Array(30), (_, index) => index).map(
    (h) => `${h}`
  );
  const inputItemsmin = Array.from(Array(60), (_, index) => index).map(
    (h) => `${h}`
  );

  const getA11yStatusMessage = ({
    isOpen,
    itemToString,
    previousResultCount,
    resultCount,
    selectedItem,
  }) => {
    if (!isOpen) {
      return selectedItem ? itemToString(selectedItem) : "";
    }
    if (!resultCount) {
      return "No results are available.";
    }
    if (resultCount !== previousResultCount) {
      return `${resultCount} result${resultCount === 1 ? " is" : "s are"
        } available, use up and down arrow keys to navigate. Press Enter key to select or continue typing.`;
    }
    return "";
  };
  const [searchQuery, setSearchQuery] = React.useState("00:00");

  // Logic for Inputs ---------------------------------------------------

  const [inputs, setInputs] = useState([{ value: "" }, { value: "" }]);
  const [inputValues, setInputValues] = useState([]);
  const handleInputChange = (index, newValue) => {
    const newInputs = [...inputs];
    newInputs[index].value = newValue;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    const newInputs = [...inputs, { value: "" }];
    setInputs(newInputs);
  };
  const handleRemoveInput = () => {
    if (inputs.length > 1) {
      const newInputs = [...inputs];
      newInputs.pop();
      setInputs(newInputs);
    }
  };

  useEffect(() => {
    const values = inputs.map((input) => input.value);
    setInputValues(JSON.stringify(values));
  }, [inputs]);
  // ------------------------------------------------------------------------API Intergration

  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);

  const handlePostSubmit = () => {
    setIsSubmittingBlog(true);
    let data = new FormData();
    data.append("title", title);
    data.append("content", editorHtml);
    data.append("adminMail", name);
    data.append(
      "employeeName",
      `${loggedInUserDetails.FirstName} ${loggedInUserDetails.LastName}`
    );
    data.append("category", "Editorials");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/newsroom/addNewBlog`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        setIsSubmittingBlog(false);
        // dispatch(setRerenderActivity(!rerenderActivity));
        if (response.status == 0) {
          toast.error("Please Try Again", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          dispatch(showSuccessMessage(true));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [inputText, setInputText] = useState("");
  const [qnaLoaderSubmit, setQnaLoaderSubmit] = useState(false);
  const [pollLoaderSubmit, setPollLoaderSubmit] = useState(false);

  const clearStates = () => {
    setInputText("");
    setInputs([{ value: "" }, { value: "" }]);
  };
  const clearStatesPoll = () => {
    setInputText("");
    setInputs([{ value: "" }, { value: "" }]);
  };

  const [selectedItem, setSelectedItem] = useState(inputItems[1]);

  const handleDropdownChange = (event, data) => {
    setSelectedItem(data.value);
  };

  const handleQnaRaise = () => {
    setQnaLoaderSubmit(true);
    let data = {};
    const axios = require("axios");
    if (selectedItem == "Open Ended") {
      data = {
        question: inputText,
        email: name,
        questionType: "Open Ended",
      };
    } else if (selectedItem == "Single Option") {
      data = {
        question: inputText,
        email: name,
        questionOptions: inputValues,
        questionType: "Single Choice",
      };
    } else {
      data = {
        question: inputText,
        email: name,
        questionOptions: inputValues,
        questionType: "Multi Choice",
      };
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/newsroom/addQuestion`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setQnaLoaderSubmit(false);
        setShowQNA(false);
        // dispatch(setRerenderActivity(!rerenderActivity));
        setShowDefault(true);
        clearStates();
        toast.success("Question Added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setQnaLoaderSubmit(false);
        console.log(error);
      });
  };

  const [daysPolls, setDaysPolls] = useState();
  const [hrsPolls, setHrsPolls] = useState();
  const [minPolls, setMinPolls] = useState();

  const handlePollRaise = () => {
    setPollLoaderSubmit(true);
    const axios = require("axios");
    let data = {
      pollQuestion: inputText,
      email: name,
      pollOption: inputValues,
      days: daysPolls,
      hours: hrsPolls,
      minutes: minPolls,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/newsroom/raisePoll`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setPollLoaderSubmit(false);
        setShowPoll(false);
        setShowDefault(true);
        clearStatesPoll();
        // dispatch(setRerenderActivity(!rerenderActivity));
        toast.success("Question Added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setPollLoaderSubmit(false);
        console.log(error);
      });
  };

  return (
    <>
      <Flex className="post-by-user-parent" gap="gap.small" column>
        <Flex gap="gap.small">
          <Flex className="avatar-container-post">
            <Avatar
              image={profilePhoto}
              style={{ height: "3rem", width: "3rem" }}
            />
          </Flex>
          <Flex
            column
            className=""
            style={{
              width: "calc(100% - 48px)"
            }}
            gap="gap.small"
          >
            {showDefault && (
              <>
                {!showFormat && !isSubmittingBlog && (
                  <Input
                    inverted
                    onClick={() => {
                      setShowFormat(true);
                      setShowDefault(false);
                    }}
                    placeholder="Write Something here"
                    style={{
                      width: "100%",
                      height: "3rem",
                      border: "1px solid #e1e1e1",
                      borderRadius: "6px",
                      outline: "none",
                    }}
                  />
                )}

                {type === "admin" && (
                  <>
                    {showDefault ? (
                      <Flex
                        style={{
                          gap: "1rem",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Flex style={{ gap: "1rem" }}>
                          <FormatIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setShowFormat(true);
                              setShowDefault(false);
                              clearStates();
                            }}
                          />
                          <QnaIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setShowQNA(true);
                              setShowDefault(false);
                              clearStates();
                            }}
                          />
                          <PollIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setShowPoll(true);
                              setShowDefault(false);
                              clearStates();
                            }}
                          />
                        </Flex>
                        <SendIcon style={{ cursor: "pointer" }} />
                      </Flex>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
            )}
            {isSubmittingBlog ? (
              <>
                <Flex>
                  <Skeleton animation="pulse">
                    <Flex column gap="gap.small">
                      <Skeleton.Text
                        style={{
                          width: "30%",
                        }}
                      />
                      <Skeleton.Text />
                      <Skeleton.Text />
                      <Skeleton.Text />
                    </Flex>
                  </Skeleton>
                </Flex>
              </>
            ) : (
              showFormat && (
                <>
                  <Format />
                  <Flex
                    gap="gap.small"
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
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

                    <Flex>
                      <PreviewDialog
                        editorHtml={editorHtml}
                        title={title}
                        category={category}
                        type="button"
                      />
                      <Button
                        content="Post"
                        primary
                        onClick={handlePostSubmit}
                        style={{
                          marginLeft: "1rem",
                        }}
                      />
                    </Flex>
                  </Flex>
                </>
              )
            )}
            {showQNA && (
              <Flex className="input-container-head-user" column>
                {qnaLoaderSubmit ? (
                  <Flex>
                    <Skeleton animation="pulse">
                      <Flex column gap="gap.small">
                        <Skeleton.Text
                          style={{
                            width: "30%",
                          }}
                        />
                        <Skeleton.Text />
                        <Skeleton.Text />
                        <Skeleton.Text />
                      </Flex>
                    </Skeleton>
                  </Flex>
                ) : (
                  <>
                    <Flex className="heading-opened-parent" column>
                      <Dropdown
                        inverted
                        items={inputItems}
                        value={selectedItem}
                        className="dropdown-border-user"
                        onChange={handleDropdownChange}
                      />
                      {selectedItem == "Open Ended" ? (
                        <Input
                          placeholder="Ask a Question"
                          inverted
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                        />
                      ) : (
                        <>
                          <Input
                            placeholder="Ask a Question"
                            inverted
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                          />
                          {inputs.map((input, index) => (
                            <Flex column key={index}>
                              <Flex gap="gap.medium">
                                <Input
                                  value={input.value}
                                  onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                  }
                                  inverted
                                  className="input-border-user"
                                  placeholder="Add Option "
                                />
                                {index === inputs.length - 1 &&
                                  inputs.length < 6 && (
                                    <Flex
                                      onClick={handleAddInput}
                                      style={{
                                        paddingTop: "5px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Image
                                        src={plusIcon}
                                        style={{
                                          height: "1.1rem",
                                          width: "1.1rem",
                                        }}
                                      />
                                    </Flex>
                                  )}
                              </Flex>
                              <Flex space="between" style={{ width: "95%" }}>
                                <span></span>
                                {index === inputs.length - 1 &&
                                  inputs.length > 2 && (
                                    <Text
                                      onClick={handleRemoveInput}
                                      style={{
                                        cursor: "pointer",
                                        color: "grey",
                                        fontSize: "0.875rem",
                                        fontWeight: "400",
                                      }}
                                    >
                                      Remove
                                    </Text>
                                  )}
                              </Flex>
                            </Flex>
                          ))}
                        </>
                      )}
                    </Flex>
                    <Flex column className="padding-one-rem">
                      <Divider className="padding-one-rem" />
                      <Flex
                        space="between"
                        vAlign="center"
                        style={{ width: "97%", paddingTop: "1rem" }}
                      >
                        <Text
                          style={{
                            fontSize: "1ren",
                            fontWeight: "600",
                            color: "#D32C1C",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setShowQNA(false);
                            setShowDefault(true);
                          }}
                        >
                          Close
                        </Text>
                        <Button
                          primary
                          onClick={handleQnaRaise}
                          content="Submit"
                        />
                      </Flex>
                    </Flex>
                  </>
                )}
              </Flex>
            )}
            {showPoll && (
              <Flex className="input-container-head-user" column>
                {pollLoaderSubmit ? (
                  <Flex>
                    <Skeleton animation="pulse">
                      <Flex column gap="gap.small">
                        <Skeleton.Text
                          style={{
                            width: "30%",
                          }}
                        />
                        <Skeleton.Text />
                        <Skeleton.Text />
                        <Skeleton.Text />
                      </Flex>
                    </Skeleton>
                  </Flex>
                ) : (
                  <>
                    <Flex className="heading-opened-parent" column>
                      <Input
                        placeholder="Start a Poll !"
                        inverted
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                      <>
                        {inputs.map((input, index) => (
                          <Flex column key={index}>
                            <Flex gap="gap.medium">
                              <Input
                                value={input.value}
                                onChange={(e) =>
                                  handleInputChange(index, e.target.value)
                                }
                                inverted
                                className="input-border-user"
                                placeholder="Search..."
                              />
                              {index === inputs.length - 1 &&
                                inputs.length < 6 && (
                                  <Flex
                                    onClick={handleAddInput}
                                    style={{
                                      paddingTop: "5px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Image
                                      src={plusIcon}
                                      style={{
                                        height: "1.1rem",
                                        width: "1.1rem",
                                      }}
                                    />
                                  </Flex>
                                )}
                            </Flex>
                            <Flex space="between" style={{ width: "95%" }}>
                              <span></span>
                              {index === inputs.length - 1 &&
                                inputs.length > 2 && (
                                  <Text
                                    onClick={handleRemoveInput}
                                    style={{
                                      cursor: "pointer",
                                      color: "grey",
                                      fontSize: "0.875rem",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Remove
                                  </Text>
                                )}
                            </Flex>
                          </Flex>
                        ))}
                      </>
                    </Flex>
                    <Flex column className="padding-one-rem">
                      <Divider className="padding-one-rem" />
                      <Flex column>
                        <Text className="padding-one-rem">Poll Length</Text>
                        <Flex space="between" gap="gap.small">
                          <Flex column style={{ width: "100%" }}>
                            <Text>Days</Text>
                            <Dropdown
                              style={{
                                border: "1px solid #E1E1E1",
                                width: "100%",
                              }}
                              inverted
                              defaultValue={inputItemsdays[0]}
                              items={inputItemsdays}
                              getA11ySelectionMessage={{
                                onAdd: (item) => setDaysPolls(item),
                              }}
                            />
                          </Flex>
                          <Flex column style={{ width: "100%" }}>
                            <Text>Hours</Text>
                            <Dropdown
                              style={{
                                border: "1px solid #E1E1E1",
                                width: "100%",
                              }}
                              inverted
                              defaultValue={inputItemshr[0]}
                              items={inputItemshr}
                              getA11ySelectionMessage={{
                                onAdd: (item) => setHrsPolls(item),
                              }}
                            />
                          </Flex>
                          <Flex column style={{ width: "100%" }}>
                            <Text>Minutes</Text>
                            <Dropdown
                              style={{
                                border: "1px solid #E1E1E1",
                                width: "100%",
                              }}
                              inverted
                              defaultValue={inputItemsmin[0]}
                              items={inputItemsmin}
                              getA11ySelectionMessage={{
                                onAdd: (item) => setMinPolls(item),
                              }}
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                      <Divider className="padding-one-rem" />
                      <Flex
                        space="between"
                        vAlign="center"
                        style={{ width: "97%", paddingTop: "1rem" }}
                      >
                        <Text
                          style={{
                            fontSize: "1ren",
                            fontWeight: "600",
                            color: "#D32C1C",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setShowPoll(false);
                            setShowDefault(true);
                          }}
                        >
                          Close
                        </Text>
                        <Button
                          primary
                          onClick={handlePollRaise}
                          content="Submit"
                        />
                      </Flex>
                    </Flex>
                  </>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
        <Activity type={type} myUser={myUser} />
      </Flex>
      <ToastContainer />
    </>
  );
};

export default PostByUser;
