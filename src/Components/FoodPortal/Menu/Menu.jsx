import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import "./Menu.css";
import bowlImg from "../../../Assets/foodPortalAssets/bowl.svg";
import sunImg from "../../../Assets/foodPortalAssets/sun.svg";
import moonImg from "../../../Assets/foodPortalAssets/moon.svg";
import gift from "../../../Assets/foodPortalAssets/gift.svg";

import EmptyImgMenu from "../../../Assets/foodPortalAssets/EmptyImgMenu.svg";
import { API_URL } from "../../../config.js";
import axios from "axios";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  Flex,
  Image,
  Text,
  Skeleton,
  SkeletonText,
  SkeletonLine,
} from "@fluentui/react-northstar";
import { toast } from "react-toastify";

const Menu = ({ orderMenu }) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [lunchMenu, setLunchMenu] = useState(null);
  const [isGift, setIsGift] = useState(null);

  const [dinnerMenu, setDinnerMenu] = useState(null);
  const [isLunchMenuLoading, setIsLunchMenuLoading] = useState(false);
  const [isDinnerMenuLoading, setIsDinnerMenuLoading] = useState(false);
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
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
  useEffect(() => {
    setIsLunchMenuLoading(true);
    setIsDinnerMenuLoading(true);

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/getMenu`,
      headers: {
        Authorization: `Bearer ${accessTkn}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data?.data?.message == "Menu not updated") {
          setIsEmpty(true);
          setIsDinnerMenuLoading(false);
          setIsLunchMenuLoading(false);
        } else {
          setIsEmpty(false);
          setIsDinnerMenuLoading(false);
          setIsLunchMenuLoading(false);
          setLunchMenu(response?.data?.data?.message?.lunch);
          setDinnerMenu(response?.data?.data?.message?.dinner);
        }
      })
      .catch((error) => {
        setIsEmpty(true);
        setIsDinnerMenuLoading(false);
        setIsLunchMenuLoading(false);
        toast.error("Menu Not Available. Please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }, []);

  if (orderMenu === false) return <></>;

  return (
    <FluentUiProvider
      theme={FoodTheme}
      style={{ width: "27.5%", borderRadius: "8px" }}
    >
      <Flex className="flex-container-menu">
        <Flex className="flex-item-menu" vAlign="center">
          <Image src={bowlImg} className="image-icon" />
          <Text content="Today's Menu" className="text-menu" />
        </Flex>
        <Flex
          className="flex-item"
          vAlign="center"
          style={{
            height: "100%",
            gap: "10px",
            // background: "pink",
            justifyContent: "center",
          }}
        >
          <Flex
            className="sub-flex-container"
            style={{
              backgroundColor: "#FFF9EF",
              height: "100%",
              width: "50%",
              flexShrink: "0",
            }}
          >
            <Flex
              className="sub-flex-header"
              style={{ height: "20%", marginBottom: "0" }}
            >
              <Text content="Lunch" className="sub-flex-text" />
              <Image src={sunImg} className="image-header" />
            </Flex>
            {isLunchMenuLoading ? (
              <>
                <Skeleton animation="pulse" style={{ paddingTop: "1rem" }}>
                  <Flex gap="gap.small" column>
                    {/* <SkeletonLine width="100%" /> */}
                    <SkeletonLine width="100%" />

                    <SkeletonLine width="50%" />
                  </Flex>
                </Skeleton>
              </>
            ) : isEmpty && lunchMenu == null ? (
              <Flex className="image-container">
                <Image src={EmptyImgMenu} className="image-header" />
              </Flex>
            ) : (
              <Flex
                className="menu-text-food"
                vAlign="top"
                style={{ height: "80%" }}
              >
                <Text content={lunchMenu} className="text-main-food-menu" />

                {
                  <>
                    <Text content=" + " />
                    <Image src={gift} />
                  </>
                }
              </Flex>
            )}

            <Text
              className="menu-timing"
              style={{ fontSize: "0.6rem" }}
              content="Order before 10 AM"
            />
          </Flex>
          <Flex
            className="sub-flex-container"
            style={{
              backgroundColor: "#ECF2FF",
              height: "100%",
              width: "50%",
              flexShrink: "0",
            }}
          >
            <Flex
              className="sub-flex-header"
              style={{ height: "20%", marginBottom: "0" }}
            >
              <Text content="Dinner" className="sub-flex-text" />
              <Image src={moonImg} className="image-header" />
            </Flex>
            {isDinnerMenuLoading ? (
              <>
                <Skeleton animation="pulse" style={{ paddingTop: "1rem" }}>
                  <Flex gap="gap.small" column>
                    <SkeletonLine width="100%" />

                    <SkeletonLine width="50%" />
                  </Flex>
                </Skeleton>
              </>
            ) : isEmpty && dinnerMenu == null ? (
              <Flex className="image-container">
                <Image src={EmptyImgMenu} className="image-header" />
              </Flex>
            ) : (
              <Flex
                className="menu-text-food"
                vAlign="top"
                style={{ height: "80%" }}
              >
                <Text content={dinnerMenu} className="text-main-food-menu" />
              </Flex>
            )}
            <Text
              className="menu-timing"
              style={{ fontSize: "0.6rem" }}
              content="Order before 3 PM"
            />
          </Flex>
        </Flex>
      </Flex>
    </FluentUiProvider>
  );
};

export default Menu;
