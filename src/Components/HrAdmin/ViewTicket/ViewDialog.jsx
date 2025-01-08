import React, { useEffect, useState } from "react";
import "./ViewDialog.css";
import {
  Dialog,
  Divider,
  Header,
  Text,
  Flex,
  FlexItem,
  Dropdown,
  Image,
  //import LOader from fluent ui to add loading
  Loader,
  Avatar,
  CloseIcon,
  TextArea,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import { hrApi } from "../../../Apis/hrApi";

import ticketIcon from "../../../Assets/hrAdminAssets/ticketIcon.svg";

//import redux toolkit states and data fetch method
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function ViewDialog({ profilePhoto, username, id, changeStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [hrReply, setHrReply] = useState("");
  const [hrForwardMessage, setHrForwardMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [actionDropdownValue, setActionDropdownValue] = useState("Reply");
  const [forwardDropdownValue, setForwardDropdownValue] = useState("");

  const forwardItems = [];
  const actionItem = ["Reply", "Forward"];

  let appTheme = teamsTheme;
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });
  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });
  const hrQuerypersondata = useSelector(
    (state) => state.hrQueryReducer.hrVeiwTicket
  );
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const apiVarMain = hrApi(accessToken)





  // 1. Defined themes here 



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

  const dialogTheme = {
    // siteVariables: {
    //   colorScheme: {
    //     border: '#F5F5F5',
    //   },
    // },
    componentVariables: {
      Dialog: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      FlexItem: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Dialog: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      FlexItem: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      TextArea: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };
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




  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (dialogRef.current && !dialogRef.current.contains(event.target)) {
  //       setHrReply("");
  //       setIsOpen(false);
  //     }
  //   };
  //   document.body.addEventListener("click", handleOutsideClick);
  //   return () => {
  //     document.body.removeEventListener("click", handleOutsideClick);
  //   };
  // }, []);

  //  *************** check if form is valid ***************
  useEffect(() => {
    const isValid = hrReply !== "";
    setIsFormValid(isValid);
  }, [hrReply]);

  // *************** get date and time ***************
  const getDate = (newdate) => {
    const { date } = convertUTCtoIST(newdate);
    return date;
  };

  const getTime = (newtime) => {
    const { time } = convertUTCtoIST(newtime);
    return time;
  };

  // *************** convert UTC to IST ***************
  function convertUTCtoIST(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const istDate = new Date(utcDate.getTime()); // IST offset from UTC is +5.5 hours

    const formattedDate = istDate
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    const formattedTime = istDate.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    return { date: formattedDate, time: formattedTime };
  }



  // 2. Handle Cancel & Reply operation by admin


  const handleCancel = () => {
    setIsOpen(false);
    setActionDropdownValue("Reply");
  };


  const handleReply = () => {
    setPostLoading(true);
    const replyPayload = {
      id: hrQuerypersondata?.ticketShow?.result?.id,
      reply: hrReply,
      adminMail: name
    };
    apiVarMain
      .post(
        `/actionOnTicket`,
        replyPayload
      )
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        changeStatus(id, 2);
        setPostLoading(false);
        setHrReply("");
        handleCancel();
      })
      .catch((err) => {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setPostLoading(false);
      });
  };



  // 3. Handle Forward by admin 

  const handleForward = () => {
    setPostLoading(true);
    const forwardPayload = {
      id: hrQuerypersondata?.ticketShow?.result?.id,
      forwardBy: name,
      forwardTo: forwardDropdownValue,
      reply: hrForwardMessage,
      adminMail: name,
    };
    apiVarMain
      .post(
        `/actionOnTicket`,
        forwardPayload
      )
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        changeStatus(id, -1);
        setPostLoading(false);
        setHrForwardMessage("");
        handleCancel();
      })
      .catch((err) => {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setPostLoading(false);
      });
  };



  // *************** open dialog ***************
  const openDialog = () => {
    setIsOpen(true);
    setPostLoading(true);
    const userEmail = name;
    apiVarMain
      .post(`/HRviewTicket`, {
        id: id,
        hrMail: userEmail,
        adminMail: userEmail
      })
      .then((res) => {
        dispatch({
          type: "HR_VEIW_TICKET_SECTION_SUCCESSFULLY",
          payload: res.data,
        });
        changeStatus(id, 1);
        setPostLoading(false);
      })
      .catch((err) => {
        dispatch({
          type: "HR_VEIW_TICKET_SECTION_FAILED",
        });
        changeStatus(id, 0);
        setPostLoading(false);
      });
  };

  useEffect(() => {
    if (showError) {
      setTimeout(() => { }, 3000);
    }
  }, [showError]);

  return (
    <>
      <FluentUiProvider theme={mergeThemes(ticketTheme, dialogTheme)}>
        <Dialog
          // ref={dialogRef}
          className="hr-dialog"
          open={isOpen}
          style={{ height: "25rem", width: "70%" }}
          trigger={
            <FluentUiProvider theme={mergeThemes(ticketTheme, dialogTheme)}>
              <Text
                content="View"
                onClick={openDialog}
                style={{
                  color: "#416BFF",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              />
            </FluentUiProvider>
          }
          header={
            <>
              {postLoading ? null : (
                <>
                  <Header
                    as="h3"
                    content={
                      <Flex gap="gap.small" space="between">
                        <FlexItem>
                          <Flex gap="gap.small">
                            <Image src={ticketIcon} />

                            <FlexItem>
                              <Text content={`Ticket ID : `} />
                            </FlexItem>
                            <FlexItem>
                              <Text
                                content={` TICK${id}`}
                                style={{ color: "#4F52B2" }}
                              />
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                        <FlexItem>
                          {postLoading ? null : (
                            <CloseIcon
                              onClick={handleCancel}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </FlexItem>
                      </Flex>
                    }
                  />
                </>
              )}
            </>
          }
          content={
            postLoading ? (
              <Loader
                size="medium"
                style={{ margin: "auto", minHeight: "60vh", width: "70%" }}
              />
            ) : (
              <>
                <Divider />
                {postLoading ? (
                  <Loader
                    size="medium"
                    style={{ margin: "auto", minHeight: "60vh" }}
                  />
                ) : (
                  // <FluentUiProvider theme={mergeThemes(ticketTheme, appTheme)}>
                  <Flex column className="main_dialog">
                    <Flex space="between">
                      <Flex column style={{ width: "90%" }} gap="gap.medium">
                        <Flex space="between" hAlign="center">
                          <FlexItem>
                            <Text
                              content="Issue Type"
                              style={{
                                width: "19rem",
                                fontWeight: "400",
                                fontSize: "1rem",
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            />
                          </FlexItem>
                          <Text
                            className="detail"
                            content={`${hrQuerypersondata?.ticketShow?.result?.reasonType}`}
                          />
                        </Flex>
                        <Flex space="between">
                          <Text
                            className="hr-admin-description"
                            content="Description"
                            style={{
                              width: "19rem !important",
                              fontWeight: "400",
                              fontSize: "1rem",
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          />
                          <Text
                            className="detail"
                            content={`${hrQuerypersondata?.ticketShow?.result?.description}`}
                          />
                        </Flex>
                        <Flex>
                          <Text
                            className="details"
                            style={{ width: "20rem" }}
                            content="Raised By"
                          />
                          <Flex
                            className="detail"
                            style={{ width: "100%" }}
                            gap="gap.small"
                            vAlign="center"
                          >
                            <Avatar
                              image={profilePhoto}
                              name={hrQuerypersondata?.ticketShow?.result?.Name}
                            />

                            <Flex column style={{ width: "100%" }}>
                              <Text
                                style={{ maxWidth: "10rem" }}
                                weight="bold"
                                className="detail"
                                content={`${hrQuerypersondata?.ticketShow?.result?.Name}`}
                              />
                              <Text
                                className="detail"
                                content={`${hrQuerypersondata?.ticketShow?.result?.hrmId}`}
                              />
                            </Flex>
                          </Flex>
                        </Flex>
                        <Flex space="between">
                          <Text className="details" content="Raised On" />
                          <Text
                            className="detail"
                            content={`${getDate(
                              hrQuerypersondata?.ticketShow?.result?.createdAt
                            )} | ${getTime(
                              hrQuerypersondata?.ticketShow?.result?.createdAt
                            )}`}
                          />
                        </Flex>
                        {hrQuerypersondata?.ticketShow?.result?.reply ? (
                          <>
                            <Flex space="">
                              <Text
                                className="details hr-admin-input"
                                content="Reply"
                              />
                              <TextArea
                                style={{
                                  width: "70%",
                                  height: "5rem",
                                }}
                                value={
                                  hrQuerypersondata?.ticketShow?.result?.reply
                                }
                                disabled
                              />
                            </Flex>
                          </>
                        ) : hrQuerypersondata?.ticketShow?.result?.forwardText
                          ?.length > 0 ? (
                          hrQuerypersondata?.ticketShow?.flag === 0 ? (
                            <>
                              <Flex space="">
                                <Text className="details" content="Foward To" />
                                <TextArea
                                  style={{
                                    width: "70%",
                                    height: "5rem",
                                  }}
                                  value={
                                    hrQuerypersondata?.ticketShow?.result
                                      ?.forwardTo
                                  }
                                  disabled
                                />
                              </Flex>
                              <Flex space="">
                                <Text
                                  className="details "
                                  content="Foward Message"
                                />
                                <TextArea
                                  style={{
                                    width: "70%",
                                    height: "5rem",
                                  }}
                                  value={
                                    hrQuerypersondata?.ticketShow?.result
                                      ?.forwardText
                                  }
                                  disabled
                                />
                              </Flex>
                            </>
                          ) : hrQuerypersondata?.ticketShow?.flag === 1 ? (
                            <>
                              <Flex space="">
                                <Text
                                  className="details"
                                  content="Foward Message"
                                />
                                <TextArea
                                  style={{
                                    width: "70%",
                                    height: "5rem",
                                  }}
                                  value={
                                    hrQuerypersondata?.ticketShow?.result
                                      ?.forwardText
                                  }
                                  disabled
                                />
                              </Flex>

                              <Flex space="">
                                <Text className="details" content="Action" />
                                <Dropdown
                                  style={{
                                    width: "70%",
                                  }}
                                  items={actionItem}
                                  defaultValue={actionItem[0]}
                                  getA11ySelectionMessage={{
                                    onAdd: (item) =>
                                      setActionDropdownValue(item),
                                  }}
                                />
                              </Flex>
                              {actionDropdownValue === "Reply" && (
                                <Flex space="">
                                  <Text
                                    className="details hr-admin-input"
                                    content="Reply"
                                  />
                                  <TextArea
                                    style={{
                                      width: "70%",
                                      height: "5rem",
                                    }}
                                    placeholder="Enter your reply"
                                    value={hrReply}
                                    onChange={(e) => setHrReply(e.target.value)}
                                  />
                                </Flex>
                              )}
                              {actionDropdownValue === "Forward" && (
                                <>
                                  <Flex space="">
                                    <Text
                                      className="details hr-admin-input"
                                      content="Forward To"
                                    />
                                    <Dropdown
                                      style={{
                                        width: "70%",
                                      }}
                                      items={forwardItems}
                                      placeholder="Select"
                                      getA11ySelectionMessage={{
                                        onAdd: (item) =>
                                          setForwardDropdownValue(item),
                                      }}
                                    />
                                  </Flex>
                                  <Flex space="">
                                    <Text
                                      className="details hr-admin-input"
                                      content="Forward Message"
                                    />
                                    <TextArea
                                      style={{
                                        width: "70%",
                                        height: "5rem",
                                      }}
                                      placeholder="Enter Forward Message"
                                      value={hrForwardMessage}
                                      onChange={(e) =>
                                        setHrForwardMessage(e.target.value)
                                      }
                                    />
                                  </Flex>
                                </>
                              )}
                            </>
                          ) : (
                            <></>
                          )
                        ) : (
                          <>
                            <Flex space="">
                              <Text className="details" content="Action" />
                              <Dropdown
                                style={{
                                  width: "70%",
                                }}
                                items={actionItem}
                                defaultValue={actionItem[0]}
                                getA11ySelectionMessage={{
                                  onAdd: (item) => setActionDropdownValue(item),
                                }}
                              />
                            </Flex>
                            {actionDropdownValue === "Reply" && (
                              <Flex space="">
                                <Text
                                  className="details hr-admin-input"
                                  content="Reply"
                                />
                                <TextArea
                                  style={{
                                    width: "70%",
                                    height: "5rem",
                                  }}
                                  placeholder="Enter your reply"
                                  value={hrReply}
                                  onChange={(e) => setHrReply(e.target.value)}
                                />
                              </Flex>
                            )}
                            {actionDropdownValue === "Forward" && (
                              <>
                                <Flex space="">
                                  <Text
                                    className="details hr-admin-input"
                                    content="Forward To"
                                  />
                                  <Dropdown
                                    style={{
                                      width: "70%",
                                    }}
                                    items={forwardItems}
                                    placeholder="Select"
                                    getA11ySelectionMessage={{
                                      onAdd: (item) =>
                                        setForwardDropdownValue(item),
                                    }}
                                  />
                                </Flex>
                                <Flex space="">
                                  <Text
                                    className="details hr-admin-input"
                                    content="Forward Message"
                                  />
                                  <TextArea
                                    style={{
                                      width: "70%",
                                      height: "5rem",
                                    }}
                                    placeholder="Enter Forward Message"
                                    value={hrForwardMessage}
                                    onChange={(e) =>
                                      setHrForwardMessage(e.target.value)
                                    }
                                  />
                                </Flex>
                              </>
                            )}
                          </>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                )}
              </>
            )
          }
          confirmButton={
            postLoading
              ? null
              : actionDropdownValue === "Reply" &&
                !hrQuerypersondata?.ticketShow?.result?.reply
                ? {
                  disabled: !isFormValid,
                  iconPosition: "after",
                  content: "Reply",
                  onClick: handleReply,
                  styles: {
                    width: "50px",
                  },
                }
                : actionDropdownValue === "Forward" && {
                  disabled:
                    forwardDropdownValue.length === 0 ||
                    hrForwardMessage.length === 0,
                  iconPosition: "after",
                  content: "Forward",
                  onClick: handleForward,
                  styles: {
                    width: "50px",
                  },
                }
          }
        />
      </FluentUiProvider>
    </>
  );
}

export default ViewDialog;
