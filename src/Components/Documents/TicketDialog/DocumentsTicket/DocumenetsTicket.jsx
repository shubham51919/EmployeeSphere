import React, { useState } from "react";
import {
  Flex,
  Text,
  Button,
  Input,
  SearchIcon,
} from "@fluentui/react-northstar";

import "./documentsTicket.css";
import BackButton from "../../../../Utilities/BackButton";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TicketTable from "./TicketTable/TicketTable";
import RaiseTicketDialog from "./TicketTable/RaiseTicketDialog";

const DocumenetsTicket = () => {
  const theme = useSelector((state) => {
    return state.CompanyReducer;
  });
  const data = [
    {
      key: 1,
      ticketID: "Ticket 1",
      reason: "Reason 1",
      date: "22-02-2021",
      status: "Resolved",
    },
    {
      key: 2,
      ticketID: "Ticket 1",
      reason: "Reason 1",
      date: "22-02-2021",
      status: "Rejected",
    },
    {
      key: 3,
      ticketID: "Ticket 1",
      reason: "Reason 1",
      date: "22-02-2021",
      status: "In-Process",
    },
    {
      key: 4,
      ticketID: "Ticket 1",
      reason: "Reason 1",
      date: "22-02-2021",
      status: "Resolved",
    },
    {
      key: 5,
      ticketID: "Ticket 1",
      reason: "Reason 1",
      date: "22-02-2021",
      status: "Resolved",
    },
    {
      key: 6,
      ticketID: "Ticket 1",
      reason: "Reason 1",
      date: "22-02-2021",
      status: "Resolved",
    },
    {
      key: 7,
      ticketID: "Ticket 1",
      reason: "Reason 1",
      date: "22-02-2021",
      status: "Resolved",
    },
  ];
  const [currTheme, setCurrTheme] = useState(theme.theme);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // Default to 5 items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return (
    <Flex className="documenets-ticket" column gap="gap.small">
      <Flex className="breadcrumb-div">
        <BackButton currTheme={currTheme} />
        <Text>{">"}</Text>
        <Link to="/documents" className="breadcrumb-prev">
          Documents
        </Link>
        <Text>{">"}</Text>
        <Link to="/documents-tickets" className="breadcrumb-curr">
          Documents Tickets
        </Link>
      </Flex>
      <Flex
        className="documenets-ticket-heading"
        space="between"
        hAlign="center"
        vAlign="center"
        style={{
          width: "100%",
          height: "3rem",
        }}
      >
        <Flex gap="gap.medium" vAlign="center">
          <Text
            as="h3"
            content="Tickets Raised"
            className="documenets-ticket-heading-text"
          />
          <Input
            placeholder="Search"
            icon=<SearchIcon />
            inverted
            style={{
              width: "15rem",
            }}
            className="documenets-ticket-search"
          />
          <Text content="Filter" className="documenets-ticket-filter" />
          <Text content="Sort" className="documenets-ticket-sort" />
        </Flex>
        <Flex>
          <RaiseTicketDialog />
        </Flex>
      </Flex>
      <Flex className="documenets-ticket-content">
        <TicketTable data={data} />
      </Flex>
      <Flex>
        <Button onClick={() => setCurrentPage(currentPage - 1)}>
          Previous Page
        </Button>
        <Button onClick={() => setCurrentPage(currentPage + 1)}>
          Next Page
        </Button>
      </Flex>
    </Flex>
  );
};

export default DocumenetsTicket;
