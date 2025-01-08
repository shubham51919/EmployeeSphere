import React, { useEffect, useState } from "react";
import {
  Flex,
  Divider,
  Skeleton,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  FlexItem,
} from "@fluentui/react-northstar";
import _ from "lodash";

import { useSelector } from "react-redux";
import SingleTicket from "./SingleTicket";
import travelAdminApi from "../../../../Apis/travelApi";
import { toast } from "react-toastify";
import { useAuthData } from "../../../../hooks/useAuthData";

const TicketList = ({ search, filter }) => {
  const { accessToken, userEmail } = useAuthData();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  if (CompanyReducer.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (CompanyReducer.theme === "default") {
    appTheme = teamsTheme;
  }
  const travelAdmin = travelAdminApi(accessToken);

  const getTickets = async () => {
    setLoading(true);
    const params = {
      pageNo: 1,
      pageLimit: 10,
      search: search,
      filter: filter,
      mail: userEmail,
    };
    try {
      const response = await travelAdmin.get("/getTravelIDs", {
        params,
      });
      setData(response?.data?.data.data);
    } catch (err) {
      setError(true);
      toast.error("Something went wrong. Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
  }, [search, filter]);
  return loading ? (
    _.times(10, (i) => (
      <Skeleton animation="pulse">
        <Flex
          gap="gap.small"
          column
          style={{
            paddingLeft: ".875rem",
          }}
        >
          <Flex gap="gap.small">
            <FlexItem>
              <Skeleton.Avatar size="medium" />
            </FlexItem>
            <FlexItem>
              <Flex
                gap="gap.small"
                style={{
                  width: "100%",
                }}
                column
              >
                <Skeleton.Line width="50%" />
                <Skeleton.Line width="100%" />
              </Flex>
            </FlexItem>
          </Flex>
          <Divider />
        </Flex>
      </Skeleton>
    ))
  ) : (
    <Flex
      column
      style={{
        overflowY: "auto",
      }}
    >
      {data?.map((item) => {
        return <SingleTicket item={item} key={item.id} />;
      })}
    </Flex>
  );
};

export default TicketList;
