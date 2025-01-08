import React from "react";
import { Flex, Text, Header } from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import BackButton from "../../Utilities/BackButton";
import InfoOrders from "./InfoOrder/InfoOrders";
import InfoCard from "./InfoOrder/InfoCard";
import FBCount from "./FeedBackScore/FBCount";
import FoodTable from "./AdminTableFood/FoodTable";

const FoodPortalAdmin = () => {
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
  return (
    <Flex column className="main-ref" style={{ height: "100%" }}>
      <Flex className="breadcrumb-div" style={{ marginBottom: "0.5rem" }}>
        <BackButton currTheme={"default"} />
        <Text>{">"}</Text>
        <Link to="/food-portal-admin" className="breadcrumb-curr">
          Food Portal Admin
        </Link>
      </Flex>
      <Flex style={{ width: "100%", height: "10rem", gap: "2rem", marginBottom: "1rem" }}>
        <Flex style={{ width: "66%", height: "10rem" }}>
          <InfoOrders />

        </Flex>
        <FBCount />
      </Flex>
      <FoodTable />
    </Flex>
  );
};

export default FoodPortalAdmin;
