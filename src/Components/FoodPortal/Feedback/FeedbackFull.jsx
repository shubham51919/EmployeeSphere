import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Button,
  Divider,
  Loader,
  RadioGroup,
  Tooltip,
  InfoIcon,
  SkeletonInput,
  Image,
  CloseIcon,
  Dialog,
  Provider as FluentUiProvider,
  TextArea,
  Skeleton,
  mergeVariablesOverrides,
} from "@fluentui/react-northstar";
import _ from "lodash";
import ReactStars from "react-rating-stars-component";
import "../foodPortal.css";
import { ToastContainer, toast } from "react-toastify";
import { useBooleanKnob } from "@fluentui/docs-components";
import { API_URL } from "../../../config";

import bowlImg from "../../../Assets/foodPortalAssets/bowl.svg";
import { useSelector } from "react-redux";
const FeedbackFull = ({ orderMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mealRadio, setMealRadio] = useState("1");
  const [mealRating, setMealRating] = useState(0);
  const [mealLoader, setMealLoader] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkRatingBelowFour, setCheckRatingBelowFour] = useState(false);
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });
  const formReducer = useSelector((state) => state.formReducer);
  const { FirstName, LastName, EmployeeID } = formReducer.loggedInUserDetails;
  //   ********* check if rating is below 4 *********
  useEffect(() => {
    mealRating < 4
      ? setCheckRatingBelowFour(true)
      : setCheckRatingBelowFour(false);
  }, [mealRating]);
  const handleRadioChange = (value) => {
    setMealRadio(value);
  };
  const ratingChanged = (newRating) => {
    setMealRating(newRating);
  };
  const [feedbackText, setFeedbackText] = useState();
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
  const handleFeedbackSend = () => {
    setMealLoader(true);
    const axios = require("axios");
    let data = {
      mail: name,
      hrmId: EmployeeID,
      description: feedbackText,
      rating: mealRating,
      mealType: mealRadio == "1" ? "lunch" : "dinner",
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/postFeedback`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setMealLoader(false);
        toast.success("Feedback Sent Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });

        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        setMealLoader(false);
        toast.error("Something went wrong ! Try Again Later", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(error);
      });
  };

  if (orderMenu === true) return <></>;
  return (
    <FluentUiProvider
      theme={FoodTheme}
      style={{
        width: "100%",
        height: "calc(100% - 0px)",
        minHeight: "22rem",
        borderRadius: "8px",
      }}
    >
      <Flex className="flex-container-menu">
        <Flex
          className="flex-item-menu"
          vAlign="center"
          column
          style={{ height: "100%" }}
        >
          <Flex vAlign="center" gap="gap.small">
            <Image
              src={bowlImg}
              className="image-icon"
              style={{ height: "20px", width: "20px" }}
            />
            <Text content="Send Feedback" className="text-menu" />
          </Flex>
          <Flex column gap="gap.medium" className="main-feedback-form">
            {mealLoader ? (
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
                <Divider />
                <Flex vAlign="center">
                  <Text style={{ width: "30%" }} className="mandatory">
                    Meal Type
                  </Text>
                  <RadioGroup
                    defaultCheckedValue={"1"}
                    className="radio-btn-food"
                    items={[
                      {
                        key: "1",
                        label: "Lunch",
                        value: "1",
                        onClick: () => handleRadioChange("1"),
                      },
                      {
                        key: "2",
                        label: "Dinner",
                        value: "2",
                        onClick: () => handleRadioChange("2"),
                      },
                    ]}
                  />
                </Flex>
                <Flex vAlign="center">
                  <Text style={{ width: "30%" }} className="mandatory">
                    Rating
                  </Text>
                  <ReactStars
                    className="stars-component-react"
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                  />
                </Flex>
                <Flex vAlign="center" column gap="gap.small">
                  <Text className={checkRatingBelowFour && "mandatory"}>
                    Description
                  </Text>
                  <TextArea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    style={{
                      height: "5.2rem",
                      padding: "auto",
                      width: "100%",
                      // backgroundColor: "red",
                    }}
                    placeholder="Enter Description here ..."
                  ></TextArea>
                </Flex>
                <Flex
                  className="btn-container-feedback-full"
                  style={{ gap: "0.5rem" }}
                >
                  <Button style={{ width: "50%", height: "2.5rem" }}>
                    Clear
                  </Button>
                  <Button
                    disabled={checkRatingBelowFour && !feedbackText}
                    style={{ width: "50%", height: "2.5rem" }}
                    onClick={handleFeedbackSend}
                    primary
                  >
                    Submit
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </FluentUiProvider>
  );
};

export default FeedbackFull;
