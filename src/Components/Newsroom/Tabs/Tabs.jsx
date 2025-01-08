import React, { useState } from "react";
// import "./MainUserFeed.css";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Flex,
  Menu,
  mergeThemes,
  Text,
} from "@fluentui/react-northstar";

import { useSelector } from "react-redux";
import MyFeed from "../MyFeed/MyFeed";
import MyPosts from "../MyPosts/MyPosts";
import MyRequest from "../Requests/Requests";
import Announcement from "../../Newsroom Admin/Announcement/Announcement";

const Tabs = ({ type }) => {
  //theme defined here ------------------------------------------
  let appTheme = teamsTheme;
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

  //theme Ended here ------------------------------------------
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    {
      key: "myfeed",
      content: <Text content="My Feed" />,
      onClick: () => {
        setActiveIndex(0);
      },
    },
    {
      key: "myposts",
      content: <Text content="My Posts" />,
      onClick: () => {
        setActiveIndex(1);
      },
    },
    {
      key: type == "admin" ? "myApprovals" : "myRequests",
      content:
        type == "admin" ? (
          <Text content="My Approvals" />
        ) : (
          <Text content="My Requests" />
        ),
      onClick: () => {
        setActiveIndex(2);
      },
    },
    type == "admin" && {
      key: "Announcements",
      content: <Text content="Announcements" />,
      onClick: () => {
        setActiveIndex(3);
      },
    },
  ];

  return (
    <>
      <FluentUiProvider
        theme={mergeThemes(appTheme, Headertheme)}
        style={{ height: "100%", width: "100%" }}
      >
        <Flex column>
          <Flex className="main-feed-heading" column gap="gap.medium">
            <Menu
              defaultActiveIndex={0}
              items={items}
              underlined
              primary
              className="menu-inside-class"
            />
            {activeIndex === 0 && <MyFeed type={type} />}
            {activeIndex === 1 && <MyPosts type={type} />}
            {activeIndex === 2 && <MyRequest type={type} />}
            {activeIndex === 3 && <Announcement type={type} />}
          </Flex>
        </Flex>
      </FluentUiProvider>
    </>
  );
};

export default Tabs;
