import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import {
  Flex,
  Text,
  Provider as FluentUiProvider,
} from "@fluentui/react-northstar";
import "../FoodPortalAdmin.css";

import { API_URL } from "../../../config";
import InfoCard from "./InfoCard";
const InfoOrders = () => {
  const [foodInfoCardData, setFoodInfoCardData] = useState([]);
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const getCurrentFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const axios = require("axios");
    let data = {
      start_date: getCurrentFormattedDate(),
      end_date: getCurrentFormattedDate(),
      mail: userEmail
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/getOrders`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setFoodInfoCardData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <Flex className="card-grid-admin-food">
      {
        <>
          <InfoCard cardData={foodInfoCardData} index={0} />
          <InfoCard cardData={foodInfoCardData} index={1} />
          <InfoCard cardData={foodInfoCardData} index={2} />
          <InfoCard cardData={foodInfoCardData} index={3} />
        </>
      }
    </Flex>
  );
};

export default InfoOrders;
