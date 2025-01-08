import React, { useState } from "react";
import {
  Provider as FluentUiProvider,
  Flex,
  Image,
  Input,
  Button,
  Divider,
  Text,
  Checkbox,
  Dialog,
  Skeleton,
  SkeletonInput,
  CloseIcon,
} from "@fluentui/react-northstar";
import { useSelector } from "react-redux";
import { API_URL } from "../../../config.js";
import { useBooleanKnob } from "@fluentui/docs-components";
import bowlImg from "../../../Assets/foodPortalAssets/bowl.svg";
import emptyImgOrders from "../../../Assets/foodPortalAssets/emptyImgOrders.svg";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";
import axios from "axios";

const Details = ({
  setIsStatusLoading,
  lunchData,
  dinnerData,
  setRerenderUseEffect,
  orderMenu,
}) => {
  const [lunchCancel, setLunchCancel] = useState(false);
  const [dinnerCancel, setDinnerCancel] = useState(false);
  const [isOrderedLoading, setIsOrderedLoading] = useState(false);
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const FoodData = useSelector((state) => {
    return state.foodReducer;
  });

  const { orderedLunch, orderedDinner } = FoodData;

  const handleLunchChangeCancel = () => {
    setLunchCancel(!lunchCancel);
  };
  const handleDinnerChangeCancel = () => {
    setDinnerCancel(!dinnerCancel);
  };
  const handleCancelOrders = () => {
    setIsStatusLoading(true);

    if (lunchCancel) {
      let data = {
        mail: name,
        mealType: "lunch",
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/foodPortal/cancelMeal`,
        headers: {
          Authorization: `Bearer ${accessTkn}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (
            response.data.data.message ===
            "You can only cancel your lunch before 11 am"
          ) {
            toast.error(response.data.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
            setIsStatusLoading(false);
          } else {
            toast.success(response.data.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
            setRerenderUseEffect(true);
            setIsStatusLoading(false);
          }
        })
        .catch((error) => {
          toast.error("Something Went Wrong. Please try Again.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
          console.log(error);
          setIsStatusLoading(false);
        });
    }
    if (dinnerCancel) {
      let data = {
        mail: name,
        mealType: "dinner",
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/foodPortal/cancelMeal`,
        headers: {
          Authorization: `Bearer ${accessTkn}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (
            response.data.data.message ==
            "You can only cancel your dinner before 5 pm"
          ) {
            setIsStatusLoading(false);
            toast.error(response.data.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          } else {
            setRerenderUseEffect(true);
            setIsStatusLoading(false);
            toast.success(response.data.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          }
        })
        .catch((error) => {
          toast.error("Something Went Wrong. Please try Again.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
          console.log(error);
        });
    }
  };

  const [open, setOpen] = useBooleanKnob({
    name: "open",
  });
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

  if (orderMenu === true) return <></>;
  return (
    <>
      <FluentUiProvider
        theme={FoodTheme}
        style={{
          width: "100%",
          height: "calc(100% - 155px)",
          minHeight: "14rem",
          borderRadius: "8px",
        }}
      >
        <Flex className="flex-container-menu">
          <Flex
            className="flex-item-menu"
            vAlign="center"
            style={{ justifyContent: "space-between" }}
          >
            <Flex vAlign="center" gap="gap.small">
              <Image
                src={bowlImg}
                className="image-icon"
                style={{ height: "20px", width: "20px" }}
              />
              <Text content="Order Details" className="text-menu" />
            </Flex>
            <Dialog
              content="Are you sure you want to cancel this order ?"
              header="Cancel Order"
              headerAction={{
                icon: <CloseIcon />,
                title: "Close",
                onClick: () => setOpen(false),
              }}
              cancelButton={{
                content: "No",
                onClick: () => setOpen(false),
              }}
              confirmButton={{
                content: "Yes",
                onClick: handleCancelOrders,
              }}
              trigger={
                <Button
                  disabled={
                    (!orderedLunch && !orderedDinner) ||
                      (!lunchCancel && !dinnerCancel)
                      ? true
                      : false
                  }
                  tinted
                >
                  Cancel Meal
                </Button>
              }
            />
          </Flex>

          <Divider />
          {isOrderedLoading ? (
            <Flex
              style={{
                padding: "1rem 1rem",
                overflowY: "auto",
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
              {!orderedLunch && !orderedDinner ? (
                <Flex
                  column
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={emptyImgOrders}
                    height="100px"
                    width="100px"
                    alt="no order yet"
                  />
                  <Text>No food ordered yet!</Text>{" "}
                </Flex>
              ) : (
                <>
                  {orderedLunch ? (
                    <Flex
                      className="booked-food-row"
                      style={{ marginBottom: "1rem" }}
                    >
                      <Flex vAlign="center">
                        <Checkbox
                          checked={lunchCancel}
                          onClick={handleLunchChangeCancel}
                        />
                      </Flex>
                      <Input
                        className="input-booked-food"
                        label="Meal Type"
                        value="Lunch"
                        disabled
                      />
                      <Input
                        className="input-booked-food"
                        label="Customization"
                        value={
                          lunchData?.rice == 1 ? "With Rice" : "Without Rice"
                        }
                        disabled
                      />
                      <Input
                        className="input-booked-food"
                        label="Chapati"
                        value={lunchData?.chapati}
                        disabled
                      />
                    </Flex>
                  ) : (
                    <></>
                  )}
                  {orderedDinner ? (
                    <Flex className="booked-food-row">
                      <Flex vAlign="center">
                        <Checkbox
                          checked={dinnerCancel}
                          onClick={handleDinnerChangeCancel}
                        />
                      </Flex>
                      {console.log(dinnerData, "--->dinner data")}
                      <Input
                        className="input-booked-food"
                        label="Meal Type"
                        value="Dinner"
                        disabled
                      />
                      <Input
                        className="input-booked-food"
                        label="Customization"
                        value={
                          dinnerData?.rice == 1 ? "With Rice" : "Without Rice"
                        }
                        disabled
                      />
                      <Input
                        className="input-booked-food"
                        label="Chapati"
                        value={dinnerData?.chapati}
                        disabled
                      />
                    </Flex>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </>
          )}
        </Flex>
      </FluentUiProvider>
      <ToastContainer />
    </>
  );
};

export default Details;
