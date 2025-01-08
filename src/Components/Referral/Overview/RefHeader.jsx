import React from "react";
import { Flex, Text, Header } from "@fluentui/react-northstar";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import "./header.css";
import { useSelector } from "react-redux";
import RefDialog from "./RefDialog";

const RefHeader = ({ myState, jobRoleData }) => {

  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });


  let jobRoleNameArray = jobRoleData.map((roles) => {
    return roles.Name;
  });

  let appTheme = teamsTheme;
  if (!theme.theme) {
  } else {
    if (theme.theme === "dark") {
      appTheme = teamsDarkTheme;
    } else if (theme.theme === "contrast") {
      appTheme = teamsHighContrastTheme;
    } else if (theme.theme === "default") {
      appTheme = teamsTheme;
    }
  }
  const Headertheme = {

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
              flexGrow: "1",
              position: "relative",
              overflow: "hidden",
              width: "70vw",
              height: "12rem",
              padding: "2.5rem 2rem",
            }}
          >

            <FluentUiProvider theme={mergeThemes(appTheme, CardTextTheme)}>
              <Text
                content={"Employee Referral"}
                className="referral-portal-heading"
              />
            </FluentUiProvider>
            <FluentUiProvider theme={mergeThemes(appTheme, CardTextTheme)}>
              <Text
                id="subheadingrefdash"
                content={"Connect, Refer, Earn Rewards! "}
                className="referral-portal-subheading"
                style={{ fontSize: "1rem", marginBottom: "2vh", zIndex: "2" }}
              />
            </FluentUiProvider>

            <div className="fluent-dialog">
              <RefDialog
                myState={myState}
                jobRoleName={jobRoleNameArray}
                jobRoleData={jobRoleData}
              />
            </div>
          </Flex>

        </Flex>
      </FluentUiProvider>
    </Header>
  );
};

export default RefHeader;
