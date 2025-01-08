import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Image,
  FlexItem,
  List,
  ChevronDownIcon,
  Divider,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  mergeThemes,
  Skeleton,
} from "@fluentui/react-northstar";
import { API_URL } from "../../../config";
import "./AllAnouncements.css";
import axios from "axios";
import { useSelector } from "react-redux";
import lightning from "../../../Assets/carrerAdviceAssets/light 1.svg";
// import { AnnouncementAPI } from "../../Connect/api/AnnouncementAPI/AnnouncementAPI.js";

const AllAnouncements = ({ posFix, flag }) => {
  const [newsLoading, setNewsLoading] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  let appTheme = teamsTheme;

  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  if (!CompanyReducer.theme) {
    // //console.log('Loading... header theme')
  } else {
    // hooks(theme.theme);
    if (CompanyReducer.theme === "dark") {
      appTheme = teamsDarkTheme;
    } else if (CompanyReducer.theme === "contrast") {
      appTheme = teamsHighContrastTheme;
    } else if (CompanyReducer.theme === "default") {
      appTheme = teamsTheme;
    }
  }
  const Headertheme = {
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
  const leaderTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${CompanyReducer.theme == "default" ? `#616161` : `#E8E8E8`
            }`,
        },
      },
    },
    componentVariables: {
      Text: ({ colorScheme }) => ({
        color: colorScheme.default.foreground,
        backgroundColor: colorScheme.brand.white,
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
    function handleResize() {
      if (window.innerWidth < 480) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    // Initial check
    handleResize();
    // Attach the event listener
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setNewsLoading(true);
    axios({
      method: "get",
      url: `${API_URL}/newsroom/getAnnouncementE`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        status: "active",
        pageNo: 1,
        pageLimit: 10,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          //console.log(response.data);
          response.data?.data?.data?.map((newItem) => {
            const newMainItem = {
              key: newItem.announcement_id,
              header: (
                <Flex
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <FluentUiProvider
                    theme={mergeThemes(appTheme, leaderTheme)}
                    style={{ background: "transparent" }}
                  >
                    <Text
                      className={`${CompanyReducer.theme == "default"
                          ? `Text-Value-light`
                          : `Text-Value-dark`
                        }`}
                      style={{
                        color: `${CompanyReducer.theme == "default"
                            ? `#616161 !important`
                            : `#E8E8E8 !important`
                          }`,
                      }}
                    >
                      {newItem?.description}
                    </Text>
                  </FluentUiProvider>
                </Flex>
              ),
              content: (
                <a
                  className="continue-link"
                  target="_blank"
                  href={newItem?.buttonlink}
                >
                  {newItem?.buttontext}
                </a>
              ),
            };
            setAllNews((prevItems) => [...prevItems, newMainItem]);
          });
          setNewsLoading(false);
        } else {
          //console.log("no err");
        }
      })
      .catch(() => {
        setNewsLoading(false);
      });
  }, []);

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="leftPanel" id="leftpanel-main">
      <FluentUiProvider
        theme={mergeThemes(appTheme, Headertheme)}
        style={{
          boxShadow:
            "0px 0.800000011920929px 1.7999999523162842px rgba(0, 0, 0, 0.13)",
        }}
        id={
          flag === "admin"
            ? posFix
              ? "posFix-true"
              : "posFix-false"
            : "posFix-default"
        }
      >
        {newsLoading ? (
          <Flex>
            <Skeleton animation="pulse">
              <Flex gap="gap.medium" column>
                {
                  //iterate 5 time for skeleton line
                  [1, 2, 3, 4, 5].map((item) => {
                    return <Skeleton.Line />;
                  })
                }
              </Flex>
            </Skeleton>
          </Flex>
        ) : (
          <Flex gap="gap.medium" column className="Main_Left_Cont">
            <FlexItem>
              <Flex
                column
                gap="gap.small"
              // style={{ justifyContent: "center", alignItems: "center" }}
              >
                <FlexItem>
                  <Flex column>
                    <Flex
                      space="between"
                      vAlign="center"
                      onClick={handleExpand}
                    >
                      <FlexItem>
                        <Flex gap="gap.small">
                          <Image src={lightning} />
                          <Text size="large" weight="regular">
                            Latest Announcements
                          </Text>
                        </Flex>
                      </FlexItem>
                      {isMobile && !isExpanded && (
                        <>
                          <ChevronDownIcon />
                        </>
                      )}
                    </Flex>
                  </Flex>
                </FlexItem>
              </Flex>
            </FlexItem>
            {!isMobile ? (
              allNews.length === 0 ? (
                <Flex
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text content="No Announcements" />
                </Flex>
              ) : (
                <List
                  id={
                    flag === "admin"
                      ? posFix
                        ? "posFix-true"
                        : "posFix-false"
                      : "posFix-default"
                  }
                  items={allNews}
                  className="news-list"
                />
              )
            ) : (
              isExpanded && (
                <>
                  <Divider size={2} />
                  <List
                    id={
                      flag === "admin"
                        ? posFix
                          ? "posFix-true"
                          : "posFix-false"
                        : "posFix-default"
                    }
                    items={allNews}
                    className="news-list"
                  />
                </>
              )
            )}
          </Flex>
        )}
      </FluentUiProvider>
    </div>
  );
};

export default AllAnouncements;
