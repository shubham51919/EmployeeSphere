// import React, {useEffect} from "react";
import DOMPurify from "dompurify";
import { useEffect } from "react";

const Sanitize = ({ html }) => {
  useEffect(() => console.log(html, "datadatadata"), [html]);
  // if(typeof html === "string"){
  html = html?.replaceAll("<p>", '<p class="parent-image-container">');
  html = html?.replaceAll("<img", '<img class="img-responsive"');
  // }
  // Sanitize the HTML content using DOMPurify

  const sanitizedHTML = DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  // Render the sanitized HTML as React JSX
  return (
    <div
      className="sanitized-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Sanitize;
