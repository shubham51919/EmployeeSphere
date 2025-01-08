import React, { useEffect, useState } from "react";
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
import { setTheme } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "@microsoft/teams-js";
import homeBtn from "../../Assets/dashboardAssets/homeBtn.svg";
import homeBtnWhite from "../../Assets/dashboardAssets/homeBtnWhite.svg";
import { resetConnectState } from "../../redux/actions";
import "../Newsroom/Newsroom.css";
import AllAnouncements from "../Newsroom/AllAnouncements/AllAnouncements";
import Tabs from "../Newsroom/Tabs/Tabs";
import { ToastContainer } from "react-toastify";
import { breadTheme } from "../../Themes/Themes";

const Newsroom = ({ hooks }) => {
  const dispatch = useDispatch();

  //theme defined here ------------------------------------------

  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [mainAppTheme, setMainAppTheme] = useState();

  useEffect(() => {
    app.initialize().then(() => {
      app.registerOnThemeChangeHandler((theme) => {
        setCurrTheme(theme);
      });
      app.getContext().then((context) => {
        setCurrTheme(context.app.theme);
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
              Newsroom Admin
            </Link>
          </Flex>
        </Flex>
        <Flex className="sub-connect-container">
          <Flex className="blog-section-connect">
            <Tabs type={"admin"} />
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
