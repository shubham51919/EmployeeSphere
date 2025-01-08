import React, { useEffect, useState } from "react";
import {
  Flex,
  Input,
  Button,
  Text,
  Skeleton,
  Dropdown,
  Image,
  Divider,
} from "@fluentui/react-northstar";
import { toast } from "react-toastify";

import plusIcon from "../../../Assets/connectAssets/plusIcon.svg";
import { useDispatch } from "react-redux";
import { setRerenderActivity } from "../../../redux/actions";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";

const PollPost = ({ setShowPolls, setShowDefault }) => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const connectReducer = useSelector((state) => {
    return state.connectReducer;
  });

  const { rerenderActivity } = connectReducer;
  const [daysPolls, setDaysPolls] = useState();
  const [hrsPolls, setHrsPolls] = useState();
  const [minPolls, setMinPolls] = useState();
  const [pollLoaderSubmit, setPollLoaderSubmit] = useState(false);
  const [inputText, setInputText] = useState("");
  const [inputs, setInputs] = useState([{ value: "" }, { value: "" }]);
  const [inputValues, setInputValues] = useState([]);

  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);

  const handleInputChange = (index, newValue) => {
    const newInputs = [...inputs];
    newInputs[index].value = newValue;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    const newInputs = [...inputs, { value: "" }];
    setInputs(newInputs);
  };
  const handleRemoveInput = () => {
    if (inputs.length > 1) {
      const newInputs = [...inputs];
      newInputs.pop();
      setInputs(newInputs);
    }
  };

  useEffect(() => {
    const values = inputs.map((input) => input.value);
    setInputValues(JSON.stringify(values));
  }, [inputs]);
  // ---------------

  const inputItemshr = Array.from(Array(24), (_, index) => index).map(
    (h) => `${h}`
  );
  const inputItemsdays = Array.from(Array(30), (_, index) => index).map(
    (h) => `${h}`
  );
  const inputItemsmin = Array.from(Array(60), (_, index) => index).map(
    (h) => `${h}`
  );
  const clearStatesPoll = () => {
    setInputText("");
    setInputs([{ value: "" }, { value: "" }]);
  };

  const handlePollRaise = async () => {
    setPollLoaderSubmit(true);

    let data = {
      pollQuestion: inputText,
      email: userEmail,
      pollOption: inputValues,
      days: daysPolls ? Number(daysPolls) : 0,
      hours: hrsPolls ? Number(hrsPolls) : 0,
      minutes: minPolls ? Number(minPolls) : 0,
    };
    try {
      const response = await API.post("/raisePoll", data);
      clearStatesPoll();
      dispatch(setRerenderActivity(!rerenderActivity));
      toast.success("Poll Added Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowDefault(true);
      setShowPolls(false);
      setPollLoaderSubmit(false);
    } catch {
      toast.error("Something went wrong. Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setPollLoaderSubmit(false);
    }
  };
  return (
    <Flex className="input-container-head-user" column>
      {pollLoaderSubmit ? (
        <Flex>
          <Skeleton animation="pulse">
            <Flex column gap="gap.small">
              <Skeleton.Text
                style={{
                  width: "30%",
                }}
              />
              <Skeleton.Text />
              <Skeleton.Text />
              <Skeleton.Text />
            </Flex>
          </Skeleton>
        </Flex>
      ) : (
        <>
          <Flex className="heading-opened-parent" column>
            <Input
              placeholder="Start a Poll !"
              inverted
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <>
              {inputs.map((input, index) => (
                <Flex column key={index}>
                  <Flex gap="gap.medium">
                    <Input
                      value={input.value}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      inverted
                      className="input-border-user"
                      placeholder="Search..."
                    />
                    {index === inputs.length - 1 && inputs.length < 6 && (
                      <Flex
                        onClick={handleAddInput}
                        style={{
                          paddingTop: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <Image
                          src={plusIcon}
                          style={{
                            height: "1.1rem",
                            width: "1.1rem",
                          }}
                        />
                      </Flex>
                    )}
                  </Flex>
                  <Flex space="between" style={{ width: "95%" }}>
                    <span></span>
                    {index === inputs.length - 1 && inputs.length > 2 && (
                      <Text
                        onClick={handleRemoveInput}
                        style={{
                          cursor: "pointer",
                          color: "grey",
                          fontSize: "0.875rem",
                          fontWeight: "400",
                        }}
                      >
                        Remove
                      </Text>
                    )}
                  </Flex>
                </Flex>
              ))}
            </>
          </Flex>
          <Flex column className="padding-one-rem">
            <Divider className="padding-one-rem" />
            <Flex column>
              <Text className="padding-one-rem">Poll Length</Text>
              <Flex space="between" gap="gap.small">
                <Flex column style={{ width: "100%" }}>
                  <Text>Days</Text>
                  <Dropdown
                    style={{
                      border: "1px solid #E1E1E1",
                      width: "100%",
                    }}
                    inverted
                    defaultValue={inputItemsdays[0]}
                    items={inputItemsdays}
                    getA11ySelectionMessage={{
                      onAdd: (item) => setDaysPolls(item),
                    }}
                  />
                </Flex>
                <Flex column style={{ width: "100%" }}>
                  <Text>Hours</Text>
                  <Dropdown
                    style={{
                      border: "1px solid #E1E1E1",
                      width: "100%",
                    }}
                    inverted
                    defaultValue={inputItemshr[0]}
                    items={inputItemshr}
                    getA11ySelectionMessage={{
                      onAdd: (item) => setHrsPolls(item),
                    }}
                  />
                </Flex>
                <Flex column style={{ width: "100%" }}>
                  <Text>Minutes</Text>
                  <Dropdown
                    style={{
                      border: "1px solid #E1E1E1",
                      width: "100%",
                    }}
                    inverted
                    defaultValue={inputItemsmin[0]}
                    items={inputItemsmin}
                    getA11ySelectionMessage={{
                      onAdd: (item) => setMinPolls(item),
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Divider className="padding-one-rem" />
            <Flex
              space="between"
              vAlign="center"
              style={{ width: "97%", paddingTop: "1rem" }}
            >
              <Text
                style={{
                  fontSize: "1ren",
                  fontWeight: "600",
                  color: "#D32C1C",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowPolls(false);
                  setShowDefault(true);
                }}
              >
                Close
              </Text>
              <Button primary onClick={handlePollRaise} content="Submit" />
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default PollPost;
