import React from "react";
import { Flex, Text, Header, Image } from "@fluentui/react-northstar";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";

import { useSelector } from "react-redux";

import RefDialog from "./DocDialog";
import DocDialog from "./DocDialog";

const DocHeader = () => {
  let appTheme = teamsTheme;
  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });
  if (!theme.theme) {
    // //console.log('Loading... header theme')
  } else {
    if (theme.theme === "dark") {
      // hooks(teamsDarkTheme);
      appTheme = teamsDarkTheme;
    } else if (theme.theme === "contrast") {
      // hooks(teamsHighContrastTheme);
      appTheme = teamsHighContrastTheme;
    } else if (theme.theme === "default") {
      // hooks(teamsTheme);
      appTheme = teamsTheme;
    }
  }
  const Headertheme = {
    // siteVariables: {
    //   colorScheme: {
    //     border: '#F5F5F5',
    //   },
    // },
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
      Text: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };
  const CardTextTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `#242424`,
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
    <Header className="header">
      <FluentUiProvider theme={mergeThemes(appTheme, Headertheme)}>
        <Flex space="between">
          <Flex
            gap="gap.small"
            column
            vAlign="center"
            space="between"
            className="new-ref-header"
            style={{
              position: "relative",
              overflow: "hidden",
              width: "70vw",
              height: "12rem",
              padding: "2.5rem 2rem",
            }}
          >
            <FluentUiProvider theme={mergeThemes(appTheme, CardTextTheme)}>
              <Text
                content={"Case Study"}
                className="referral-portal-heading"
              />
            </FluentUiProvider>
            <FluentUiProvider theme={mergeThemes(appTheme, CardTextTheme)}>
              <Text
                id="subheadingrefdash"
                content={
                  "Join our employee referral program and help us find the best talent! Easily recommend candidates and earn rewards for successful hires."
                }
                className="referral-portal-subheading"
                style={{ fontSize: "1rem", marginBottom: "2vh", zIndex: "2" }}
              />
            </FluentUiProvider>

            <div className="fluent-dialog">
              <DocDialog />
            </div>
          </Flex>
          {/* <Flex
            gap="gap.small"
            style={{ position: "relative", width: "32vw", height: "12rem" }}
          > */}
          {/* <Image
              src={headerimg}
              id="headerimgdash"
              style={{
                borderRadius: "8px",
                position: "absolute",
                zIndex: "2",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
              }}
            /> */}
          {/* <Image
              src={headerbg}
              style={{
                borderRadius: "8px",
                position: "absolute",
                zIndex: "1",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
              }}
            /> */}
          {/* </Flex> */}
        </Flex>
      </FluentUiProvider>
    </Header>
  );
};

export default DocHeader;
