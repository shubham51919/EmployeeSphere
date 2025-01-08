import React, { useEffect, useState } from "react";
import BackButton from "../../Utilities/BackButton";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Documents = ({ hooks }) => {
  function extractMP4URL(sharePointLink) {
    try {
      const url = new URL(sharePointLink);
      const params = new URLSearchParams(url.search);

      if (params.has("nav")) {
        const navValue = params.get("nav");
        const decodedNavValue = decodeURIComponent(navValue);
        const match = decodedNavValue.match(/"url":"([^"]+\.mp4)"/);

        if (match) {
          const mp4URL = match[1];
          return mp4URL;
        }
      }

      return null; // No MP4 URL found in the given SharePoint link
    } catch (error) {
      console.error("Error extracting MP4 URL:", error);
      return null;
    }
  }
  const originalLink =
    ""
  const convertedLink = extractMP4URL(originalLink);

  return (
    <>
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default Documents;
