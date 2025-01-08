import { Pill, Table, Text } from "@fluentui/react-northstar";
import React from "react";

const SingleRow = () => {
  return (
    <Table.Row
      style={{
        color: "#616161",
      }}
    >
      <Table.Cell
        content="AA123"
        style={{
          fontWeight: "600",
          color: "#242424",
        }}
      />
      <Table.Cell content="22/02/2023" />
      <Table.Cell content="High" />
      <Table.Cell content="Accommodation" />
      <Table.Cell content="Domestic" />
      <Table.Cell content="Delhi" />
      <Table.Cell content="View" />
      <Table.Cell content="View" />
      <Table.Cell
        content={
          <Pill
            style={{
              backgroundColor: "#FFF5F4",
              textAlign: "center",
              color: "#C12A1C",
            }}
            rectangular
            content={<Text content="Rejected" />}
          />
        }
      />
    </Table.Row>
  );
};

export default SingleRow;
