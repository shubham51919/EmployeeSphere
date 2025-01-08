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
  CloseIcon,
  SkeletonInput,
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
import { useSelector } from "react-redux";

const DialogFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mealRadio, setMealRadio] = useState("1");
  const [mealRating, setMealRating] = useState(0);
  const [mealLoader, setMealLoader] = useState(false);
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const formReducer = useSelector((state) => state.formReducer);
  const { FirstName, LastName, EmployeeID } = formReducer.loggedInUserDetails;

  const handleRadioChange = (value) => {
    setMealRadio(value);
  };
  const [open, setOpen] = useBooleanKnob({
    name: "open",
  });
  const ratingChanged = (newRating) => {
    setMealRating(newRating);
  };
  const [feedbackText, setFeedbackText] = useState();

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
        setIsOpen(false)
      })
      .catch((error) => {
        setMealLoader(false);
        toast.error("Something went wrong ! Try Again Later", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(error);
      });
  };
  return (
    <Dialog
      open={isOpen}
      cancelButton="No"
      confirmButton={<Text onClick={handleFeedbackSend}>Yes</Text>}
      content={
        <Flex column gap="gap.medium">
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
                <Text style={{ width: "30%" }}>Meal Type</Text>
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
                <Text style={{ width: "30%" }}>Rating</Text>
                <ReactStars
                  className="stars-component-react"
                  count={5}
                  onChange={ratingChanged}
                  size={24}
                  activeColor="#ffd700"
                />
              </Flex>
              <Flex vAlign="center" column gap="gap.small">
                <Text>Description</Text>
                <TextArea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{
                    height: "10rem",
                    padding: "auto",
                    width: "100%",
                    // backgroundColor: "red",
                  }}
                  placeholder="Enter Description here ..."
                ></TextArea>
              </Flex>
            </>
          )}
        </Flex>
      }
      header={
        <Flex vAlign="center" gap="gap.small">
          <Text>Send Feedback</Text>
          <Tooltip
            pointing
            trigger={<InfoIcon className="icon-info-timing" />}
            content="The tooltip is pointing."
          />
        </Flex>
      }
      headerAction={{
        icon: <CloseIcon />,
        title: "Close",
        onClick: () => setIsOpen(false),
      }}
      trigger={
        <Button
          onClick={() => setIsOpen(true)}
          primary
          styel={{
            height: "fit-content",
            width: "fit-content",
            padding: "1rem 3rem",
          }}
        >
          Give Feedback
        </Button>
      }
    />
  );
};

export default DialogFeedback;
