import React, { useEffect, useState } from "react";
import _ from "lodash";
import EmptyImg from "../../../Assets/referralAssets/EmptyImg.svg";
import { useSelector } from "react-redux";
import "../referral.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiMain } from "../../../Apis/ApiMain.js";
import ParticularReferralDialog from "../ParticularReferralDialog";
import {
  setYourReferralsLoading,
  fillReferredCandidates,
} from "../../../redux/actions";
import {
  Flex,
  List,
  Text,
  Segment,
  Skeleton,
  Image,
  Button,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  ChevronDownIcon,
  Avatar,
  Label,
} from "@fluentui/react-northstar";
import { capitalizeFirstLetter } from "../../../Utilities/utilities";

const AllReferrals = () => {
  // const dispatch = useDispatch();

  const [showLoadMore, setShowLoadMore] = useState(false);

  // const userEmail = useSelector((state) => {
  //   return state.authReducer.userEmail;
  // });
  const companyState = useSelector((state) => {
    return state.CompanyReducer;
  });
  // const accessToken = useSelector((state) => state.authReducer.accessToken);
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  // const apiMainMain = apiMain(accessToken);
  let appTheme = teamsTheme;

  const { referredCandidates, isYourReferralsLoading } = companyState;
  const [visibleItemCount, setVisibleItemCount] = useState(
    referredCandidates?.length
  );
  useEffect(() => {
    // Update visible item count based on window width
    const handleResize = () => {
      setVisibleItemCount(
        window.innerWidth < 480 ? 3 : referredCandidates?.length
      );
      setShowLoadMore(window.innerWidth < 480);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [referredCandidates?.length]);

  const handleLoadMore = () => {
    setVisibleItemCount(referredCandidates.length);
    setShowLoadMore(false);
  };
  function labelStyle(labelstatus) {
    if (labelstatus === "Joined") {
      return {
        backgroundColor: "rgb(226,241,232)",
        color: "green",
      };
    } else if (labelstatus === "Rejected") {
      return {
        backgroundColor: "rgb(250,223,214)",
        color: "darkred",
      };
    } else if (labelstatus === "Currently Unmatched/Position Closed") {
      return {
        backgroundColor: "rgb(243,172,62,0.6)",
        color: "darkred",
      };
    } else if (labelstatus === "Fresher") {
      return {
        backgroundColor: "#8B8000",
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
  const YourReferralsItems = referredCandidates
    ?.slice(0, visibleItemCount)
    .reverse()
    .map((user, index) => {
      return (
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
                name={capitalizeFirstLetter(user?.Name)}
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
                    content={capitalizeFirstLetter(user?.Name)}
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
                    content={`${user?.Designation}`}
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
                user?.Status === null
                  ? "In-Process"
                  : user?.Status === "In Process"
                    ? "In Process"
                    : user?.Status === "Rejected"
                      ? "Rejected"
                      : user?.Status === "Not responding"
                        ? "Not Responding"
                        : user?.Status === "Currently Unmatched/Position Closed"
                          ? "Currently Unmatched/Position Closed"
                          : user?.Status === "Fresher"
                            ? "Fresher"
                            : user?.Status === "In Database"
                              ? "In Database"
                              : user?.Status === "Joined"
                                ? "Joined"
                                : "Not Contacted"
              )}
              className="pointslabels"
              vAlign="center"
              content={
                user?.Status === null
                  ? "In-Process"
                  : user?.Status === "In Process"
                    ? "In Process"
                    : user?.Status === "Rejected"
                      ? "Rejected"
                      : user?.Status === "Not responding"
                        ? "Not Responding"
                        : user?.Status === "Currently Unmatched/Position Closed"
                          ? "Currently Unmatched/Position Closed"
                          : user?.Status === "Fresher"
                            ? "Fresher"
                            : user?.Status === "In Database"
                              ? "In Database"
                              : user?.Status === "Joined"
                                ? "Joined"
                                : "Not Contacted"
              }
            />
          </Flex>
        </Flex>
      );
    });

  // useEffect(() => {
  //   const getEmpRef = async () => {
  //     dispatch(setYourReferralsLoading(true));
  //     try {
  //       let empRef = await apiMainMain.get(
  //         `/getReferalsOfEmployee?email=${userEmail}`
  //       );
  //       dispatch(fillReferredCandidates(empRef.data));
  //       dispatch(setYourReferralsLoading(false));
  //     } catch (error) {
  //       dispatch(setYourReferralsLoading(false));
  //       toast.error("Something went wrong", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     }
  //   };
  //   getEmpRef();
  // }, []);

  if (companyState.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (companyState.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (companyState.theme === "default") {
    appTheme = teamsTheme;
  }
  const Listtheme = {
    componentVariables: {
      List: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      List: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
  };

  return (
    <Segment
      className="segment-list"
      style={{
        padding: "1rem",
        boxShadow:
          "0px 0.800000011920929px 1.7999999523162842px rgba(0, 0, 0, 0.13)",
      }}
    >
      <FluentUiProvider theme={mergeThemes(appTheme, Listtheme)}>
        <Flex
          className="ListMain"
          column
          gap="gap.large"
          space="between"
          style={{ padding: "0" }}
        >
          <Flex
            // space="between"
            gap="gap.medium"
            style={{
              padding: "0",
              marginBottom: "1rem",
              borderBottom: "1px solid #D1D1D1",
              width: "96%",
            }}
          >
            <Text
              primary
              content="Your Referrals"
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                padding: "0rem 0rem 1rem 0rem",
              }}
            />
          </Flex>

          <Flex>
            <Flex vAlign="center" className="list-skeleton-parent">
              {isYourReferralsLoading ? (
                <List className="list-skeleton">
                  {_.times(5, (index) => (
                    <List.Item
                      key={index}
                      styles={{
                        backgroundColor:
                          index % 2 === 0
                            ? `${companyState.theme === "default"
                              ? `#f5f2f2`
                              : `rgb(29,29,28)`
                            }`
                            : "transparent",
                      }}
                      media={
                        <Skeleton animation="wave">
                          <Skeleton.Shape round width="36px" height="36px" />
                        </Skeleton>
                      }
                      header={
                        <Skeleton
                          animation="wave"
                          styles={{
                            paddingBottom: "5px",
                          }}
                        >
                          <Skeleton.Line width="100px" />
                        </Skeleton>
                      }
                      content={
                        <>
                          <Skeleton animation="wave">
                            <Skeleton.Line width="300px" />
                          </Skeleton>
                        </>
                      }
                      index={index}
                    />
                  ))}
                </List>
              ) : YourReferralsItems.length > 0 ? (
                <>
                  <Flex
                    column
                    style={{
                      flexGrow: "1",
                    }}
                  >
                    <List
                      className="main-list-referral"
                      items={YourReferralsItems}
                      id="yourReferral-list"
                    />
                    {showLoadMore && (
                      <Flex
                        style={{
                          justifyContent: "center",
                          marginTop: "1rem",
                        }}
                      >
                        <Text
                          onClick={handleLoadMore}
                          content={
                            <Flex gap="gap.small" vAlign="center">
                              <Text content="Load More" />
                              <ChevronDownIcon />
                            </Flex>
                          }
                          style={{ margin: "auto" }}
                        />
                      </Flex>
                    )}
                  </Flex>
                </>
              ) : (
                <Flex
                  style={{
                    height: "30vw",
                    width: "45vw",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  vAlign="center"
                >
                  <Image
                    className="empty-image"
                    src={EmptyImg}
                    style={{ height: "20rem", width: "20rem" }}
                  />
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </FluentUiProvider>
    </Segment>
  );
};
export default AllReferrals;
