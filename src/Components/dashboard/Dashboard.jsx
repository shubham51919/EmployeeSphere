import React, { useEffect, useState } from "react";
import DashCards from "./Cards/DashCards";
import {
  Flex,
  Text,
  Image,
  Loader,
  RetryIcon,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import circleDashboard from "../../Assets/dashboardAssets/circleDashboard.png";
import "./dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../redux/actions";
import { app } from "@microsoft/teams-js";
import EmptyBagQR from "../../Assets/dashboardAssets/EmptyBagQR.svg";
// import QREmptyBG from '../../Assets/dashboardAssets/QREmptyBg.svg'
import QREmptyBG from "../../Assets/dashboardAssets/newEmptyBg.svg";
import { foodPortalApi } from "../../Apis/foodPortalApi.js";

import lunchBg from "../../Assets/dashboardAssets/newLunchBg.svg";
import dinnerBg from "../../Assets/dashboardAssets/newDinnerBg.svg";
import lunchSunImg from "../../Assets/dashboardAssets/lunchSunImg.png";
import dinnerMoonImg from "../../Assets/dashboardAssets/dinnerMoonImg.png";

const Dashboard = ({ hooks }) => {
  const [qrLunchImage, setQrLunchImage] = useState();
  const [qrDinnerImage, setQrDinnerImage] = useState();
  const [qrSrc, setQrSrc] = useState();
  const [bgQrImg, setBgQrImg] = useState(0);
  const [topQrImg, setTopQrImg] = useState();
  const [qrLoader, setqrLoader] = useState(false);
  const [qrRefresh, setQrRefresh] = useState(false);
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const fullReduxObject = useSelector((state) => {
    return state;
  });
  const loggedUserState = useSelector((state) => {
    return state.formReducer;
  });
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const { loggedInUserDetails } = loggedUserState;
  const foodPortalapi = foodPortalApi(accessToken);

  //  1. To get QR Code

  useEffect(() => {
    setqrLoader(true);

    let data = {
      mail: userEmail,
    };

    foodPortalapi
      .post(`/getQRCode`, data)
      .then((response) => {
        setQrLunchImage(response.data?.data[0].LunchQRCode);
        setQrDinnerImage(response.data?.data[0].DinnerQRCode);

        setqrLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setqrLoader(false);
        setQrSrc(EmptyBagQR);
        setBgQrImg(0);
        setTopQrImg(null);
      });
  }, [qrRefresh]);

  // 2. Initialize QR component

  useEffect(() => {
    if (qrLunchImage) {
      setQrSrc(qrLunchImage);
      setBgQrImg(1);
      setTopQrImg(lunchSunImg);
    }
    if (qrDinnerImage) {
      setQrSrc(qrDinnerImage);
      setBgQrImg(2);
      setTopQrImg(dinnerMoonImg);
    } else if (!qrDinnerImage && !qrLunchImage) {
      setQrSrc(EmptyBagQR);
      setBgQrImg(0);
      setTopQrImg(null);
    }
  }, [qrLunchImage, qrDinnerImage]);

  const handleRefreshQr = () => {
    setQrRefresh(!qrRefresh);
  };

  //QR Code END

  // ************  Theme  ************
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [mainAppTheme, setMainAppTheme] = useState(teamsTheme);
  useEffect(() => {
    console.log(fullReduxObject);
    // if (!authReducer.isMobileDev) {
    app.initialize().then(() => {
      app.registerOnThemeChangeHandler((theme) => {
        setCurrTheme(theme);
      });
    });
  }, []);

  // 3 . Define Theme  here

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

  const Listtheme = {
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
  };

  const fixColorsBg = [
    "linear-gradient(180deg, #EAE8FF 0%, #F1E4FF 100%)",
    "linear-gradient(270deg, #FFF0A2 0%, #FFAE64 100%)",
    "linear-gradient(104.01deg, #C9D8FF -0.79%, #7C9AE4 97.34%)",
  ];

  return (
    <>
      <Flex className="dashboard" column>
        <Flex className="inner-container" column>
          {loggedInUserDetails?.FirstName ? (
            <Text
              content={`Welcome, ${loggedInUserDetails?.FirstName}`}
              className="text-dashboard-heading"
              vAlign="center"
            />
          ) : (
            <Text
              content={`Welcome`}
              className="text-dashboard-heading"
              vAlign="center"
            />
          )}

          <Flex
            column
            className="dash-container"
            style={{
              display: "flex",
              flexDirection: "column",
              background: "transparent",
            }}
          >
            <Flex className="main-head-container">
              <Flex className="main-sub-container-end">
                <FluentUiProvider theme={mergeThemes(mainAppTheme, Listtheme)}>
                  <Flex className="end-box" style={{ gap: "5px" }}>
                    <Flex
                      className="end-box-head"
                      style={{ fontWeight: "600" }}
                    >
                      Welcome to CT Employee
                    </Flex>
                    <Flex className="end-box-subhead">
                      Your Gateway to Seamless Collaboration.
                    </Flex>
                  </Flex>
                </FluentUiProvider>
              </Flex>
              {/* QREmptyBG */}
              <Flex
                className="main-sub-container-front"
                style={{ overflow: "hidden" }}
              >
                <FluentUiProvider theme={mergeThemes(mainAppTheme, Listtheme)}>
                  {qrLoader ? (
                    <Flex
                      style={{
                        height: "100%",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Loader />
                    </Flex>
                  ) : (
                    // <Flex column style={{ background: `url('${bgQrImg == null ? QREmptyBG:bgQrImg  }') no-repeat`, height: "100%", width: "100%", backgroundPosition: "center",backgroundSize: '100%', alignItems: "center", justifyContent: "center",gap:"1rem",borderRadius:"8px" }} className="qr-parent-box">
                    <Flex
                      className="qr-parent-box"
                      style={{
                        background: fixColorsBg[bgQrImg],
                      }}
                    >
                      <Image
                        src={circleDashboard}
                        className="image-circle-dashboard"
                      />

                      {topQrImg == null ? (
                        <Text
                          style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            zIndex: "1",
                          }}
                        >
                          Hurry up!
                        </Text>
                      ) : (
                        <Image
                          src={topQrImg}
                          style={{ zIndex: "1" }}
                          height="75px"
                          width="75px"
                        />
                      )}

                      {/* qr image */}
                      <Image
                        src={qrSrc}
                        style={{
                          zIndex: "1",
                          borderRadius: "16px",
                          border: `${topQrImg != null ? `2px solid white` : `none`
                            }`,
                          backgroundColor: `${topQrImg != null ? `white` : `none`
                            }`,
                        }}
                        height="120px"
                        width="120px"
                      />

                      {/* bottom text and image */}
                      <Flex
                        column
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <RetryIcon
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={handleRefreshQr}
                        />
                        {topQrImg == null ? (
                          <Text
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "400",
                              maxWidth: "60%",
                              textAlign: "center",
                              zIndex: "1",
                            }}
                          >
                            So you don't miss your meal today!
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "400",
                              maxWidth: "60%",
                              textAlign: "center",
                              zIndex: "1",
                            }}
                          >
                            Scan, Dine, & Unwind{" "}
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                  )}
                </FluentUiProvider>
              </Flex>
            </Flex>
            <DashCards />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Dashboard;
