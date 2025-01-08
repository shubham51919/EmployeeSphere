import { Flex, Image } from "@fluentui/react-northstar";
import React from "react";
import errorImg from "../Assets/errorImg.webp";
const ErrorScreen = () => {
  return (
    <Flex>
      <Image
        src={errorImg}
        style={{
          width: "30rem",
          height: "30rem",
        }}
      />
    </Flex>
  );
};

export default ErrorScreen;
