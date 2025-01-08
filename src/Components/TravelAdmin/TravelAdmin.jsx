import React, { useEffect, useState } from "react";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  Flex,
  Divider,
  Text,
  Image,
} from "@fluentui/react-northstar";
import { useDispatch, useSelector } from "react-redux";
import homeBtn from "../../Assets/dashboardAssets/homeBtn.svg";
import homeBtnWhite from "../../Assets/dashboardAssets/homeBtnWhite.svg";
import { Link } from "react-router-dom";
import { breadTheme } from "../../Themes/Themes";
import TravelTicketList from "./TravelTicketList/TravelTicketList";
import ShowSingleTicket from "./ShowSingleTicket/ShowSingleTicket";
import "./TravelAdmin.css";
import { resetTravelState, setIsTicketSelected } from "../../redux/actions";

const TravelAdmin = () => {
  const dispatch = useDispatch();
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [mainAppTheme, setMainAppTheme] = useState();

  // theme
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

  let appTheme = teamsTheme;
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
  useEffect(() => {
    return () => {
      dispatch(resetTravelState());
    };
  }, []);

  return (
    <Flex className="connect-main-container" column style={{ height: "100%" }}>
      {/* bread crumbs   */}
      <Flex
        className="breadcrumb-Flex"
        style={{
          paddingBottom: "0.5rem",
        }}
      >
        <Link to="/dashboard" className="breadcrumb-prev">
          <Flex style={{ gap: "0rem 0.5rem" }}>
            <Image
              src={CompanyReducer.theme == "default" ? homeBtn : homeBtnWhite}
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
          Travel Admin
        </Link>
      </Flex>

      {/* Service Request Page */}
      <FluentUiProvider
        theme={mergeThemes(appTheme, Headertheme)}
        style={{ height: "96%", width: "100%", borderRadius: "4px" }}
      >
        <Flex style={{ height: "100%", width: "100%" }}>
          <Flex style={{ width: "30%" }}>
            <TravelTicketList />
          </Flex>
          <Flex
            style={{
              width: "100%",
            }}
          >
            <ShowSingleTicket />
          </Flex>
        </Flex>
      </FluentUiProvider>
    </Flex>
  );
};

export default TravelAdmin;
