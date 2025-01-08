import { TextArea } from "@fluentui/react-northstar";
import React, { useEffect, useState } from "react";

import { fetchLoggedInUserDetails, setTheme } from "../../../redux/actions";
import { useDispatch } from "react-redux";
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

import { useSelector } from "react-redux";
import { app } from "@microsoft/teams-js";


import { setBlogFormData, setTitle } from "../../../redux/actions";
const Heading = () => {
  const dispatch = useDispatch();
  const handleChange = (e) => {
    dispatch(setTitle(e.target.value));
  };
  const TextAreaTheme = {
    componentVariables: {
      TextArea: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      TextArea: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
  };

  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const authReducer = useSelector((state) => {
    return state.authReducer;
  });
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [userEmail, setUserEmail] = useState("");
  const [mainAppTheme, setMainAppTheme] = useState(teamsTheme);

  useEffect(() => {
    if (!authReducer.isMobileDev) {
      app.initialize().then(() => {
        app.registerOnThemeChangeHandler((theme) => {
          setCurrTheme(theme);
        });
        app.getContext().then((context) => {
          setUserEmail(context.user.userPrincipalName);
        });
      });
    } else {
      setUserEmail(authReducer.isMobileEmail);
    }
  }, []);
  useEffect(() => {
    dispatch(setTheme(currTheme));
    if (currTheme === "dark") {
      setMainAppTheme(teamsDarkTheme);
    } else if (currTheme === "contrast") {
      setMainAppTheme(teamsHighContrastTheme);
    } else {
      setMainAppTheme(teamsTheme);
    }
  }, [currTheme]);

  return (
    <FluentUiProvider theme={mergeThemes(mainAppTheme, TextAreaTheme)} style={{ width: "100%" }}>
      <TextArea

        onChange={handleChange}
        placeholder="Write heading"
        fluid

        style={{
          backgroundColor: `${currTheme === "default" ? `#f5f5f5` : `rgb(59,58,57)`}`
        }}
      />
    </FluentUiProvider>
  );
};

export default Heading;
