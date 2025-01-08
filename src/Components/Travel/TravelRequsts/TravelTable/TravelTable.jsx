import { Table, Text } from "@fluentui/react-northstar";
import React from "react";
import SingleRow from "./SingleRow";

const TravelTable = () => {
  const header = [
    {
      key: 1,
      content: "Request ID",
    },
    {
      key: 2,
      content: "Raised On",
    },
    {
      key: 3,
      content: "Urgency",
    },
    {
      key: 4,
      content: "Service Type",
    },
    {
      key: 5,
      content: "Type",
    },
    {
      key: 6,
      content: "Destination",
    },
    {
      key: 7,
      content: "Remark",
    },
    {
      key: 8,
      content: "Service Form",
    },
    {
      key: 9,
      content: "Status",
    },
  ];
  return (
    <Table
      style={{
        flexGrow: 1,
      }}
      aria-label="Static table"
    >
      <Table.Row>
        {header.map((item) => {
          return (
            <Table.Cell
              content={
                <Text
                  content={item.content}
                  style={{
                    fontWeight: "600",
                    color: "#242424",
                  }}
                />
              }
              key={item.key}
              aria-sort={item["aria-sort"]}
            />
          );
        })}
      </Table.Row>
      <SingleRow />
      <SingleRow />
      <SingleRow />
      <SingleRow />
      <SingleRow />
    </Table>
  );
};

export default TravelTable;
