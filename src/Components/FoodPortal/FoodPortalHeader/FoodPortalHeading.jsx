import React from "react";
import "../foodPortal.css";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  Flex,
  Text,
} from "@fluentui/react-northstar";

const FoodPortalHeading = ({ orderMenu }) => {
  if (orderMenu !== null) return <></>;
  return (
    <div style={{ width: "45%" }}>
      <div className="food-portal-head">
        <FluentUiProvider
          theme={teamsTheme}
          style={{
            boxShadow:
              "0px 0.800000011920929px 1.7999999523162842px rgba(0, 0, 0, 0.13)",
          }}
        >
          <Flex space="between" className="sub-main-header-food">
            <Flex
              gap="gap.small"
              column
              vAlign="center"
              id="headingdashfood"
              style={{ padding: "2rem 1.75rem" }}
            >
              <Text
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#242424",
                }}
                className="heading-food-zone"
                content={"Food Zone"}
              />
              <Text
                id="subheadingdashmain-ca"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "400",
                  color: "#424242",
                }}
                className="subheading-food-zone"
                content={
                  "Your Catalyst for Career Tips, Company Updates, and Management Insights."
                }
              />
            </Flex>
          </Flex>
        </FluentUiProvider>
      </div>
    </div>
  );
};

export default FoodPortalHeading;
