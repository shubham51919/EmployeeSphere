import React from "react";
import "../foodPortal.css";
import clockImg from "../../../Assets/foodPortalAssets/Shape.svg";
import sunImg from "../../../Assets/foodPortalAssets/sun.svg";
import moonImg from "../../../Assets/foodPortalAssets/moon.svg";
import EmptyImgMenu from "../../../Assets/foodPortalAssets/EmptyImgMenu.svg";

import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  Flex,
  Tooltip,
  Image,
  Text,
  InfoIcon,
} from "@fluentui/react-northstar";
const Timings = ({ orderMenu }) => {
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
      style={{ width: "27.5%", borderRadius: "8px" }}
    >
      <Flex
        style={{
          height: "100%",
          width: "100%",
          padding: "0.75rem 1rem",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <Flex
          style={{
            gap: "1rem",
            height: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
          vAlign="center"
        >
          <Flex gap="gap.small" vAlign="center">
            <Image src={clockImg} height="16px" width="16px" />
            <Text
              content="Timings"
              style={{ fontSize: "1rem", fontWeight: "600" }}
              className="timing-food-order-heading"
            />
          </Flex>
          <Flex>
            <Tooltip
              pointing
              trigger={<InfoIcon className="icon-info-timing" />}
              content="Timing for the order to be placed for the same day food order"
            />
          </Flex>
        </Flex>
        <Flex
          className="timimg-box"
          style={{ gap: "10%", height: "100%" }}
          vAlign="center"
          column
        >
          <Flex column>
            <Flex style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Lunch
            </Flex>
            <Flex style={{ fontSize: "0.75rem", fontWeight: "400" }}>
              Order Before 10:00 AM
            </Flex>
          </Flex>
          <Flex column className="dinner-timing">
            <Flex style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Dinner
            </Flex>
            <Flex style={{ fontSize: "0.75rem", fontWeight: "400" }}>
              Order Before 03:00 PM
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </FluentUiProvider>
  );
};

export default Timings;
// <div style={{backgroundColor:"white",height:"10.625rem",width:"15.483rem"}}>
