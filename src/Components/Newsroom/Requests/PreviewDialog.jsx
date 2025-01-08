import React, { useState, useEffect } from "react";
import {
  Button,
  CloseIcon,
  Dialog,
  Flex,
  Text,
} from "@fluentui/react-northstar";
import { useSelector } from "react-redux";
import Sanitize from "../Format/Editor/Sanitize";
import "./PreviewContent.css";
import AvatarProfilePhoto from "../../../Utilities/AvatarProfilePhoto";
const PreviewDialog = ({
  editorHtml,
  title,
  category,
  type,
  employeeEmail,
  employeeName,
}) => {
  //destructre editorHtml from connectReducer
  const [isFormValid, setIsFormValid] = useState(false);
  // const { editorHtml } = connectReducer;
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const isValid = editorHtml !== "" && title !== "" && category;
    setIsFormValid(isValid);
  }, [editorHtml, title, category]);

  return (
    <Dialog
      style={{ width: "70%", maxHeight: "30rem" }}
      className="dialog-preview-posts"
      open={open}
      content={
        <>
          <Flex>
            <Text as="h3" content={title} />
          </Flex>
          <Sanitize html={editorHtml} />
        </>
      }
      header={
        <>
          <Flex
            gap="gap.small"
            style={{
              marginBottom: "1rem",
            }}
          >
            <AvatarProfilePhoto mailId={employeeEmail} name={employeeName} />
            <Flex column gap="gap.smaller">
              <Text
                as="h6"
                content={employeeName}
                style={{
                  margin: "0rem",
                }}
              />
              <Text
                as="h6"
                content={category}
                style={{
                  margin: 0,
                  fontWeight: "normal",
                }}
              />
            </Flex>
          </Flex>
        </>
      }
      headerAction={
        <Flex onClick={handleClose}>
          <CloseIcon />
        </Flex>
      }
      trigger={
        type === "button" ? (
          <Button
            content="Preview"
            disabled={!isFormValid}
            onClick={() => setOpen(true)}
          />
        ) : (
          <Text
            as="a"
            content="View"
            onClick={() => setOpen(true)}
            style={{
              cursor: "pointer",
              color: "#3766E7",
              textDecoration: "underline",
            }}
          />
        )
      }
    />
  );
};

export default PreviewDialog;
