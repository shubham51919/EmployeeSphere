import React, { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  CloseIcon,
  Form,
  FormField,
  Dropdown,
} from "@fluentui/react-northstar";
import "./raiseTicketDialog.css";
const RaiseTicketDialog = () => {
  const [showDialog, setShowDialog] = useState(false);
  const inputItems = [
    "Bruce Wayne",
    "Natasha Romanoff",
    "Steven Strange",
    "Alfred Pennyworth",
    `Scarlett O'Hara`,
    "Imperator Furiosa",
    "Bruce Banner",
    "Peter Parker",
    "Selina Kyle",
  ];

  return (
    <Dialog
      open={showDialog}
      className="doc-raise-ticket-dialog"
      trigger={
        <Button
          primary
          content="Raise Ticket"
          onClick={() => setShowDialog(true)}
        />
      }
      header=<Flex
        space="between"
        vAlign="center"
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Text as="h3" content="Raise Ticket" />
        <CloseIcon
          style={{
            cursor: "pointer",
          }}
          onClick={() => setShowDialog(false)}
        />
      </Flex>
      content=<Flex column gap="gap.small">
        <Form>
          <FormField>
            <Dropdown
              aria-label="Issue Type"
              items={inputItems}
              placeholder="Select your hero"
              checkable
              getA11ySelectionMessage={{
                onAdd: (item) => `${item} has been selected.`,
              }}
            />
          </FormField>
        </Form>
      </Flex>
      cancelButton={{
        content: "Cancel",
        onClick: () => setShowDialog(false),
      }}
      confirmButton={{
        content: "Raise Ticket",
        onClick: () => setShowDialog(false),
        primary: true,
      }}
    />
  );
};

export default RaiseTicketDialog;
