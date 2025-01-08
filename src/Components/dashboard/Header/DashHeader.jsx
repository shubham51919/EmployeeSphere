import React from "react";
import {
  Flex,
  Text,
  Image,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  mergeThemes,
} from "@fluentui/react-northstar";
import headerimg from "../../../Assets/dashboardAssets/dashheaderimg.svg";
import headerbg from "../../../Assets/dashboardAssets/dashheaderbg.svg";

import "../dashboard.css";
import { } from "@fluentui/react-northstar";

import { useSelector } from "react-redux";
const DashHeader = ({ hooks }) => {
  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  if (!CompanyReducer.theme) {
    // //console.log('Loading... header theme')
  } else {
    // hooks(theme.theme);
    if (CompanyReducer.theme === "dark") {
      hooks(teamsDarkTheme);
      appTheme = teamsDarkTheme;
    } else if (CompanyReducer.theme === "contrast") {
      hooks(teamsHighContrastTheme);
      appTheme = teamsHighContrastTheme;
    } else if (CompanyReducer.theme === "default") {
      hooks(teamsTheme);
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
  return (
    <div className="dashHeader">
      <FluentUiProvider theme={mergeThemes(appTheme, Headertheme)}>
        <Flex space="between">
          <Flex gap="gap.small" column vAlign="center" id="headingdash">
            <Text
              size="largest"
              weight="semibold"
              content={" Welcome to CT's-Employee Portal"}
            />
            <Text
              size="large"
              id="subheadingdashmain"
              content={"Your Gateway to Seamless Collaboration."}
            />
          </Flex>
          <Flex
            gap="gap.small"
            style={{ position: "relative", width: "32vw", height: "30vh" }}
          >
            <Image
              src={headerimg}
              id="headerimgdash"
              style={{
                position: "absolute",
                zIndex: "2",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
              }}
            />
            <Image
              src={headerbg}
              style={{
                position: "absolute",
                zIndex: "1",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
              }}
            />
          </Flex>
        </Flex>
      </FluentUiProvider>
    </div>
  );
};

export default DashHeader;
