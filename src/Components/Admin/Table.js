import React, { useState, useEffect, useRef } from "react";
import "./table.css";
import greyDot from "../../Assets/ReferralAdminAssests/greyDot.svg";
import blueDot from "../../Assets/ReferralAdminAssests/blueDot.svg";
import greenDot from "../../Assets/ReferralAdminAssests/greenDot.svg";
import orangeDot from "../../Assets/ReferralAdminAssests/orangeDot.svg";
import yellowDot from "../../Assets/ReferralAdminAssests/yellowDot.svg";
import particularRefDialog from "../../Assets/referralAssets/particularRefDialog.svg";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  Avatar,
  Dialog,
  Divider,
  Dropdown,
  Flex,
  Header,
  Image,
  Input,
  List,
  CloseIcon,
  Text,
  ArrowDownIcon,
  ArrowUpIcon,
  Loader,
  FlexItem,
  Button,
  ChevronEndIcon,
  ChevronStartIcon,
} from "@fluentui/react-northstar";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { apiMain } from '../../Apis/ApiMain.js'
import axios from "axios";
import { API_URL } from "../../config";

const Table = ({
  data,
  totalPage,
  currentPage,
  goToPage,
  setCurrentPage,
  setGoToPage,
}) => {
  const [ReferralData, setReferralData] = useState([]);

  useEffect(() => {
    setReferralData(data);
  }, [data]);

  // const [isDialogSubmitDisbaled, setIsDialogSubmitDisabled] = useState(true);
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const [isHovered, setIsHovered] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [showDownArrow, setShowDownArrow] = useState(true);
  const [showUpArrow, setShowUpArrow] = useState(false);
  const dialogContentRef = useRef(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [dialogStates, setDialogStates] = useState(
    new Array(data.length).fill(false)
  );
  // const [dropdownHover, setDropdownHover] = useState(false);
  // const dialogRef = useRef(null);

  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });


  if (!CompanyReducer.theme) {
  } else {
    if (CompanyReducer.theme === "dark") {
      appTheme = teamsDarkTheme;
    } else if (CompanyReducer.theme === "contrast") {
      appTheme = teamsHighContrastTheme;
    } else if (CompanyReducer.theme === "default") {
      appTheme = teamsTheme;
    }
  }


  const apiMainMain = apiMain(accessToken)

  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (dialogRef.current && !dialogRef.current.contains(event.target)) {
  //       const updatedStates = [...dialogStates];
  //       updatedStates.fill(false);
  //       setDialogStates(updatedStates);
  //     }
  //   };
  //   document.body.addEventListener("click", handleOutsideClick);
  //   return () => {
  //     document.body.removeEventListener("click", handleOutsideClick);
  //   };
  // }, []);

  const statusInfo = [
    { content: "Contacted", icon: blueDot },
    { content: "Not contacted", icon: greyDot },
    { content: "Interview scheduled", icon: greenDot },
    { content: "Rejected", icon: orangeDot },
    { content: "Not responding", icon: yellowDot },
  ];

  const buttonStyleDark = {
    border: "none",
    padding: "0.875rem 1rem",
    height: "auto",
    width: "70%",
    backgroundColor: isHovered ? "#1f1e1e" : "#2D2C2C",
  };

  const buttonStyleLight = {
    border: "none",
    padding: "0.875rem 1rem",
    height: "auto",
    width: "70%",
    backgroundColor: isHovered ? "#a7a7a7" : "#D1D1D1",
  };

  const dropdownDark = {
    // backgroundColor: dropdownHover ? "#1f1e1e" : "#2D2C2C",
    color: "#fff",
  };
  const dropdownLight = {
    backgroundColor: "none",
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePrev = () => {
    if (currentPage <= 1) {
      return;
    }
    setCurrentPage((prev) => {
      return prev - 1;
    });
    setGoToPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage >= totalPage) {
      return;
    }
    setCurrentPage((prev) => {
      return prev + 1;
    });
    setGoToPage(currentPage + 1);
  };
  const apptheme = {
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };

  const styles = {
    width: "100%",
  };

  const handleHrmSortingDown = () => {
    setShowDownArrow(false);
    setShowUpArrow(true);
    const sortedData = [...ReferralData].sort((a, b) => {
      const nameA = a.empName.toLowerCase();
      const nameB = b.empName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    setReferralData(sortedData);
  };
  const handleHrmSortingUp = () => {
    setShowDownArrow(true);
    setShowUpArrow(false);
    const sortedData = [...ReferralData].sort((a, b) => {
      const nameA = a.empName.toLowerCase();
      const nameB = b.empName.toLowerCase();
      if (nameA < nameB) return 1;
      if (nameA > nameB) return -1;
      return 0;
    });
    setReferralData(sortedData);
  };

  const [dialogFormData, setDialogFormData] = useState({
    id: "",
    status: "",
    comment: "",
    forwardTo: "",
    adminMail: name
  });

  const inputItems = [
    "Contacted",
    "Not contacted",
    "Interview scheduled",
    "Rejected",
    "Not responding",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDialogFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const { status, comment } = dialogFormData;
    const isValid = status !== "" && comment !== "";
    setIsFormValid(isValid);
  }, [dialogFormData]);

  const handleSubmit = (index) => {
    //validate email
    if (
      dialogFormData.forwardTo !== "" &&
      !validateEmail(dialogFormData.forwardTo)
    ) {
      toast.error("Please enter a valid email address", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setSubmitting(true);
    const updatedReferralData = ReferralData.map((referral) => {
      if (referral.id === dialogFormData.id) {
        return {
          ...referral,

          loadingStatus: 1, // Set loading status to true for the specific referral 1-> loading is true 0-> loading is false 2-> error in form submission
        };
      }

      return referral;
    });

    setReferralData(updatedReferralData);


    apiMainMain
      .post(`/submitBtnAdminPortal`, dialogFormData)
      .then((res) => {
        const updatedReferralData = ReferralData.map((referral) => {
          if (referral.id === dialogFormData.id) {
            return {
              ...referral,
              status: dialogFormData.status,
              // Set loading status back to false after successful form submission
            };
          }
          return referral;
        });
        //close the dialog box
        const updatedStates = [...dialogStates];
        updatedStates[index] = false;
        setReferralData(updatedReferralData);
        setDialogStates(updatedStates);
        setSubmitting(false);
        toast.success("Form has been submitted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setDialogFormData((prev) => {
          return {
            ...prev,
            id: "",
            status: "",
            comment: "",
            forwardTo: "",
          };
        });
      })
      .catch((err) => {
        setSubmitting(false);
        toast.error("Something went wrong. Please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const handleClick = (resume) => {
    const res = resume;



    let config = {
      method: 'post',
      responseType: "blob",
      maxBodyLength: Infinity,
      url: `${API_URL}/referralPortal/resume/${res}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    axios
      .request(config)

      .then((response) => {
        const url = window?.URL?.createObjectURL(new Blob([response?.data]));
        // //console.log(url);

        // Create a link element with the URL as the href attribute

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute("download", "filename.pdf"); // Set the filename

        // Trigger a click on the link element to download the file

        document.body.appendChild(link);

        link.click();
      });
  };
  const headingItems = [
    {
      header: (
        <FluentUiProvider theme={mergeThemes(appTheme)}>
          <Flex className="admin-heading-row" vAlign="center">
            <Flex className="admin-head-row-element-biggest" vAlign="center">
              <Text content="Employee Name | HRM ID" />
              {showDownArrow ? (
                <ArrowDownIcon
                  style={{ cursor: "pointer", width: "1rem" }}
                  onClick={handleHrmSortingDown}
                />
              ) : showUpArrow ? (
                <ArrowUpIcon
                  style={{ cursor: "pointer", width: "1rem" }}
                  onClick={handleHrmSortingUp}
                />
              ) : (
                <></>
              )}
            </Flex>
            <Text
              content="Candidate Name"
              className="admin-head-row-element-big"
            />
            <Text
              content="Candidate’s Email ID"
              className="admin-head-row-element-mid"
            />
            <Text content="Job Role" className="admin-head-row-element" />
            <Text content="Experience" className="admin-head-row-element" />
            <Text content="Skills" className="admin-head-row-element" />
            <Text content="Date" className="admin-head-row-element" />{" "}
          </Flex>
        </FluentUiProvider>
      ),
    },
  ];

  const rowItems = ReferralData.map((item, index) => {
    return {
      header: (
        <FluentUiProvider theme={mergeThemes(appTheme)}>
          <Dialog
            key={item.id}
            // ref={dialogRef}
            open={dialogStates[index]}
            style={{
              maxHeight: "80vh",
            }}
            className="admin-dialog-box"
            onOpen={() => {
              const updatedStates = [...dialogStates];
              updatedStates[index] = true;
              setDialogStates(updatedStates);

              setReferralData((prev) => {
                return prev.map((eachReferral) => {
                  if (eachReferral.id === item.id) {
                    return {
                      ...eachReferral,
                      seenStatus: 1, //1-> seen 0-> not seen
                    };
                  }
                  return eachReferral;
                });
              });
              setDialogFormData((prev) => {
                return {
                  ...prev,
                  id: item.id,
                };
              });
            }}
            trigger={
              <FluentUiProvider theme={mergeThemes(appTheme)}>
                <Flex
                  styles={styles}
                  className="admin-heading-row"
                  vAlign="center"
                  style={{ cursor: "pointer !important" }}
                // onClick={() => {
                //   setShowDialog(true);
                // }}
                >
                  <Flex
                    className="admin-heading-row-element-biggest row-item-main"
                    vAlign="center"
                  >
                    <Flex vAlign="center" gap="gap.small">
                      <FlexItem>
                        <Avatar name={item.empName} image={item.profilePhoto} />
                      </FlexItem>
                      <FlexItem>
                        <Flex column>
                          <Text
                            className="emp-name"
                            content={`${item.empName}`}
                          />
                          <Text
                            className="emp-id"
                            style={{ fontSize: "12px" }}
                            content={`${item.hrmId}`}
                          // className="ticket-rows-header name-sub-ticket"
                          />
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </Flex>
                  <Flex className="admin-heading-row-element-big row-item-main">
                    {item.status === null && (
                      <Image src={greyDot} style={{ paddingRight: "15px" }} />
                    )}
                    {item.status === "Not contacted" && (
                      <Image src={greyDot} style={{ paddingRight: "15px" }} />
                    )}
                    {item.status === "Interview scheduled" && (
                      <Image src={greenDot} style={{ paddingRight: "15px" }} />
                    )}
                    {item.status === "Contacted" && (
                      <Image src={blueDot} style={{ paddingRight: "15px" }} />
                    )}
                    {item.status === "Rejected" && (
                      <Image src={orangeDot} style={{ paddingRight: "15px" }} />
                    )}
                    {item.status === "Not responding" && (
                      <Image src={yellowDot} style={{ paddingRight: "15px" }} />
                    )}
                    <Text
                      content={
                        item.canName.trim().length > 0 ? item.canName : "N/A"
                      }
                    />
                  </Flex>
                  <Text
                    content={`${item.canEmail}`}
                    className="admin-heading-row-element-big row-item-main"
                  />
                  <Flex
                    className="admin-heading-row-element row-item-main"
                    style={{ padding: "0rem 1rem", alignItems: "center" }}
                  >
                    <Text content={`${item.role}`} />
                  </Flex>
                  <Flex
                    className="admin-heading-row-element row-item-main"
                    style={{ padding: "0rem 1rem", alignItems: "center" }}
                  >
                    <Text content={`${item.experience}`} />
                  </Flex>
                  <Flex
                    className="admin-heading-row-element row-item-main"
                    style={{ padding: "0rem 1rem", alignItems: "center" }}
                  >
                    <Text content={`${item.skills}`} />
                  </Flex>
                  <Flex
                    className="admin-heading-row-element row-item-main"
                    style={{ padding: "0rem 1rem", alignItems: "center" }}
                  >
                    <Text content={`${item.date}`} />
                  </Flex>
                </Flex>
              </FluentUiProvider>
            }
            header={
              <>
                <FluentUiProvider theme={appTheme}>
                  <Flex
                    space="between"
                    vAlign="center"
                    gap="gap.small"
                    style={{
                      marginBottom: "1rem",
                    }}
                  >
                    <Flex gap="gap.small" vAlign="center">
                      <Image src={particularRefDialog} />
                      <Header as="h4" content={`Referral Status`} />
                    </Flex>

                    <CloseIcon
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const updatedStates = [...dialogStates];
                        updatedStates[index] = false;
                        setDialogStates(updatedStates);
                      }}
                    />
                  </Flex>
                </FluentUiProvider>
              </>
            }
            content={
              isSubmitting ? (
                <Loader
                  size="medium"
                  style={{
                    minHeight: "60vh",
                  }}
                />
              ) : (
                <>
                  <FluentUiProvider theme={appTheme} ref={dialogContentRef}>
                    <hr
                      style={{
                        border: "1px solid #EDEBE9",
                        margin: "0px",
                      }}
                    />
                    <Flex column className="main_dialog_ref">
                      <Flex space="between">
                        <Flex column style={{ width: "40%" }} gap="gap.medium">
                          <Flex
                            space="between"
                            hAlign="center"
                            gap="gap.medium"
                          >
                            <Text
                              className="details"
                              content="Candidate Name"
                            />
                            <Text
                              className="detail"
                              style={{ overflow: "scroll" }}
                              content={
                                item.canName.trim().length > 0
                                  ? item.canName
                                  : "N/A"
                              }
                            />
                          </Flex>
                          <Flex space="between" gap="gap.medium">
                            <Text
                              className="details"
                              content="Candidate Number"
                            />
                            <Text className="detail" content={item.number} />
                          </Flex>
                          <Flex space="between" gap="gap.medium">
                            <Text className="details" content="Email Id" />
                            <Text
                              style={{ overflow: "scroll" }}
                              className="detail"
                              content={item.canEmail}
                            />
                          </Flex>
                          <Flex space="between" gap="gap.medium">
                            <Text className="details" content="Date" />
                            <Text className="detail" content={item.date} />
                          </Flex>
                          <Flex space="between" gap="gap.medium">
                            <Text className="details" content="Experience" />
                            <Text
                              className="detail"
                              content={item.experience}
                            />
                          </Flex>
                          <Flex space="between" gap="gap.medium">
                            <Text className="details" content="Job Role" />
                            <Text className="detail" content={item.role} />
                          </Flex>
                          <Flex space="between" gap="gap.medium">
                            <Text className="details" content="Skills" />
                            <Text
                              style={{ overflowY: "auto", height: "3rem" }}
                              className="detail"
                              content={item.skills}
                            />
                          </Flex>
                          <Flex
                            space="between"
                            gap="gap.medium"
                            className="referred-by"
                          >
                            <Text className="details" content="Referred By" />
                            <Flex column gap="gap.small">
                              <Flex
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <FlexItem>
                                  <Avatar
                                    image={item.profilePhoto}
                                    name={item.empName}
                                  />
                                </FlexItem>
                                <FlexItem>
                                  <Flex column>
                                    <Text
                                      style={{
                                        maxWidth: "10rem",
                                        paddingLeft: "0.5rem",
                                      }}
                                      className="emp-name"
                                      content={`${item.empName}`}
                                    // className="ticket-rows-header name-ticket"
                                    />
                                    <Text
                                      style={{
                                        maxWidth: "10rem",
                                        paddingLeft: "0.5rem",
                                      }}
                                      className="emp-id"
                                      content={`${item.hrmId}`}
                                    // className="ticket-rows-header name-sub-ticket"
                                    />
                                  </Flex>
                                </FlexItem>
                              </Flex>
                            </Flex>
                          </Flex>
                          <FluentUiProvider mergeThemes={appTheme}>
                            <Flex space="between" gap="gap.medium">
                              <Text className="details" content="Resume" />
                              {item.resume && (
                                // <Text
                                //   className="detail"
                                //   onClick={() => {
                                //     handleClick(item.resume);
                                //   }}
                                // >
                                <Button
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}
                                  onClick={() => {
                                    handleClick(item.resume);
                                  }}
                                  style={
                                    CompanyReducer.theme !== "default"
                                      ? buttonStyleDark
                                      : buttonStyleLight
                                  }
                                  className="detail btn-resume"
                                  content="View Resume"
                                >
                                  <Flex gap="gap.small" vAlign="horizontal">

                                    <Text
                                      style={{
                                        background: "transparent",
                                        width:
                                          "180px" /* Set the width of the container to your desired value */,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      className="details"
                                      content={item.resume}
                                    />
                                  </Flex>
                                </Button>
                                // </Text>
                              )}
                            </Flex>
                          </FluentUiProvider>
                        </Flex>
                        <Divider
                          vertical
                          style={{ width: "10px", height: "100%" }}
                        />
                        <Flex
                          column
                          style={{ width: "50%", height: "40%" }}
                          gap="gap.small"
                        >
                          <Flex gap="gap.smaller" vAlign="center">
                            <Text
                              className="details hr-admin-input"
                              content="Status"
                            />
                            <Dropdown
                              style={
                                CompanyReducer.theme === "dark"
                                  ? dropdownDark
                                  : dropdownLight
                              }
                              getA11ySelectionMessage={{
                                onAdd: (item) => {
                                  setDialogFormData((prev) => {
                                    return {
                                      ...prev,
                                      status: item,
                                    };
                                  });
                                },
                              }}
                              className={`Referral_Input `}
                              placeholder="Select"
                              items={inputItems}
                            />
                          </Flex>
                          <Flex gap="gap.smaller" vAlign="center">
                            <Text
                              className="details hr-admin-input"
                              content="Comments"
                            />
                            <Input
                              name="comment"
                              onChange={handleChange}
                              className="Referral_Input"
                              placeholder="Leave a comment..."
                            />
                          </Flex>
                          <Flex gap="gap.smaller" vAlign="center">
                            <Text className="details" content="Forward to" />
                            <Input
                              name="forwardTo"
                              onChange={handleChange}
                              className="Referral_Input"
                              placeholder="Enter mail ID"
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                  </FluentUiProvider>
                </>
              )
            }
            confirmButton={
              isSubmitting
                ? null
                : {
                  content: "Submit",
                  onClick: () => handleSubmit(index),
                  disabled: !isFormValid,
                }
            }
            cancelButton={
              isSubmitting
                ? null
                : {
                  content: "Cancel",
                  onClick: () => {
                    const updatedStates = [...dialogStates];
                    updatedStates[index] = false;
                    setDialogStates(updatedStates);
                  },
                }
            }
          />
        </FluentUiProvider>
      ),
    };
  });

  return (
    <>
      <FluentUiProvider
        theme={mergeThemes(apptheme, apptheme)}
        className={`list-container-admin ${CompanyReducer.theme === "dark" ? "list-container-admin-dark" : ""
          }`}
      >
        <List
          items={headingItems}
        //  className="header-list-admin"
        />
        <List
          items={rowItems}
        //  className="body-list-admin"
        />
      </FluentUiProvider>
      <Flex
        gap="gap.small"
        padding="padding.medium"
        style={{
          width: "100%",
          height: "2.83rem",
          paddingTop: "1.6rem",
        }}
      >
        <FlexItem>
          <Flex
            style={{
              padding: "0.5rem 1.25rem 1.25rem 0.7rem",
              gap: "1rem",
            }}
          >
            {statusInfo.map((item, index) => {
              return (
                <FlexItem>
                  <Flex vAlign="center" gap="gap.small">
                    <FlexItem>
                      <Image src={item.icon} style={{ height: "10px" }} />
                    </FlexItem>
                    <FlexItem>
                      <Text content={item.content} />
                    </FlexItem>
                  </Flex>
                </FlexItem>
              );
            })}
          </Flex>
        </FlexItem>
        <FlexItem push>
          <Flex
            vAlign="center"
            hAlign="center"
            gap="gap.small"
            style={{
              padding: "0.5rem 1.25rem 1.25rem 0.5rem",
            }}
          >
            <Button
              disabled={currentPage === 1}
              onClick={handlePrev}
              circular
              icon={<ChevronStartIcon />}
              title="Previous Page"
            />
            <Input
              min="1"
              inverted
              max={totalPage}
              className="page-input"
              value={goToPage}
              name="goToPage"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setGoToPage(value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  if (goToPage > 0 && goToPage <= totalPage) {
                    setCurrentPage(goToPage);
                  }
                }
              }}
            />
            <Text content={`of ${totalPage}`} />
            <Button
              disabled={currentPage === totalPage}
              onClick={handleNext}
              circular
              icon={<ChevronEndIcon />}
              title="Next Page"
            />
          </Flex>
        </FlexItem>
      </Flex>
      <ToastContainer />
    </>
  );
};

export default Table;
