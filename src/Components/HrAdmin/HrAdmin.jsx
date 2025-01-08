import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Input,
  Button,
  CloseIcon,
  Image,
} from "@fluentui/react-northstar";

import homeBtn from "../../Assets/dashboardAssets/homeBtn.svg";
import { Link } from "react-router-dom";
import BackButton from "../../Utilities/BackButton";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import { SearchIcon } from "@fluentui/react-icons-northstar";
import "./hradmin.css";
import TicketRows from "./TicketRows/TicketRows";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { setTheme } from "../../redux/actions";
import { app } from "@microsoft/teams-js";

import { useDispatch } from "react-redux";

const HrAdmin = ({ hooks }) => {
  const dispatch = useDispatch();
  const [searchClicked, setSearchClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState(1);
  const [clearClicked, setClearClicked] = useState(false);
  const [clearDisabled, setClearDisabled] = useState(true);
  const [searchStr, setSearchStr] = useState("");
  const [isSearchDisable, setIsSearchDisable] = useState(true);
  useEffect(() => {
    if (searchStr.length > 0) {
      setIsSearchDisable(false);
    } else {
      setIsSearchDisable(true);
    }
  }, [searchStr]);

  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });
  const [currTheme, setCurrTheme] = useState(theme.theme);

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
    const liElements = document.querySelectorAll(
      ".list-container-admin > ul > li"
    );
    liElements.forEach((li) => {
      li.style.borderBottom = `2px solid ${theme.theme !== "default" ? "#1C1D3C" : "whitesmoke"
        }`; // Set the desired border style here
    });
  }, [theme.theme]);
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
    <>
      <div
        className="adminmain"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Flex
          gap="gap.small"
          style={{
            top: "0",
            width: "100%",
            height: "50px",
            zIndex: "6",
          }}
        >
          <Flex
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "0.5rem 1.25rem 1.25rem 1.25rem",
              rowGap: "1rem",
              backgroundColor: "transparent",
              width: "100%",
            }}
          >
            <Flex className="breadcrumb-div">
              <BackButton currTheme={currTheme} />
              <Text>{">"}</Text>
              <Link to="/hradmin" className="breadcrumb-curr">
                HR Admin
              </Link>
            </Flex>

            <Flex style={{ width: "100%", justifyContent: "space-between" }}>
              <Flex style={{ gap: "1rem" }}>
                <Text
                  className="referral-admin-heading"
                  content="HR Admin Portal"
                />

                <Input
                  style={{ width: "18rem", height: "2rem" }}
                  name="searchText"
                  value={searchStr}
                  onChange={(e) => setSearchStr(e.target.value)}
                  inverted
                  icon={
                    clearDisabled ? (
                      <SearchIcon
                        onClick={() => {
                          setSearchClicked(true);
                          setClearDisabled(false);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <CloseIcon
                        onClick={() => {
                          setSearchStr("");
                          setGoToPage(1);
                          setClearDisabled(true);
                          setCurrentPage(1);
                          setClearClicked(true);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )
                  }
                  placeholder="Find"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setSearchClicked(true);
                      setClearDisabled(false);
                    }
                  }}
                />
                <Button
                  primary
                  disabled={isSearchDisable}
                  content="Search"
                  onClick={() => {
                    setSearchClicked(true);
                    setClearDisabled(false);
                  }}
                />
              </Flex>
            </Flex>

            <Flex className="list-parent-heading">
              <FluentUiProvider theme={mergeThemes(mainAppTheme, Headertheme)}>
                <TicketRows
                  searchStr={searchStr}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  goToPage={goToPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setGoToPage={setGoToPage}
                  setClearClicked={setClearClicked}
                  clearClicked={clearClicked}
                />
              </FluentUiProvider>
            </Flex>
          </Flex>
        </Flex>
      </div>
      <ToastContainer />
    </>
  );
};

export default HrAdmin;
