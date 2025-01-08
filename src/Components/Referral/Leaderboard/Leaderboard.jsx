import React, { useState, useEffect } from "react";
import medal1 from "../../../Assets/referralAssets/Vector.svg";
import medal2 from "../../../Assets/referralAssets/Vector-2.svg";
import medal3 from "../../../Assets/referralAssets/Vector-3.svg";
import { useSelector } from "react-redux";
import _ from "lodash";
import "../referral.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  fillReferredCandidates,
  fillReferredStatus,
  setYourReferralsLoading,
} from "../../../redux/actions";
import {
  Flex,
  List,
  Text,
  Segment,
  Image,
  Label,
  Avatar,
  Skeleton,
  Divider,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  ChevronDownIcon,
} from "@fluentui/react-northstar";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
import { TALSUITE_URL } from "../../../config";

const Leaderboard = () => {
  let appTheme = teamsTheme;
  const dispatch = useDispatch();

  const [showLoadMore, setShowLoadMore] = useState(false);
  const [visibleItemCount, setVisibleItemCount] = useState();
  // const [usersDetails, setUserDetails] = useState([]);
  const referredLeaderboard = useSelector(
    (state) => state.CompanyReducer.referredLeaderboard
  );

  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail;
  });

  const segmentsTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          backgroundHover: `${CompanyReducer.theme === "default" ? `black` : `white`
            }`,
          foreground: `${CompanyReducer.theme === "default" ? `#f5f5f5` : `#5B5FC7`
            }`,
        },
      },
    },
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.default.backgroundHover,
        backgroundColor: colorScheme.default.foreground,
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
  const leaderTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${CompanyReducer.theme === "default" ? `#605E5C` : `#E8E8E8`
            }`,
          backgroundHover: `${CompanyReducer.theme === "default" ? `white` : `rgb(45,44,44)`
            }`,
        },
      },
    },
    componentVariables: {
      Text: ({ colorScheme }) => ({
        color: colorScheme.default.foreground,
        backgroundColor: colorScheme.default.backgroundHover,
      }),
    },
    componentStyles: {
      Text: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };

  useEffect(() => {
    // Update visible item count based on window width
    const handleResize = () => {
      setVisibleItemCount(
        window.innerWidth < 480 ? 3 : referredLeaderboard?.length
      );
      setShowLoadMore(window.innerWidth < 480);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [referredLeaderboard?.length]);

  const handleLoadMore = () => {
    setVisibleItemCount(referredLeaderboard.length);
    setShowLoadMore(false);
  };

  const { referredStatus } = CompanyReducer;
  const mainStatus = referredStatus[0];
  const ApprovedReferrals = mainStatus?.ApprovedReferrals;

  // useEffect(() => {
  //   const loggedInUsername = name;
  //   let dashboardPayload = {
  //     Proc: "Cel_EmployeeRef_DashBoard",
  //     args: [
  //       { Key: "APIKey", Value: "c66c5d9f-ec1d-4cfc-b73a-8a503cc03c1b" },
  //       { Key: "EmployeeEmail", Value: loggedInUsername },
  //     ],
  //   };
  //   let dashboardConfig = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: `${TALSUITE_URL}/API/Call`,
  //     data: dashboardPayload,
  //   };

  //   const getDashboardData = async () => {
  //     try {
  //       let dashboardRes = await axios.request(dashboardConfig);
  //       dispatch(fillReferredStatus(JSON.parse(dashboardRes.data.Data)));
  //       console.log(JSON.parse(dashboardRes.data.Data));
  //       const parsedData = JSON.parse(dashboardRes.data?.Data);
  //       const leaderboardData = parsedData[2]?.slice(0, 20);
  //       setUserDetails(leaderboardData);
  //       dispatch(fillReferredCandidates(parsedData[1]));
  //       dispatch(setYourReferralsLoading(false));
  //     } catch (err) {
  //       toast.error("Something went wrong", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     }
  //   };
  //   getDashboardData();
  // }, [dispatch]);

  const LeaderboardItems = referredLeaderboard
    ?.slice(0, 20)
    .map((user, index) => {
      return {
        key: user?.Email,
        media: (
          <Flex
            style={{ margin: "2vh 0vw", cursor: "default !important" }}
            key={index}
          >
            <AvatarProfilePhoto mailId={user?.Email} name={user?.Name} />
          </Flex>
        ),
        header: (
          <Flex
            column
            style={{ margin: "2vh 0vw", cursor: "default !important" }}
          >
            <Text
              primary
              content={user?.Name}
              style={{ fontSize: "14px", fontWeight: "600" }}
            />
            <FluentUiProvider
              theme={mergeThemes(appTheme, leaderTheme)}
              style={{ background: "transparent" }}
            >
              <Text
                primary
                content={user?.HRMID}
                style={{ fontSize: "12px", fontWeight: "400" }}
              />
            </FluentUiProvider>
          </Flex>
        ),
        headerMedia: (
          <Flex
            gap="gap.medium"
            padding="padding.medium"
            vAlign="center"
            style={{ cursor: "default !important" }}
          >
            {user.Rank == 1 || user.Rank == 2 || user.Rank == 3 ? (
              <>
                <Image
                  src={
                    user.Rank === 1
                      ? medal1
                      : user.Rank === 2
                        ? medal2
                        : user.Rank === 3
                          ? medal3
                          : ""
                  }
                  style={{ width: "2vw" }}
                />
              </>
            ) : (
              <></>
            )}
            <Label
              style={{
                width: "fit-content",
                borderRadius: "5rem",
                padding: "4px 8px",
                fontSize: "12px",
                color: "white",
              }}
              color="brand"
              className="pointslabels"
              vAlign="center"
              content={`${user?.Total * 5} points`}
            />
          </Flex>
        ),
      };
    });

  if (!CompanyReducer.theme) {
    //console.log("Loading... header theme");
  } else if (CompanyReducer.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (CompanyReducer.theme === "default") {
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

  const segmentsSubTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          backgroundHover: `${CompanyReducer.theme === "default" ? `#f5f5f5` : `#5B5FC7`
            }`,
          foreground: `${CompanyReducer.theme === "default" ? `#5B5FC7` : `white`
            }`,
        },
      },
    },
    componentVariables: {
      Text: ({ colorScheme }) => ({
        color: colorScheme.default.foreground,
        backgroundColor: colorScheme.default.backgroundHover,
      }),
    },
    componentStyles: {
      Text: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
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
        <Flex className="ListMain" column gap="gap.large" space="between">
          <Flex
            space="between"
            gap="gap.medium"
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #D1D1D1",
            }}
            vAlign="center"
          >
            <Text
              primary
              content="Leaderboard"
              style={{ fontSize: "1rem", fontWeight: "600" }}
            />
            <Divider />
            <Flex
              className="scoreboard"
              gap="gap.medium"
              style={{ height: "1.5rem" }}
            >
              <Flex
                className="score-label-new"
                styles={{ marginRight: "0rem" }}
              >
                <Segment
                  styles={{ boxShadow: "none" }}
                  vAlign="center"
                  content={
                    <FluentUiProvider
                      theme={mergeThemes(appTheme, segmentsTheme)}
                    >
                      <Flex className="leader-head-tab">
                        <Text
                          content="Your Score :  "
                          style={{ fontSize: "0.8rem", fontWeight: "400" }}
                        />
                        <FluentUiProvider
                          theme={mergeThemes(appTheme, segmentsSubTheme)}
                        >
                          <Text
                            content={
                              referredStatus.length > 0
                                ? ApprovedReferrals * 5
                                : "0"
                            }
                            className="score-rank"
                            style={{ fontSize: "0.8rem", fontWeight: "600" }}
                          />
                        </FluentUiProvider>
                      </Flex>
                    </FluentUiProvider>
                  }
                  style={{ padding: "0rem 0.1rem" }}
                />
              </Flex>
              {/* <Flex
                className="score-label-new "
                styles={{ marginRight: "0rem" }}
              >
                <Segment
                  styles={{ boxShadow: "none" }}
                  vAlign="center"
                  content={
                    <FluentUiProvider
                      theme={mergeThemes(appTheme, segmentsTheme)}
                    >
                      <Flex className="leader-head-tab">
                        <Text
                          content="Rank  "
                          style={{ fontSize: "0.8rem", fontWeight: "400" }}
                        />
                        <FluentUiProvider
                          theme={mergeThemes(appTheme, segmentsSubTheme)}
                        >
                          <Text
                            content=" : 18th"
                            style={{ fontSize: "0.8rem", fontWeight: "600" }}
                            className="score-rank"
                          />
                        </FluentUiProvider>
                      </Flex>
                    </FluentUiProvider>
                  }
                  style={{ padding: "0rem 0.1rem" }}
                />
              </Flex> */}
            </Flex>
          </Flex>
          <Flex>
            <Flex vAlign="center" className="list-skeleton-parent">
              {referredLeaderboard.length === 0 ? (
                <List className="list-skeleton">
                  {_.times(3, (index) => (
                    <List.Item
                      key={index}
                      styles={{
                        backgroundColor:
                          index % 2 === 0
                            ? `${CompanyReducer.theme === "default"
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
              ) : (
                <Flex
                  column
                  gap="gap.small"
                  style={{
                    width: "100%",
                  }}
                >
                  <List
                    className="main-list-referral"
                    items={LeaderboardItems}
                    id="leaderboard-list"
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
              )}
            </Flex>
          </Flex>
        </Flex>
      </FluentUiProvider>
    </Segment>
  );
};

export default Leaderboard;
