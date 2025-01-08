import React, { useEffect, useState } from "react";
import BackButton from "../../Utilities/BackButton";
import axios from "axios";
import {
  Provider as FluentUiProvider,
  Flex,
  Loader,
  Dialog,
  Button,
  Dropdown,
  Text,
  Skeleton,
  SkeletonInput,
  Animation,
} from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import "./foodPortal.css";
import Menu from "./Menu/Menu";
import Timings from "./Timings/Timings";
import FoodPortalHeading from "./FoodPortalHeader/FoodPortalHeading.jsx";
import OrderFoods from "./OrderFoods/OrderFoods";
import Details from "./Details/Details";
import Feedback from "./Feedback/Feedback";
import FeedbackFull from "./Feedback/FeedbackFull";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
//food status check
import { useDispatch, useSelector } from "react-redux";
import {
  CurrStatusLunch,
  CurrStatusDinner,
  checkLunchAfterTen,
  checkDinnerAfterThree,
} from "../../redux/actions";
import { API_URL } from "../../config.js";

const FoodPortal = () => {
  //primary location dialog

  const formReducer = useSelector((state) => state.formReducer);
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const { FirstName, LastName, EmployeeID } = formReducer.loggedInUserDetails;
  const [primaryLocation, setPrimaryLocation] = useState(false);
  const [primaryLocationLoader, setPrimaryLocationLoader] = useState(false);

  const inputItems = ["Jhalana", "Malviya Nagar", "Mansarover"];

  const [locationDropdown, setLocationDropdown] = useState(null);
  const [lunchData, setLunchData] = useState({});
  const [dinnerData, setDinnerData] = useState({});
  const dispatch = useDispatch();
  const [isOrderedLoading, setIsOrderedLoading] = useState(true);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  // const [rerenderWhenOrderSubmitted, setRerenderWhenOrderSubmitted] =
  // useState(false);
  const [rerenderUseEffect, setRerenderUseEffect] = useState(false);
  const [renderUseEffectForInit, setRenderUseEffectForInit] = useState(true);
  const [showFull, setShowFull] = useState(false);
  const [orderMenu, setOrderMenu] = useState(null);

  useEffect(() => {
    if (window.innerWidth <= 480) {
      setOrderMenu(true);
    } else {
      setOrderMenu(null);
    }

    const handleResize = () => {
      window.innerWidth <= 480 ? setOrderMenu(true) : setOrderMenu(null);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const [isRerender, setIsReRender] = useState(false);
  const FoodTheme = {
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

  //check primary location of user

  useEffect(() => {
    let data = {
      mail: name,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/checkUserExist`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.data.status == 0) {
          setPrimaryLocation(false);
        } else if (response.data.data.status == 1) {
          setPrimaryLocation(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePrimarySubmit = () => {
    setPrimaryLocationLoader(true);
    const axios = require("axios");
    let data = {
      name: FirstName + " " + LastName,
      mail: name,
      hrmId: EmployeeID,
      location: locationDropdown,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/addUser`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.data.message == "Please Provide necessary Fields") {
          toast.error("Please Try Again Later !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success("Location Added !", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setPrimaryLocation(false);
        }
        setPrimaryLocationLoader(false);
      })
      .catch((error) => {
        toast.error("Location Not Added , Try Again!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setPrimaryLocationLoader(false);
        console.log(error);
      });
  };

  //check food status on first render here

  useEffect(() => {
    //set loaders
    console.log(rerenderUseEffect, "rerenderUseEffect");

    const axios = require("axios");
    let data = {
      mail: name,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/checkFoodStatus`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    if (renderUseEffectForInit || rerenderUseEffect) {
      setIsOrderedLoading(true);
      setIsStatusLoading(true);
      axios
        .request(config)
        .then((response) => {
          //set loaders
          setIsOrderedLoading(false);
          setIsStatusLoading(false);
          setRenderUseEffectForInit(false);
          setRerenderUseEffect(false);
          // dispatch(renderOnSubmitOrderDetails(false));
          if (response.data.data.status == 3) {
            setLunchData(response.data.data.lunch);
            setDinnerData(response.data.data.dinner);
            dispatch(CurrStatusLunch(true));
            dispatch(CurrStatusDinner(true));
            setShowFull(false);
          } else if (response.data.data.status == 2) {
            setDinnerData(response.data.data.dinner);
            dispatch(CurrStatusLunch(false));
            dispatch(CurrStatusDinner(true));
            setShowFull(false);
          } else if (response.data.data.status == 1) {
            setLunchData(response.data.data.lunch);
            dispatch(CurrStatusLunch(true));
            dispatch(CurrStatusDinner(false));
            setShowFull(false);
          } else if (response.data.data.status == 0) {
            dispatch(CurrStatusLunch(false));
            dispatch(CurrStatusDinner(false));
            setShowFull(true);
          }
          if (isAfterTen()) {
            dispatch(checkLunchAfterTen(true));
          }
          if (isAfterThree()) {
            dispatch(checkDinnerAfterThree(true));
          }
        })
        .catch((error) => {
          setIsOrderedLoading(false);
          setIsStatusLoading(false);
          console.log(error);
        });
    }
  }, [dispatch, rerenderUseEffect]);

  const isAfterTen = () => {
    const currentDate = new Date();

    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    const tenAMMinutes = 10 * 60;
    const ninePMMinutes = 21 * 60;

    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    if (
      currentTimeInMinutes >= tenAMMinutes &&
      currentTimeInMinutes <= ninePMMinutes
    ) {
      return true;
    } else {
      return false;
    }
  };
  const isAfterThree = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const threePMMinutes = 15 * 60;
    const ninePMMinutes = 21 * 60;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    if (
      currentTimeInMinutes >= threePMMinutes &&
      currentTimeInMinutes <= ninePMMinutes
    ) {
      return true;
    } else {
      return false;
    }
  };
  const dialogAnimation = {
    keyframe: {
      from: {
        opacity: 0,
        // animatior on opne dialog
        transform: "translate3d(0, 0, 0) scale(0.9)",
      },
      to: {
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
      },
    },
    duration: "250ms",
  };
  return (
    <Flex column className="main-ref">
      <Flex
        style={{ flexDirection: "row" }}
        className="full-container"
        valign="center"
      >
        <Text
          className={orderMenu ? "active" : ""}
          onClick={() => setOrderMenu(true)}
        >
          Order Food
        </Text>
        <Text
          className={orderMenu ? "" : "active"}
          onClick={() => setOrderMenu(false)}
        >
          Order Details
        </Text>
      </Flex>
      <Flex className="breadcrumb-div" style={{ marginBottom: "0.5rem" }}>
        <BackButton currTheme={"default"} />
        <Text>{">"}</Text>
        <Link to="/food-portal" className="breadcrumb-curr">
          Food Portal
        </Link>
      </Flex>
      <FluentUiProvider
        theme={{
          animations: {
            dialogAnimation,
          },
        }}
      >
        <Animation name="dialogAnimation">
          <Dialog
            label="Location"
            style={{ display: "hidden" }}
            open={primaryLocation}
            content={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  margin: "1rem 0rem",
                  display: "flex",
                  gap: "1rem",
                  flexDirection: "column",
                }}
              >
                {primaryLocationLoader ? (
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Loader />
                  </div>
                ) : (
                  <>
                    <Text content="Select your Primary Location" />
                    <Dropdown
                      style={{ width: "100%" }}
                      items={inputItems}
                      placeholder="Select"
                      checkable
                      clearable
                      getA11ySelectionMessage={{
                        onAdd: (item) => setLocationDropdown(item),
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "end",
                        width: "100%",
                      }}
                    >
                      <Button
                        style={{ height: "2.2rem", width: "30%" }}
                        primary
                        onClick={handlePrimarySubmit}
                        content="Submit"
                      />
                    </div>
                  </>
                )}
              </div>
            }
            header="Office Location"
          />
        </Animation>
      </FluentUiProvider>

      <Flex className="main-content">
        <Flex className="main-content-header">
          <Menu orderMenu={orderMenu} />
          <Timings orderMenu={orderMenu} />
          <FoodPortalHeading orderMenu={orderMenu} />
        </Flex>
        <Flex className="main-content-sub">
          <OrderFoods
            setRerenderUseEffect={setRerenderUseEffect}
            isOrderedLoading={isOrderedLoading}
            setIsOrderedLoading={setIsOrderedLoading}
            orderMenu={orderMenu}
          />
          <Flex
            className="mobile-order"
            column
            style={{
              width: "50%",
              gap: "1rem",
              minHeight: "calc(100% - 20px)",
              maxHeight: "calc(100% - 20px)",
            }}
          >
            {isStatusLoading ? (
              <FluentUiProvider
                theme={FoodTheme}
                style={{ width: "100%", height: "100%", borderRadius: "8px" }}
              >
                <Flex
                  style={{
                    padding: "1rem 1rem",
                  }}
                  column
                  gap="gap.small"
                >
                  <Skeleton animation="pulse">
                    <Flex column gap="gap.small">
                      {_.times(2, (i) => (
                        <SkeletonInput
                          key={i}
                          style={{
                            width: "100%",
                          }}
                        />
                      ))}
                      {_.times(3, (i) => (
                        <SkeletonInput
                          key={i}
                          style={{
                            width: "75%",
                          }}
                        />
                      ))}
                    </Flex>
                  </Skeleton>
                </Flex>
              </FluentUiProvider>
            ) : (
              <>
                {showFull ? (
                  <>
                    {orderMenu === null ? (
                      <FeedbackFull orderMenu={orderMenu} />
                    ) : (
                      <>
                        <Details
                          setIsStatusLoading={setIsStatusLoading}
                          lunchData={lunchData}
                          dinnerData={dinnerData}
                          setRerenderUseEffect={setRerenderUseEffect}
                          orderMenu={orderMenu}
                        />
                        <FeedbackFull orderMenu={orderMenu} />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {orderMenu === null ? (
                      <>
                        <Details
                          setIsStatusLoading={setIsStatusLoading}
                          lunchData={lunchData}
                          dinnerData={dinnerData}
                          setRerenderUseEffect={setRerenderUseEffect}
                          orderMenu={orderMenu}
                        />

                        <Feedback orderMenu={orderMenu} />
                      </>
                    ) : (
                      <>
                        <Details
                          setIsStatusLoading={setIsStatusLoading}
                          lunchData={lunchData}
                          dinnerData={dinnerData}
                          setRerenderUseEffect={setRerenderUseEffect}
                          orderMenu={orderMenu}
                        />
                        <FeedbackFull orderMenu={orderMenu} />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      <ToastContainer />
      <Dialog
        className="rightAnimation"
        style={{
          position: "absolute",
          right: "0%",
          height: "100%",
        }}
        cancelButton="Navigate protocol"
        confirmButton="Program firewall"
        content="Reboot firewall"
        header="Synthesize interface"
        headerAction="Override protocol"
        trigger={<Button content="A trigger" />}
      />
    </Flex>
  );
};

export default FoodPortal;
