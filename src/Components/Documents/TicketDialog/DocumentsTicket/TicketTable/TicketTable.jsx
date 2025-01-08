import { Flex } from "@fluentui/react-northstar";
import React from "react";
import { Table } from "@fluentui/react-northstar";
import TicketTableDialog from "./TicketTableDialog";
const TicketTable = ({ data }) => {
  const header = {
    items: ["TicketID", "Reason", "Date", "Status", "View"],
  };

  const rows = data.map((row) => ({
    key: row.key,
    items: [
      {
        content: row.ticketID,
      },
      {
        content: row.reason,
      },
      {
        content: row.date,
      },
      {
        content: (
          <Flex
            style={{
              backgroundColor:
                row.status === "Resolved"
                  ? "#DEF2E7"
                  : row.status === "Rejected"
                  ? "#FFDED4"
                  : "#D8E9FD",
              width: "80px",
              height: "20px",
              color:
                row.status === "Resolved"
                  ? "#044A29"
                  : row.status === "Rejected"
                  ? "#AB2D05"
                  : "#09347A",
              borderRadius: "9px",
              padding: "0.2rem 0.7rem",
              fontSize: "10px",
              textAlign: "center",
            }}
          >
            {row.status}
          </Flex>
        ),
      },
      {
        content: <TicketTableDialog />,
      },
    ],
  }));

  return (
    <Flex>
      <Table
        header={header}
        rows={rows}
        aria-label="Static table"
        style={{
          flexGrow: 1,
        }}
      />
    </Flex>
  );
};

export default TicketTable;
