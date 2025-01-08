import React from "react";
import { Flex, Table, Text, Image } from "@fluentui/react-northstar";
import ViewDialog from "./ViewDialog";
import pdf from "../../../Assets/pdf.svg";
import "./documentTable.css";

const header = {
  items: ["Title", "Category", "Date", "Uploaded By", "View"],
};
const data = [
  {
    key: 1,
    title: "Document 1",
    category: "Category 1",
    date: "22-02-2021",
    uploadedBy: "Roman",
  },
  {
    key: 2,
    title: "Document 1",
    category: "Category 1",
    date: "22-02-2021",
    uploadedBy: "Roman",
  },
  {
    key: 3,
    title: "Document 1",
    category: "Category 1",
    date: "22-02-2021",
    uploadedBy: "Roman",
  },
  {
    key: 4,
    title: "Document 1",
    category: "Category 1",
    date: "22-02-2021",
    uploadedBy: "Roman",
  },
  {
    key: 5,
    title: "Document 1",
    category: "Category 1",
    date: "22-02-2021",
    uploadedBy: "Roman",
  },
];

const rows = data.map((row) => ({
  key: row.key,
  items: [
    {
      content: (
        <Flex gap="gap.small" vAlign="center">
          <Image
            src={pdf}
            alt="pdf"
            style={{
              width: "1.2rem",
              height: "1.2rem",
            }}
          />
          <Text content={row.title} />
        </Flex>
      ),
    },
    {
      content: row.category,
    },
    {
      content: row.date,
    },
    {
      content: row.uploadedBy,
    },
    {
      content: <ViewDialog />,
    },
  ],
}));

const DocumenetTable = () => {
  return (
    <Table
      header={header}
      rows={rows}
      aria-label="Static table"
      styles={{
        flexGrow: 1,
      }}
    />
  );
};

export default DocumenetTable;
