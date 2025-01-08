import ReactQuill from "react-quill";
import React, { useEffect, useState } from "react";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
// import "./styles.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setEditorHtml } from "../../../../redux/actions";
import { app } from "@microsoft/teams-js";

import {
  Flex,
  Text,
  Image,
  Loader,
  RetryIcon,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import { setTheme } from "../../../../redux/actions";

import "./Editor.css";
export const Editor = ({ currTheme }) => {
  const dispatch = useDispatch();
  // const { editorHtml } = connectReducer;
  // const [state, setState] = React.useState({ value: null });
  const handleChange = (value) => {
    dispatch(setEditorHtml(value));
  };
  // console.log(editorHtml, "editorHtml");
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  const handleBlurredEditor = (range, source, quill) => {
    // Get the editor's content
    const editorContent = quill.getContents();

    // Iterate through the content and modify external links
    editorContent.ops.forEach((op) => {
      if (op.insert && op.insert.link) {
        const link = op.insert.link;
        if (link.startsWith("http://") || link.startsWith("https://")) {
          // Open external links in a new tab
          op.insert.target = "_blank";
        }
      }
    });

    // Update the editor's content with modified links
    quill.setContents(editorContent);
  };
  return (
    <Flex
      className={`${currTheme === "default" ? `text-editor` : `dark-text-editor`
        }`}
      column
      style={{
        borderRadius: "0.5rem",
      }}
    >
      <ReactQuill
        theme="snow"
        // value={editorHtml}
        onChange={handleChange}
        placeholder={"Write something here..."}
        modules={modules}
        formats={formats}
        onBlur={handleBlurredEditor}
      />
      <EditorToolbar />
    </Flex>
  );
};

export default Editor;
