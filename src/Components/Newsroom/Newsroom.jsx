import React, { useEffect, useState } from "react";
// import "./Connect.css";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  Flex,
  Text,
  Image,
} from "@fluentui/react-northstar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "@microsoft/teams-js";
import homeBtn from "../../Assets/dashboardAssets/homeBtn.svg";
import { setTheme } from "../../redux/actions";
import homeBtnWhite from "../../Assets/dashboardAssets/homeBtnWhite.svg";
// import RightPanel from "../CareerAdvice/MainSection/RightPanel/RightPanel";
// import MainUserFeed from "./MainUserFeed/MainUserFeed.jsx";
import { resetConnectState } from "../../redux/actions";
import "./Newsroom.css";
import AllAnouncements from "./AllAnouncements/AllAnouncements";
import Tabs from "./Tabs/Tabs";
import { ToastContainer } from "react-toastify";
import { breadTheme } from "../../Themes/Themes.js";
const Newsroom = ({ hooks }) => {
  const dispatch = useDispatch();

  const [mainAppTheme, setMainAppTheme] = useState();

  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);

  //theme defined here ------------------------------------------

  useEffect(() => {
    app.initialize().then(() => {
      app.registerOnThemeChangeHandler((theme) => {
        setCurrTheme(theme);
      });
    });
  }, []);
  useEffect(() => {
    dispatch(setTheme(currTheme));
    if (currTheme === "dark") {
      hooks(teamsDarkTheme);
      setMainAppTheme(teamsDarkTheme);
    } else if (currTheme === "contrast") {
      hooks(teamsHighContrastTheme);
      setMainAppTheme(teamsHighContrastTheme);
    } else {
      hooks(teamsTheme);
      setMainAppTheme(teamsTheme);
    }
  }, [currTheme]);

  useEffect(() => {
    return () => {
      dispatch(resetConnectState());
    };
  }, [dispatch]);
  //theme defined here ------------------------------------------

  return (
    <>
      <Flex className="connect-main-container" column>
        <Flex column>
          <Flex
            className="breadcrumb-Flex"
            style={{
              paddingBottom: "0.5rem",
            }}
          >
            <Link to="/dashboard" className="breadcrumb-prev">
              <Flex style={{ gap: "0rem 0.5rem" }}>
                <Image
                  src={
                    CompanyReducer.theme == "default" ? homeBtn : homeBtnWhite
                  }
                />
                <FluentUiProvider
                  theme={mergeThemes(mainAppTheme, breadTheme(currTheme))}
                  style={{ background: "transparent" }}
                >
                  <Text style={{ background: "transparent" }}>Dashboard</Text>
                </FluentUiProvider>
              </Flex>
            </Link>
            <Text>{" > "}</Text>
            <Link to="/connect" className="breadcrumb-curr">
              Newsroom
            </Link>
          </Flex>
        </Flex>
        <Flex className="sub-connect-container">
          <Flex className="blog-section-connect">
            <Tabs type={"user"} />
          </Flex>
          <Flex className="blog-news-section-connect">
            <AllAnouncements />
          </Flex>
        </Flex>
        <ToastContainer />
      </Flex>
    </>
  );
};

export default Newsroom;
