import React from "react";
import DOMPurify from "dompurify";

const Sanitize = ({ html }) => {
  // Sanitize the HTML content using DOMPurify

  const sanitizedHTML = DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  // Render the sanitized HTML as React JSX
  return (
    <div
      className="sanitized-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default Sanitize;
