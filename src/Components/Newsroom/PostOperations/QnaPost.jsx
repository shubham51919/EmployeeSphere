import React, { useEffect, useState } from "react";
// import "./PostByUser.css";
import {
  Flex,
  Input,
  Button,
  Text,
  Dropdown,
  Image,
  Divider,
} from "@fluentui/react-northstar";
import { Skeleton } from "@fluentui/react-northstar";
import { toast } from "react-toastify";
import plusIcon from "../../../Assets/connectAssets/plusIcon.svg";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setRerenderActivity } from "../../../redux/actions";
import newsroomApi from "../../../Apis/newsroom";

const QuestionType = {
  OPEN_ENDED: "Open Ended",
  SINGLE_CHOICE: "Single Choice",
  MULTI_CHOICE: "Multi Choice",
};
const QnaPost = ({ setShowQNA, setShowDefault }) => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const connectReducer = useSelector((state) => {
    return state.connectReducer;
  });

  const { rerenderActivity } = connectReducer;
  const inputItems = ["Open Ended", "Single Choice"];
  const [selectedItem, setSelectedItem] = useState(inputItems[1]);
  const [inputs, setInputs] = useState([{ value: "" }, { value: "" }]);
  const [inputValues, setInputValues] = useState([]);
  const [qnaLoaderSubmit, setQnaLoaderSubmit] = useState(false);
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
  const clearStates = () => {
    setInputText("");
    setInputs([{ value: "" }, { value: "" }]);
  };
  const handleDropdownChange = (event, data) => {
    setSelectedItem(data.value);
  };
  useEffect(() => {
    const values = inputs.map((input) => input.value);
    setInputValues(JSON.stringify(values));
  }, [inputs]);

  const handleQnaRaise = async () => {
    setQnaLoaderSubmit(true);
    let data = {};
    switch (selectedItem) {
      case QuestionType.OPEN_ENDED:
        data = {
          question: inputText,
          email: userEmail,
          questionType: QuestionType.OPEN_ENDED,
        };
        break;

      case QuestionType.SINGLE_CHOICE:
        data = {
          question: inputText,
          email: userEmail,
          questionOptions: inputValues,
          questionType: QuestionType.SINGLE_CHOICE,
        };
        break;

      case QuestionType.MULTI_CHOICE:
        data = {
          question: inputText,
          email: userEmail,
          questionOptions: inputValues,
          questionType: QuestionType.MULTI_CHOICE,
        };
        break;

      default:
        // Handle the default case if needed
        break;
    }
    try {
      const response = await API.post("/addQuestion", data);
      setShowQNA(false);
      dispatch(setRerenderActivity(!rerenderActivity));
      setShowDefault(true);
      clearStates();
      toast.success("Question Added Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setQnaLoaderSubmit(false);
    } catch (error) {
      toast.error("Something went wrong !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const [inputText, setInputText] = useState("");

  return (
    <Flex className="input-container-head-user" column>
      {qnaLoaderSubmit ? (
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
            <Dropdown
              inverted
              items={inputItems}
              value={selectedItem}
              className="dropdown-border-user"
              onChange={handleDropdownChange}
            />
            {selectedItem == "Open Ended" ? (
              <Input
                placeholder="Ask a Question"
                inverted
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            ) : (
              <>
                <Input
                  placeholder="Ask a Question"
                  inverted
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                {inputs.map((input, index) => (
                  <Flex column key={index}>
                    <Flex gap="gap.medium">
                      <Input
                        value={input.value}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        inverted
                        className="input-border-user"
                        placeholder="Add Option "
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
            )}
          </Flex>
          <Flex column className="padding-one-rem">
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
                  setShowQNA(false);
                  setShowDefault(true);
                }}
              >
                Close
              </Text>
              <Button primary onClick={handleQnaRaise} content="Submit" />
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default QnaPost;
