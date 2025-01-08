import React from "react";
import {
  Card,
  Flex,
  Text,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
} from "@fluentui/react-northstar";

import "../dashboard.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashCard = ({ carddata }) => {
  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const authReducer = useSelector((state) => {
    return state.authReducer;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail;
  });

  const { devEmail } = authReducer;

  if (!CompanyReducer.theme) {
  } else if (CompanyReducer.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "contrast") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "default") {
    appTheme = teamsTheme;
  }
  const Cardtheme = {
    componentVariables: {
      Card: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Link: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Card: {
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
      Link: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
  };
  const CardTextTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${CompanyReducer.theme == "default" ? `#605e5c` : `#FAFAFA`
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

  return (
    <Flex className="dashcard">
      <FluentUiProvider theme={mergeThemes(appTheme, Cardtheme)}>
        <Link
          to={
            ((carddata.content !== "Food Zone" &&
              carddata.content !== "Company Archive") ||
              devEmail.includes(name)) &&
            carddata.link
          }
          style={{ textDecoration: "none" }}
        >
          <Flex vAlign="center" className="singleCard" size="large">
            <Card
              style={
                carddata.content === "Food Zone" ||
                  carddata.content === "Company Archive"
                  ? { cursor: "not-allowed" }
                  : {}
              }
              compact
              vertical
              aria-roledescription="card with a preview image, text and action buttons"
              className="card-comp"
            >
              <Card.Preview horizontal className="card-image">
                <img
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    borderRadius: "12px 12px 0px 0px",
                  }}
                  src={carddata.icon}
                />
                {(carddata.content === "Food Zone" ||
                  carddata.content === "Company Archive") && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "20px",
                      }}
                    >
                      Coming Soon
                    </div>
                  )}
              </Card.Preview>
              <Card.Column className="card-column-ref">
                <FluentUiProvider theme={mergeThemes(appTheme, CardTextTheme)}>
                  <Card.Header>
                    <Text
                      content={carddata.content}
                      className={`card-head-ref ${CompanyReducer.theme == "dark"
                          ? `color-white`
                          : `color-black`
                        }`}
                    />
                  </Card.Header>
                  <Card.Body>
                    {/* <FluentUiProvider
                    theme={mergeThemes(appTheme, CardTextTheme)}
                  > */}
                    <Text
                      content={carddata.subcontent}
                      className={`card-sub-ref `}
                    />
                    {/* ${theme.theme == "dark" ? `color-white` : `color-grey`
                        } */}
                  </Card.Body>
                </FluentUiProvider>
              </Card.Column>
            </Card>
          </Flex>
        </Link>
      </FluentUiProvider>
    </Flex>
  );
};

export default DashCard;
