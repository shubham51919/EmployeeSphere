import React, { useRef } from "react";
import {
  Flex,
  Text,
  Loader,
  Dialog,
  Divider,
  Input,
  Avatar,
  Button,
  Label,
  Image,
  CloseIcon,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  mergeThemes,
} from "@fluentui/react-northstar";

import {
  setParticularRefLoading,
  fillParticularRef,
} from "../../redux/actions";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import pdfImg from "../../Assets/referralAssets/pdf 1.png";

import particularRefDialog from "../../Assets/referralAssets/particularRefDialog.svg";

import { apiMain } from '../../Apis/ApiMain.js'
import { API_URL } from "../../config";

import axios from "axios";

const ParticularReferralDialog = ({ user }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const companyState = useSelector((state) => {
    return state.CompanyReducer;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const { particularRef, particularRefLoading } = companyState;
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };




  //theme starts here
  let appTheme = teamsTheme;

  if (companyState.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (companyState.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (companyState.theme === "default") {
    appTheme = teamsTheme;
  }

  function labelStyle(labelstatus) {
    if (labelstatus === "Interview Scheduled") {
      return {
        backgroundColor: "rgb(226,241,232)",
        color: "green",
      };
    } else if (labelstatus === "Rejected") {
      return {
        backgroundColor: "rgb(250,223,214)",
        color: "darkred",
      };
    } else if (labelstatus === "Not Responding") {
      return {
        backgroundColor: "rgb(243,172,62,0.6)",
        color: "darkred",
      };
    } else if (labelstatus === "Not Contacted") {
      return {
        backgroundColor: "rgb(160,160,160,0.4)",
        color: "black",
      };
    } else if (labelstatus === "Contacted") {
      return {
        backgroundColor: "rgb(48,109,166,0.3)",
        color: "white",
      };
    }
    return {
      backgroundColor: "rgb(219,232,251)",
      color: "darkblue",
    };
  }
  const segmentsTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${companyState.theme == "default" ? `#605E5C` : `#E8E8E8`
            }`,
        },
      },
    },
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.default.foreground,
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

  const ticketTheme = {
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Text: ({ colorScheme }) => ({
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
      Dialog: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Text: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Header: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };

  //theme ends here

  const dialogRef = useRef(null);

  const apiMainMain = apiMain(accessToken)

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
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "filename.pdf");
        document.body.appendChild(link);
        link.click();
      });
  };

  const handlePost = (id) => {
    try {
      const getParticularRef = async () => {
        dispatch(setParticularRefLoading(true));
        const response = await apiMainMain.get(
          `/getEmployeeReferalStatus?id=${id}`
        );
        dispatch(fillParticularRef(response.data));
        dispatch(setParticularRefLoading(false));
      };
      getParticularRef();
    } catch (error) {
      dispatch(setParticularRefLoading(false));
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
      //console.log(error);
    }
  };

  //captilize first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Dialog
      open={open}
      // ref={dialogRef}
      onOpen={() => {
        setOpen(true);
        handlePost(user.id);
      }}
      style={{ borderRadius: "2px" }}
      className="dialog-body-refferal"
      content={
        <>
          {particularRefLoading ? (
            <Flex>
              <Loader
                className="main-list-loader-referral-par"
                style={{
                  flexGrow: "1",
                }}
              />
            </Flex>
          ) : (
            <>
              <Divider />
              <Flex column className="main_dialog">
                <Flex space="between">
                  <Flex column style={{ width: "50%" }} gap="gap.medium">
                    <Flex space="between" hAlign="center">
                      <Text className="details" content="Candidate Name" />
                      <Text
                        className="detail"
                        content={`${particularRef?.firstname?.replace(
                          /(^\w{1})|(\s+\w{1})/g,
                          (letter) => letter.toUpperCase()
                        )} ${particularRef?.lastname?.replace(
                          /(^\w{1})|(\s+\w{1})/g,
                          (letter) => letter.toUpperCase()
                        )}`}
                      />
                    </Flex>
                    <Flex space="between">
                      <Text className="details" content="Candidate Number" />
                      <Text
                        className="detail"
                        content={`${particularRef?.Contactnumber}`}
                      />
                    </Flex>
                    <Flex space="between">
                      <Text className="details" content="Email Id" />
                      <Text
                        className="detail"
                        content={`${particularRef?.Emailaddress}`}
                      />
                    </Flex>
                    <Flex space="between">
                      <Text className="details" content="Date" />
                      <Text
                        className="detail"
                        content={`${new Date(
                          particularRef?.createdAt
                        ).toLocaleDateString("en-IN")}`}
                      />
                    </Flex>
                    <Flex space="between">
                      <Text className="details" content="Experience" />
                      <Text
                        className="detail"
                        content={`${particularRef?.experience}`}
                      />
                    </Flex>
                    <Flex space="between">
                      <Text className="details" content="Job Role" />
                      <Text
                        className="detail"
                        content={`${particularRef?.jobrole?.replace(
                          /(^\w{1})|(\s+\w{1})/g,
                          (letter) => letter.toUpperCase()
                        )}`}
                      />
                    </Flex>
                    <Flex space="between">
                      <Text className="details" content="Skills" />
                      <Text
                        className="detail"
                        style={{
                          height: "2.5rem",
                          overflowY: "auto",
                          textAlign: "justify",
                          textJustify: "inter-word",
                        }}
                        content={`${particularRef?.skills === ""
                          ? "N/A"
                          : particularRef?.skills?.replace(
                            /(^\w{1})|(\s+\w{1})/g,
                            (letter) => letter.toUpperCase()
                          )
                          }`}
                      />
                    </Flex>
                    <Flex>
                      <Text className="details" content="Resume" />
                      {particularRef?.Resume ? (
                        <Flex className="download-resume">
                          <Button
                            onClick={() => {
                              handleClick(particularRef.Resume);
                            }}
                            style={{
                              padding: " 0.5rem 1rem",
                              height: "auto",
                              width: "90%",
                            }}
                            className="detail btn-resume link-download"
                          >
                            <Flex>
                              <Image
                                src={pdfImg}
                                style={{ height: "20px", width: "20px" }}
                              />
                              <Text
                                style={{
                                  /* Set the width of the container to your desired value */
                                  width: "6rem",
                                  maxWidth: "8rem",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                className=""
                                content="Download"
                              />
                            </Flex>
                          </Button>
                        </Flex>
                      ) : (
                        <Text content="Download" className="no-link-download" />
                      )}
                    </Flex>
                  </Flex>
                  <Flex column style={{ width: "40%" }} gap="gap.large">
                    <Flex column gap="gap.smaller">
                      <Text className="details" content="Status" />
                      <Text
                        className="detail"
                        inverted
                        fluid
                        content={
                          particularRef?.status === null
                            ? "Pending"
                            : particularRef.status
                        }
                      />
                    </Flex>
                    <Divider />
                    <Flex column gap="gap.smaller">
                      <Text
                        className="details"
                        content="Comments"
                        style={{ paddingRight: "5rem" }}
                      />
                      <Input
                        disabled
                        className="detail comment-detail"
                        fluid
                        value={
                          particularRef?.comment === null
                            ? "No comment"
                            : particularRef?.comment
                        }
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  style={{
                    transform: "translate(0% , 90%)",
                  }}
                ></Flex>
              </Flex>
            </>
          )}
        </>
      }
      header=<Flex space="between" vAlign="center">
        <Flex gap="gap.small" vAlign="center">
          <Image src={particularRefDialog} />
          <Text content="Referral Status" />
        </Flex>
        <CloseIcon
          onClick={() => setOpen(false)}
          style={{
            cursor: "pointer",
          }}
        />
      </Flex>
      trigger={
        <FluentUiProvider theme={mergeThemes(appTheme, ticketTheme)}>
          <Flex
            row
            style={{ margin: "2vh 0vw", cursor: "pointer" }}
            gap="gap.medium"
          >
            <Flex style={{ width: "60%", margin: "0" }}>
              <Flex style={{ display: "flex" }}>
                <Avatar
                  className={`avatar-list${randomNumber(1, 5)}`}
                  size="large"
                  name={
                    capitalizeFirstLetter(user?.firstname) +
                    " " +
                    capitalizeFirstLetter(user?.lastname)
                  }
                />
              </Flex>
              <Flex
                className="parent-name-list"
                style={{ display: "flex", marginLeft: "12px", width: "10rem" }}
              >
                <Flex className="child-name-list child-name-list-col" column>
                  <Flex>
                    <Text
                      primary
                      content={`${user?.firstname?.replace(
                        /(^\w{1})|(\s+\w{1})/g,
                        (letter) => letter.toUpperCase()
                      )} ${user?.lastname?.replace(
                        /(^\w{1})|(\s+\w{1})/g,
                        (letter) => letter.toUpperCase()
                      )}`}
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    />
                  </Flex>
                  <FluentUiProvider
                    theme={mergeThemes(appTheme, segmentsTheme)}
                  >
                    <Flex className="referral-list-row">
                      <Text
                        primary
                        content={`Applied For:`}
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                        }}
                      />
                      <Text
                        primary
                        content={`${user?.roledatum?.role}`}
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          width: "100%",
                        }}
                      />
                    </Flex>
                  </FluentUiProvider>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              style={{ display: "flex", justifyContent: "end" }}
              styles={{
                padding: "1rem",
                marginLeft: "20%",
                maxWidth: "150px",
                maxHeight: "20px",
              }}
            >
              <Label
                style={labelStyle(
                  user?.status === null
                    ? "In-Process"
                    : user?.status === "Interview scheduled"
                      ? "Interview Scheduled"
                      : user?.status === "Rejected"
                        ? "Rejected"
                        : user?.status === "Not responding"
                          ? "Not Responding"
                          : user?.status === "Not contacted"
                            ? "Not Contacted"
                            : user?.status === "Contacted"
                              ? "Contacted"
                              : ""
                )}
                className="pointslabels"
                vAlign="center"
                content={
                  user?.status === null
                    ? "In-Process"
                    : user?.status === "Interview scheduled"
                      ? "Scheduled"
                      : user?.status === "Rejected"
                        ? "Rejected"
                        : user?.status === "Not responding"
                          ? "Not Responding"
                          : user?.status === "Not contacted"
                            ? "Not Contacted"
                            : user?.status === "Contacted"
                              ? "Contacted"
                              : ""
                }
              />
            </Flex>
          </Flex>
        </FluentUiProvider>
      }
    />
  );
};

export default ParticularReferralDialog;
