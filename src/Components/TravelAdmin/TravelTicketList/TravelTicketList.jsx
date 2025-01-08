import React, { useState } from "react";
import {
  Provider as FluentUiProvider,
  Flex,
  MenuButton,
  Divider,
  Text,
  Input,
  SearchIcon,
  Button,
  Image,
  FilterIcon,
  Popup,
} from "@fluentui/react-northstar";
import TicketList from "./TicketList/TicketList";
import debounce from "lodash.debounce";

const status = {
  0: "New",
  1: "Under process",
  2: "Resolved",
  3: "Rejected",
};

const TravelTicketList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [filter, setFilter] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const debouncedSearch = debounce((value) => {
    setSearchDebounced(value);
  }, 700);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update input field state
    debouncedSearch(value);
  };

  return (
    <>
      <Flex
        className="travel-ticket-list"
        style={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          borderRight: "1px solid #EDEBE9",
        }}
        column
        gap="gap.medium"
      >
        <Text
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            paddingLeft: "0.875rem",
            paddingTop: "0.875rem",
          }}
          content="Service Requests "
        />
        <Flex column gap="gap.medium">
          <Flex
            gap="gap.medium"
            style={{
              paddingLeft: "0.875rem",
              paddingRight: "0.875rem",
            }}
          >
            <Input
              value={searchInput} // Use input field state
              onChange={handleSearchChange}
              icon={<SearchIcon />}
              fluid
              placeholder="Search..."
              iconPosition="end"
              style={{ width: "90%" }}
            />
            <Popup
              open={popupOpen}
              style={{
                minWidth: ".5rem",
              }}
              trigger={
                <Button
                  onClick={() => setPopupOpen(!popupOpen)}
                  small
                  icon={<FilterIcon />}
                  // content="Filter"
                  aria-label="Click button"
                />
              }
              content={
                <Flex column gap="gap.small">
                  {Object.keys(status).map((key, index) => {
                    return (
                      <Flex
                        key={index}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setFilter(key);
                          setPopupOpen(false);
                        }}
                      >
                        <Text content={status[key]} />
                      </Flex>
                    );
                  })}
                </Flex>
              }
            />
          </Flex>
          <TicketList search={searchDebounced} filter={filter} />
        </Flex>
      </Flex>
    </>
  );
};

export default TravelTicketList;
