import React from "react";
import { useSelector } from 'react-redux';
import {
  Flex,
  Text,
  Divider,
  DownloadIcon,
  Provider as FluentUiProvider,
} from "@fluentui/react-northstar";
import "../FoodPortalAdmin.css";
import { API_URL } from "../../../config";

const InfoCard = ({ cardData, index }) => {
  const locations = ["Total", "Jhalana", "Malviya Nagar", "Mansarover"];
  const bgcolors = ["rgb(217,218,251)", "rgb(243,228,253)", "rgb(228,247,254)", "rgb(251,235,217)"]
  const fontcolors = ["#0006A8", "#4A006D", "#015974", "#A85000"]
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });

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

  const generateCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  const handleDownloadClick = (mealType, location) => {
    const axios = require('axios');
    let data = {
      "start_date": generateCurrentDate(),
      "end_date": generateCurrentDate(),
      "mealType": mealType,
      "location": location,
      "mail": userEmail
    };

    let config = {
      method: 'post',
      responseType: 'blob',
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/downloadOrders`,
      headers: {
        'Authorization': `Bearer ${accessTkn}`,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "InfoFood.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <FluentUiProvider
      theme={FoodTheme}
      style={{ width: "100%", height: "100%", borderRadius: "8px" }}
    >
      <Flex
        className="small-feedback new-food-card"
        vAlign="center"
        style={{ padding: "0.5rem 0.8rem", gap: "0.5rem" }}
      >
        <Flex className="food-card-bg" style={{ backgroundColor: bgcolors[index] }} vAlign="center">
          <Text
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: fontcolors[index],
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {locations[index]}
          </Text>
        </Flex>
        <Flex
          style={{
            height: "100%",
            width: "33.3%",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Text className="InfoFoodCard-text">Lunch</Text>
          <Text className="InfoFoodCard-text-bold">
            {cardData?.length > 1 && cardData[index]?.lunchCount != null
              ? cardData[index]?.lunchCount
              : 0}{" "}
          </Text>
          <DownloadIcon
            style={{ color: "#5B5FC7", cursor: "pointer" }}
            onClick={() => handleDownloadClick("lunch", locations[index])}
          />
        </Flex>
        <Divider vertical />
        <Flex
          style={{
            height: "100%",
            width: "33.3%",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Text className="InfoFoodCard-text">Dinner</Text>
          <Text className="InfoFoodCard-text-bold">
            {cardData?.length > 1 && cardData[index]?.dinnerCount != null
              ? cardData[index]?.dinnerCount
              : 0}
          </Text>
          <DownloadIcon
            style={{ color: "#5B5FC7", cursor: "pointer" }}
            onClick={() => handleDownloadClick("dinner", locations[index])}
          />
        </Flex>
      </Flex>
    </FluentUiProvider>
  );
};

export default InfoCard;
