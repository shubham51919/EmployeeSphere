import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  Flex, Image, Text
} from "@fluentui/react-northstar";
import React, { useEffect, useState } from "react";
import homeBtn from "../Assets/dashboardAssets/homeBtn.svg";
import homeBtnWhite from "../Assets/dashboardAssets/homeBtnWhite.svg";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
function BackButton({ currTheme }) {


  const breadTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${currTheme == "default" ? `black` : `white`}`,
          backgroundHover: `${currTheme == "default" ? `#f5f5f5` : `rgb(59,58,57)`
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
  const [mainAppTheme, setMainAppTheme] = useState();

  useEffect(() => {
    if (currTheme === "dark") {
      setMainAppTheme(teamsDarkTheme);
    } else if (currTheme === "contrast") {
      setMainAppTheme(teamsHighContrastTheme);
    } else {
      setMainAppTheme(teamsTheme);
    }
  }, [currTheme]);
  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });
  return (
    <Link to="/dashboard" className="breadcrumb-prev">
      <Flex style={{ gap: "0rem 0.5rem" }}>
        <Image src={theme.theme == "default" ? homeBtn : homeBtnWhite} />
        <FluentUiProvider
          theme={mergeThemes(mainAppTheme, breadTheme)}
          style={{ background: "transparent" }}
        >
          <Text>Dashboard</Text>
        </FluentUiProvider>
      </Flex>
    </Link>
  );
}

export default BackButton;
