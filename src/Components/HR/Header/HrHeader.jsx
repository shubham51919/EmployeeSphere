import React from "react";
import "./header.css";
import { Flex, Text, Image, Header } from "@fluentui/react-northstar";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import hrheaderimg from "../../../Assets/hrAssets/hrheaderimg.svg";
import headerbgfront from "../../../Assets/faqAssets/headerbgfront.svg";
import { useSelector } from "react-redux";

const HrHeader = ({ hooks }) => {
  let appTheme = teamsTheme;
  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });
  if (!theme.theme) {
    // //console.log('Loading... header theme')
  } else {
    if (theme.theme === "dark") {
      hooks(teamsDarkTheme);
      appTheme = teamsDarkTheme;
    } else if (theme.theme === "contrast") {
      hooks(teamsHighContrastTheme);
      appTheme = teamsHighContrastTheme;
    } else if (theme.theme === "default") {
      hooks(teamsTheme);
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
    <Header className="hr-header">
      <FluentUiProvider theme={mergeThemes(appTheme, Headertheme)}>
        <Flex space="between" className="background-hr-header">
          <Flex
            gap="gap.small"
            column
            vAlign="center"
            space="between"
            style={{
              position: "relative",
              overflow: "hidden",
              width: "70vw",
              height: "12rem",
              padding: "2.5rem 2rem",
            }}
            className="refral-portal"
          >

            <Text content={"HR Queries"} className="referral-portal-heading" />
            <Text
              id="subheadingdash"
              content={"Customized HR Solutions at Your Fingertips! "}
              className="referral-portal-subheading"
              style={{ fontSize: "1rem", marginBottom: "2vh", zIndex: "2" }}
            />
          </Flex>
          <Flex
            gap="gap.small"
            style={{ position: "relative", width: "32vw", height: "12rem" }}
            className="hr-query-header-right"
          >
            {/* <Image
              src={hrheaderimg}
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
          </Flex>
        </Flex>
      </FluentUiProvider>
    </Header>
  );
};

export default HrHeader;
