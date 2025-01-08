import React from "react";
import {
  Divider,
  Flex,
  Text,
  Provider as FluentUiProvider,
  Animation,
} from "@fluentui/react-northstar";
const SingleAnimatedDivider = ({ width, color, title }) => {

  const loader = {
    keyframe: {
      from: {
        width: "0%",
      },
      to: {
        width: `${width}%`,
      },
    },
    duration: "1s",
  };
  return (
    <>
      <Flex gap="gap.medium" vAlign="center">
        <Text>{width}%</Text>
        <Flex
          column
          style={{
            flexGrow: 1,
          }}
        >
          <Text content={title} />
          <FluentUiProvider
            theme={{
              animations: {
                loader,
              },
            }}
          >
            <Animation name="loader" timingFunction="ease-out">
              <Divider
                // className={`animated-divider ${
                //   animationStarted ? "start-animation" : ""
                // }`}
                color={color}
                size={4}
                style={{
                  width: `${width}%`,
                }}
              />
            </Animation>
          </FluentUiProvider>
        </Flex>
      </Flex>
    </>
  );
};

export default SingleAnimatedDivider;
