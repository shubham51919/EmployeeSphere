import React, { useEffect, useState } from "react";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  Text,
  mergeThemes,
  teamsHighContrastTheme,
  Flex,
  Image,
  Loader,
} from "@fluentui/react-northstar";
import emptyImg from "../../../Assets/TravelAssets/list_Empty_Img.svg";
import { useSelector } from "react-redux";
import travelAdminApi from "../../../Apis/travelApi";
import Details from "../Details";
import { toast } from "react-toastify";
import ServiceRequestForm from "./ServiceRequestForm";
import { setIsTicketSelected } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { useAuthData } from "../../../hooks/useAuthData";
const ShowSingleTicket = () => {
  const dispatch = useDispatch();
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const { selectedTicketId, ticketSelected, item } = useSelector((state) => {
    return state.travelReducer;
  });
  const [singleTicketData, setSingleTicketData] = useState({});

  const [singleTicketLoading, setSingleTicketLoading] = useState(false);

  const { accessToken, userEmail } = useAuthData();

  let appTheme = teamsTheme;
  if (!CompanyReducer.theme) {
    // //console.log('Loading... header theme')
  } else {
    // hooks(theme.theme);
    if (CompanyReducer.theme === "dark") {
      appTheme = teamsDarkTheme;
    } else if (CompanyReducer.theme === "contrast") {
      appTheme = teamsHighContrastTheme;
    } else if (CompanyReducer.theme === "default") {
      appTheme = teamsTheme;
    }
  }

  const Headertheme = {
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.backgroundHover,
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
  const travelAdmin = travelAdminApi(accessToken);

  const getSingleTicket = async () => {
    setSingleTicketLoading(true);
    const params = {
      requestId: item?.ID,
      mail: userEmail,
      serviceType: item?.serviceType,
    };
    try {
      const response = await travelAdmin.get(`/getTravelDetials`, {
        params,
      });
      setSingleTicketData(response?.data?.data[0]);
    } catch (err) {
      toast.error("Something went wrong. Please try again!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setSingleTicketLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTicketId) {
      getSingleTicket();
    }
  }, [selectedTicketId]);

  const handleEscapeKeyPress = (event) => {
    if (event.key === "Escape") {
      dispatch(setIsTicketSelected(false));
      setSingleTicketLoading(false);
      setSingleTicketData({});
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []);

  return (
    <>
      {ticketSelected ? (
        singleTicketLoading ? (
          <>
            <Loader />
          </>
        ) : (
          <Flex
            column
            gap="gap.medium"
            style={{
              width: "100%",
              padding: "1.5rem",
            }}
          >
            <ServiceRequestForm id={item?.ID} serviceType={item?.serviceType} />
            <Details item={singleTicketData} />
          </Flex>
        )
      ) : (
        <FluentUiProvider
          theme={mergeThemes(appTheme, Headertheme)}
          style={{ height: "95%", width: "100%", borderRadius: "4px" }}
        >
          <Flex
            style={{
              margin: "0.6rem 0.6rem 0.6rem 0rem",
              height: "100%",
              width: "99%",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              borderLeft: "1px solid #F0F0F0",
            }}
            column
          >
            <Image src={emptyImg} />
            <Flex column hAlign="center">
              <Text
                style={{ fontSize: "1rem", fontWeight: "600" }}
                content="No Items Selected"
              />
              <Text
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                  color: "#616116",
                }}
                content="Select an item to view details"
              />
            </Flex>
          </Flex>
        </FluentUiProvider>
      )}
    </>
  );
};

export default ShowSingleTicket;
