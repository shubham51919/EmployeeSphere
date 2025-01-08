import React, { useEffect, useState } from "react";
import { ChevronDownMediumIcon } from "@fluentui/react-icons-northstar";
import { useSelector } from "react-redux";
import lineBlue from "../../../Assets/hrAssets/lineBlue.png";
import lineGrey from "../../../Assets/hrAssets/lineGrey.png";

import {
  Flex,
  Text,
  Button,
  Label,
  Image,
  Divider,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";

const Resolved = ({
  ticket,
  handleFurtherClick,
  iconVisible,
  dividerVisible,
  escBtnVisible,
  lineImage,
}) => {
  const [appTheme, setAppTheme] = useState();
  const [showFullContent, setShowFullContent] = useState(false);
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const whitetheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${CompanyReducer.theme === "default" ? `white` : `rgb(29,29,28)`
            }`,
        },
      },
    },
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
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
  useEffect(() => {
    //console.log(theme.theme, 'hr query theme')
    if (CompanyReducer.theme === "dark") {
      setAppTheme(teamsDarkTheme);
    } else if (CompanyReducer.theme === "contrast") {
      setAppTheme(teamsHighContrastTheme);
    } else if (CompanyReducer.theme === "default") {
      setAppTheme(teamsTheme);
    }
    //console.log(mergeThemes(appTheme, whitetheme), '--->mergeTheme')
  }, [CompanyReducer]);

  const getDate = (newdate) => {
    const { date } = convertUTCtoIST(newdate);
    return date;
  };

  const getTime = (newtime) => {
    const { time } = convertUTCtoIST(newtime);
    return time;
  };
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

  const leaderTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${CompanyReducer.theme === "default" ? `#424242` : `white`
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
  function labelStyle(labelstatus) {
    if (labelstatus === "Resolved") {
      return {
        backgroundColor: "rgb(226,241,232)",
        borderRadius: "10.5rem",
        padding: "0rem 0.5vw",
        marginRight: "1.2rem",
        color: "green",
        fontSize: "0.7rem",
        marginLeft: "0.8rem",
      };
    } else if (labelstatus === "Pending") {
      return {
        backgroundColor: "rgb(250,223,214)",
        borderRadius: "10.5rem",
        padding: "0rem 0.5vw",
        marginRight: "1.2rem",
        color: "darkred",
        fontSize: "0.7rem",
        marginLeft: "0.8rem",
      };
    }
    return {
      backgroundColor: "rgb(219,232,251)",
      borderRadius: "10.5rem",
      padding: "0rem 0.5vw",
      marginRight: "1.2rem",
      marginLeft: "0.8rem",

      color: "darkblue",
      fontSize: "0.7rem",
    };
  }
  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };
  const truncatedContent =
    ticket?.reply.length > 400
      ? ticket?.reply.slice(0, 400) + "..."
      : ticket?.reply;
  return (
    <FluentUiProvider
      theme={mergeThemes(appTheme, whitetheme)}
      style={{
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        width: "48vw",
      }}
    >
      <Flex>
        {lineImage ? (
          <Image
            src={lineBlue}
            height="100%"
            style={{ paddingTop: "1rem", minWidth: "8px" }}
          />
        ) : (
          <></>
        )}

        <Flex
          column
          className=""
          style={{
            padding: "0.5rem",
            width: "48vw",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <Flex
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "96%",
            }}
          >
            <Flex style={{ gap: "0.5rem" }}>
              {iconVisible ? (
                <ChevronDownMediumIcon />
              ) : (
                <div style={{ width: "1rem" }}></div>
              )}

              <FluentUiProvider
                theme={mergeThemes(appTheme, leaderTheme)}
                style={{ background: "transparent" }}
              >
                <Text
                  style={{ fontSize: "0.875rem", fontWeight: "600" }}
                  content={`Ticket ${ticket?.id}`}
                />
              </FluentUiProvider>
            </Flex>
            <Flex vAlign="start" style={{ gap: "0.5rem" }}>
              <FluentUiProvider
                theme={mergeThemes(appTheme, leaderTheme)}
                style={{ background: "transparent" }}
              >
                <Text
                  content={`${getTime(ticket?.updatedAt)}`}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "400",
                  }}
                />
              </FluentUiProvider>
              <FluentUiProvider
                theme={mergeThemes(appTheme, leaderTheme)}
                style={{ background: "transparent" }}
              >
                <Text
                  content={`${getDate(ticket?.updatedAt)}`}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "400",
                  }}
                />
              </FluentUiProvider>
              <Flex
                padding="padding.medium"
                vAlign="center"
                className="pointslabel-parent"
                style={{ padding: "0rem !important" }}
              >
                <Label
                  style={labelStyle("Resolved")}
                  vAlign="center"
                  content="Resolved"
                />
              </Flex>
            </Flex>
          </Flex>
          <Flex
            column
            style={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              width: "96%",
            }}
          >
            <FluentUiProvider
              theme={mergeThemes(appTheme, leaderTheme)}
              style={{ background: "transparent" }}
            >
              <Text
                content={"Description given by the HR"}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                }}
              />
            </FluentUiProvider>

            <FluentUiProvider
              theme={mergeThemes(appTheme, leaderTheme)}
              style={{ background: "transparent", textAlign: "justify" }}
            >
              <Text
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                }}
              >
                {showFullContent ? ticket?.reply : truncatedContent}
                <br></br>
                {ticket?.reply.length > 100 && (
                  <Text
                    onClick={toggleContent}
                    style={{
                      marginTop: "10px",
                      color: "grey",
                      cursor: "pointer",
                    }}
                  >
                    {showFullContent ? " Read Less" : " Read More..."}
                  </Text>
                )}
              </Text>
            </FluentUiProvider>
          </Flex>
          {escBtnVisible ? (
            <Button
              onClick={() => handleFurtherClick(ticket)}
              tinted
              className="btn-esclate-further"
              content="Esclate"
              style={{
                marginLeft: "1.5rem",
                paddingRight: "1.5rem",
                fontSize: "0.75rem",
                width: "4.75rem",
                height: "2rem",
              }}
            />
          ) : (
            <></>
          )}
        </Flex>
      </Flex>

      {dividerVisible ? (
        <FluentUiProvider
          theme={mergeThemes(appTheme, whitetheme)}
          className="divider-hr"
          style={{ background: "transparent !important" }}
        >
          <Divider style={{ width: "54vw" }} />
        </FluentUiProvider>
      ) : (
        <></>
      )}
    </FluentUiProvider>
  );
};

export default Resolved;
