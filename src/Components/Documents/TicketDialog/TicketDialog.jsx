import { Dialog, Button, Image } from "@fluentui/react-northstar";
import React from "react";
import { useNavigate } from "react-router-dom";

const TicketDialog = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/documents-tickets");
  };
  return (
    <>
      <Button onClick={handleClick} content="Ticket" primary />
    </>
  );
};

export default TicketDialog;
