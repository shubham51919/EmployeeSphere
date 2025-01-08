import { Flex, RadioGroup } from "@fluentui/react-northstar";
import React, { useState } from "react";

const SingleChoice = ({ options, questionData, handleChange }) => {

  const [selectedOption, setSelectedOption] = useState(questionData?.response);

  return (
    <RadioGroup
      className="connect-radio-group"
      vertical
      items={options.map((option) => ({
        key: option,
        label: option,
        value: option,
        disabled: selectedOption !== null,
      }))}
      onCheckedValueChange={(e, option) => handleChange(e, option)}
      defaultCheckedValue={selectedOption !== null ? selectedOption : undefined}
    // Set the default checked value or undefined if loggedUserResponse is null
    />
  );
};

export default SingleChoice;
