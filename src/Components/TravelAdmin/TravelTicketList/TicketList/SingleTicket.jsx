import React from "react";
import {
  Provider as FluentUiProvider,
  Flex,
  Text,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
  ChevronDownIcon,
  Divider,
  FlexItem,
} from "@fluentui/react-northstar";
import AvatarProfilePhoto from "../../../../Utilities/AvatarProfilePhoto";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsTicketSelected,
  setItem,
  setSelectedTicketId,
} from "../../../../redux/actions";

const status = {
  0: "New",
  1: "Under process",
  2: "Resolved",
  3: "Rejected",
};

const SingleTicket = ({ item }) => {
  const dispatch = useDispatch();
  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const travelReducer = useSelector((state) => {
    return state.travelReducer;
  });
  if (CompanyReducer.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (CompanyReducer.theme === "default") {
    appTheme = teamsTheme;
  }
  const handleTicketClick = () => {
    const id = item?.ID;
    dispatch(setItem(item));
    dispatch(setIsTicketSelected(true));
    dispatch(setSelectedTicketId(id));
  };
  return (
    <Flex
      gap="gap.small"
      className="ticket-list-item"
      onClick={handleTicketClick}
      style={{
        backgroundColor:
          travelReducer.selectedTicketId === item?.ID ? "#F3F2F1" : "",

        padding: "0.875rem 0rem 0.875rem 0.875rem",
        cursor: "pointer",
        borderBottom: "1px solid #EDEBE9",
      }}
      vAlign="center"
    >
      <FlexItem>
        <AvatarProfilePhoto
          name={item?.employee_name}
          mailId={item?.office_mail_id}
        />
      </FlexItem>
      <FlexItem>
        <Flex
          column
          style={{
            width: "100%",
          }}
        >
          <FlexItem>
            <Flex space="between">
              <FlexItem>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: ".875rem",
                  }}
                  content={item?.employee_name}
                />
              </FlexItem>
              <FlexItem>
                <Text
                  content={status[item?.status]}
                  style={{
                    paddingRight: "1rem",
                    fontSize: ".75rem",
                  }}
                />
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Text
              style={{
                color: "#616161",
                fontSize: "0.75rem",
              }}
              content={item?.serviceType}
            />
          </FlexItem>
        </Flex>
      </FlexItem>
    </Flex>
  );
};

export default SingleTicket;
