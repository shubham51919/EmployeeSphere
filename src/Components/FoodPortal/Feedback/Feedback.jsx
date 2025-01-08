import React from "react";
import {
  Flex,
  Text,
  Tooltip,
  InfoIcon,
  Provider as FluentUiProvider,
} from "@fluentui/react-northstar";

import DialogFeedback from "./DialogFeedback";

const Feedback = ({ orderMenu }) => {
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

  if (orderMenu !== null) return <></>;
  return (
    <FluentUiProvider
      theme={FoodTheme}
      style={{
        width: "100%",
        height: "calc(100% - 170px)",
        borderRadius: "8px",
      }}
    >
      <Flex className="small-feedback" vAlign="center">
        <Flex gap="gap.small" vAlign="center">
          <Text
            content="Feedback"
            style={{ fontSize: "1rem", fontWeight: "600" }}
          />
          <Tooltip
            pointing
            trigger={<InfoIcon className="icon-info-timing" />}
            content="This feedback will be for the last meal you ordered."
          />
        </Flex>
        <DialogFeedback />
      </Flex>
    </FluentUiProvider>
  );
};

export default Feedback;
