import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Loader,
  Header,
  Image,
  CloseIcon,
  Divider,
} from "@fluentui/react-northstar";

import dialogHeaderIcon from "../../../Assets/documentAssests/dialogHeaderIcon.svg";
import { Dialog, Button, Input } from "@fluentui/react-northstar";
import { useDispatch, useSelector } from "react-redux";

import "./docDialog.css";

import { toast } from "react-toastify";

import axios from "axios";

const DocDialog = () => {
  const dispatch = useDispatch();
  const formReducer = useSelector((state) => state.formReducer);
  const { loggedInUserDetails } = formReducer;
  console.log(loggedInUserDetails);

  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    file: "",
  });

  // ******* handle input change ********
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };
  // ************************************

  // *********** handle submit ***********
  const handleSubmit = async () => {
    let data = new FormData();
    data.append("file", formData.file);
    data.append("name", "");
    data.append("hrm", "");
    data.append("email", "");
    data.append("department", "");
    data.append("title", formData.title);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "",
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Dialog
        open={showDialog}
        className="doc-dialog"
        content={
          <Flex column gap="gap.small">
            <Flex>
              <Divider />
            </Flex>
            <Flex className="doc-dialog-content" column gap="gap.medium">
              <Input
                onChange={handleChange}
                value={formData.title}
                type="text"
                placeholder="Enter title here"
                label="Add Title"
                name="title"
              />
              <Input
                type="file"
                label="Upload Document"
                name="file"
                onChange={handleFileChange}
              />
            </Flex>
          </Flex>
        }
        header={
          <>
            <Flex space="between" vAlign="center">
              <Header
                as="h3"
                content=<Flex
                  style={{ padding: "0.5rem 0.5rem", gap: "0.75rem" }}
                >
                  {" "}
                  <Image src={dialogHeaderIcon} alt="icon" />
                  Candidate Details
                </Flex>
              />
              <CloseIcon
                onClick={() => {
                  setShowDialog(false);
                }}
                style={{
                  cursor: "pointer",
                }}
              />
            </Flex>
          </>
        }
        trigger={
          <Button
            style={{
              zIndex: "2",
              fontSize: "0.75rem",
              fontWeight: "600 !important",
              padding: "8px 16px",
              minWidth: "fit-content",
              maxWidth: "fit-content",
              width: "fit-content",
            }}
            primary
            onClick={() => {
              setShowDialog(true);
            }}
            content={
              <Flex
                vAlign="center"
                style={{ alignItems: "center", columnGap: "0.5rem" }}
              >
                <Text
                  primary="true"
                  content="Upload Documents"
                  weight="regular"
                  className="docDialog-btn"
                />
              </Flex>
            }
          />
        }
        confirmButton={{
          content: "Submit",
          primary: true,
          onClick: () => {
            handleSubmit();
          },
        }}
        cancelButton={{
          content: "Cancel",
          onClick: () => {
            setShowDialog(false);
          },
        }}
      />
    </>
  );
};

export default DocDialog;
