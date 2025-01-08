import { Dropdown, Flex, Input } from "@fluentui/react-northstar";
import React, { useState } from "react";
import Editor from "./Editor/Editor";
import Heading from "./Heading";
import { useDispatch } from "react-redux";
import { setCategory } from "../../../redux/actions";
const Format = () => {
  const dispatch = useDispatch();
  const items = ["Editorials", "Reviews"];

  const handleDropdownChange = (item) => {
    dispatch(setCategory(item));
  };
  
  return (
    <Flex column gap="gap.small" className="format">
      <Dropdown
        placeholder="Select Category"
        getA11ySelectionMessage={{
          onAdd: (item) => handleDropdownChange(item),
        }}
        items={items}
        style={{
          width: "30%",
        }}
      />
      <Heading />
      <Editor />
      {/* <DescriptionEditor /> */}
    </Flex>
  );
};

export default Format;
