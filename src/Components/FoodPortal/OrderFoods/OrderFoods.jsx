import React, { useEffect, useState } from "react";
import axios from "axios";
import bowlImg from "../../../Assets/foodPortalAssets/bowl.svg";

import { API_URL } from "../../../config.js";
import { useDispatch, useSelector } from "react-redux";
import { renderOnSubmitOrderDetails } from "../../../redux/actions";

import {
  Provider as FluentUiProvider,
  Flex,
  Dropdown,
  Menu,
  Image,
  Divider,
  tabListBehavior,
  Skeleton,
  RadioGroup,
  Text,
  Button,
  SkeletonInput,
} from "@fluentui/react-northstar";
import { ToastContainer, toast } from "react-toastify";

import { Input } from "@fluentui/react-components";
import _ from "lodash";
const OrderFoods = ({
  setRerenderUseEffect,
  isOrderedLoading,
  setIsOrderedLoading,
  orderMenu,
}) => {
  const dispatch = useDispatch();
  const formReducer = useSelector((state) => {
    return state.formReducer;
  });
  const foodReducer = useSelector((state) => {
    return state.foodReducer;
  });
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });

  const { FirstName, LastName } = formReducer;

  const [tabIndex, setTabIndex] = useState(0);
  const [afterTen, setAfterTen] = useState(false);
  const [afterThree, setAfterThree] = useState(false);
  const [lunchRadio, setLunchRadio] = useState("1");
  const [dinnerRadio, setDinnerRadio] = useState("1");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationDin, setSelectedLocationDin] = useState(null);
  const [selectedChapati, setSelectedChapati] = useState(null);
  const [selectedChapatiDin, setSelectedChapatiDin] = useState(null);
  // const [isOrderLoading, setIsOrderLoading] = useState(false);

  const { orderedLunch, orderedDinner } = foodReducer;

  ////Time
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

  useEffect(() => {
    setAfterTen(isAfterTen());
    setAfterThree(isAfterThree());
  }, []);

  useEffect(() => {
    if ((orderedLunch && !orderedDinner) || isAfterTen()) {
      setTabIndex(1);
    }
    if (orderedDinner && !orderedLunch && !isAfterTen()) {
      setTabIndex(0);
    }
  }, [orderedDinner, orderedLunch]);

  ///Time End

  const items = [
    {
      key: "Lunch",
      content: <Text content="Lunch" />,
      disabled: orderedLunch || afterTen ? true : false,
      onClick: () => handleTabChange(0),
    },
    {
      key: "Dinner",
      content: <Text content="Dinner" />,
      disabled: orderedDinner || afterThree ? true : false,
      onClick: () => handleTabChange(1),
    },
  ];
  const inputItems = ["Jhalana", "Malviya Nagar", "Mansarover"];

  // const [checkLunch, setCheckLunch] = useState(false)
  // const [checkDinner, setCheckDinner] = useState(false)

  const handleRadioChange1 = (event) => {
    setLunchRadio(event.target.value);
  };
  const handleRadioChange2 = (event) => {
    setDinnerRadio(event.target.value);
  };

  const handleTabChange = (clickedValue) => {
    if (tabIndex == 0 && tabIndex != clickedValue) {
      setTabIndex(1);
    } else if (tabIndex == 1 && tabIndex != clickedValue) {
      setTabIndex(0);
    }
  };
  const handleClearStates = () => {
    setLunchRadio("1");
    setDinnerRadio("1");
    setSelectedLocation(null);
    setSelectedLocationDin(null);
    setSelectedChapati(null);
    setSelectedChapatiDin(null);
  };
  const handleOrderSubmit = () => {
    setIsOrderedLoading(true);
    let lunchPayload = JSON.stringify({
      mealType: tabIndex == 0 ? "lunch" : "dinner",
      mail: name,
      name: `${FirstName} ${LastName}`,
      chapati: tabIndex == 0 ? selectedChapati : selectedChapatiDin,
      rice: tabIndex == 0 ? lunchRadio : dinnerRadio,
      location: tabIndex == 0 ? selectedLocation : selectedLocationDin,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/orderFood`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
        "Content-Type": "application/json",
      },
      data: lunchPayload,
    };
    axios
      .request(config)
      .then((response) => {
        setRerenderUseEffect(true);
        setIsOrderedLoading(false);
        dispatch(renderOnSubmitOrderDetails(true));
        if (
          response.data.data.message ==
          "You can only book your lunch before 10 AM for Today Or After 9 PM for Tommorow"
        ) {
          toast.error(response.data.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        toast.success("Order Successful!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong , Try Again ", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  useEffect(() => {
    console.log(tabIndex, "---->tab index");
  }, [tabIndex]);

  const FoodTheme = {
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Input: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.backgroundHover,
      }),
    },
    componentStyles: {
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Input: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };

  if (orderMenu === false) return <></>;
  return (
    <FluentUiProvider
      theme={FoodTheme}
      style={{ width: "50%", height: "calc(100% - 20px)", borderRadius: "8px" }}
    >
      <Flex className="flex-container-menu" style={{ padding: "1rem 1rem" }}>
        <Flex
          column
          className="flex-item-menu ordermenu-class"
          style={{ overflowY: "auto", height: "95%" }}
          vAlign="center"
          space="between"
        >
          <Flex gap="gap.small" vAlign="center">
            <Image
              src={bowlImg}
              className="image-icon"
              style={{ height: "20px", width: "20px" }}
            />
            <Text content="Order Meal" className="text-menu" />
          </Flex>

          {isOrderedLoading ? (
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
          ) : (
            <>
              <Menu
                defaultActiveIndex={tabIndex}
                items={items}
                className="menu-tabs-food"
                underlined
                primary
                accessibility={tabListBehavior}
                aria-label="Today's events"
              />
              <Flex
                className="flex-container-submenu"
                style={{ gap: "6%" }}
                column
              >
                {tabIndex == 0 ? (
                  <>
                    <Flex className="order-head-items" vAlign="center">
                      <Flex className="order-top-container">
                        Location (Lunch)
                      </Flex>
                    </Flex>
                    <Dropdown
                      clearable
                      disabled={orderedLunch || isAfterTen() ? true : false}
                      items={inputItems}
                      placeholder="Select Location"
                      checkable
                      getA11ySelectionMessage={{
                        onAdd: (item) => setSelectedLocation(item),
                      }}
                    />
                    <Flex className="order-head-items" vAlign="center">
                      <Flex className="order-top-container">Customization</Flex>
                    </Flex>
                    <Flex className="custom-food">
                      <RadioGroup
                        defaultCheckedValue="1"
                        onChange={handleRadioChange1}
                        disabled={orderedLunch || isAfterTen() ? true : false}
                        className="radio-btn-food"
                        items={[
                          {
                            key: "1",
                            label: "Rice",
                            value: "1",
                            disabled:
                              orderedLunch || isAfterTen() ? true : false,
                          },
                          {
                            key: "2",
                            label: "Without Rice",
                            value: "2",
                            disabled:
                              orderedLunch || isAfterTen() ? true : false,
                          },
                        ]}
                      />
                      <Flex
                        gap="gap.small"
                        vAlign="center"
                        className="radio-btn-food"
                      >
                        <Text content="Chapati" />
                        <Dropdown
                          clearable
                          disabled={orderedLunch || isAfterTen() ? true : false}
                          items={[1, 2, 3, 4, 5, 6]}
                          placeholder="Select "
                          style={{ width: "70%" }}
                          checkable
                          getA11ySelectionMessage={{
                            onAdd: (item) => setSelectedChapati(item),
                          }}
                        />{" "}
                      </Flex>
                    </Flex>
                  </>
                ) : (
                  <>
                    <Flex className="order-head-items" vAlign="center">
                      <Flex className="order-top-container">
                        Location (Dinner){" "}
                      </Flex>
                    </Flex>
                    <Dropdown
                      disabled={orderedDinner || isAfterThree() ? true : false}
                      items={inputItems}
                      placeholder="Select Location"
                      checkable
                      getA11ySelectionMessage={{
                        onAdd: (item) => setSelectedLocationDin(item),
                      }}
                    />
                    <Flex className="order-head-items" vAlign="center">
                      <Flex className="order-top-container">Customization</Flex>
                    </Flex>
                    <Flex className="custom-food">
                      <RadioGroup
                        onChange={handleRadioChange2}
                        className="radio-btn-food"
                        defaultCheckedValue="1"
                        items={[
                          {
                            key: "1",
                            label: "Rice",
                            value: "1",
                            disabled:
                              orderedDinner || isAfterThree() ? true : false,
                          },
                          {
                            key: "2",
                            label: "Without Rice",
                            value: "2",
                            disabled:
                              orderedDinner || isAfterThree() ? true : false,
                          },
                        ]}
                      />
                      <Flex
                        gap="gap.small"
                        vAlign="center"
                        className="radio-btn-food"
                      >
                        <Text content="Chapati" />
                        <Dropdown
                          clearable
                          disabled={
                            orderedDinner || isAfterThree() ? true : false
                          }
                          items={[1, 2, 3, 4, 5, 6]}
                          placeholder="Select "
                          style={{ width: "70%" }}
                          checkable
                          getA11ySelectionMessage={{
                            onAdd: (item) => setSelectedChapatiDin(item),
                          }}
                        />{" "}
                      </Flex>
                    </Flex>
                  </>
                )}
                <Flex
                  className="btn-container-order-foods"
                  style={{
                    width: "100%",
                    gap: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    style={{ width: "50%", height: "2.5rem" }}
                    disabled={
                      (!orderedLunch && !isAfterTen()) ||
                        (!orderedDinner && !isAfterThree())
                        ? false
                        : true
                    }
                    onClick={handleClearStates}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ width: "50%", height: "2.5rem" }}
                    disabled={
                      (!orderedLunch && !isAfterTen()) ||
                        (!orderedDinner && !isAfterThree())
                        ? false
                        : true
                    }
                    primary
                    onClick={handleOrderSubmit}
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
      <ToastContainer />
    </FluentUiProvider>
  );
};

export default OrderFoods;
