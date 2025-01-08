import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as microsoftTeams from "@microsoft/teams-js";
import { app } from "@microsoft/teams-js";
import {
  storeProfilePhoto,
  storeAccessToken,
  storeUserEmail,
  setTheme,
} from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import { API_URL, graphEndpoint } from "../../config";
import {
  Flex,
  Text,
  Image,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import axios from "axios";
import { fetchLoggedInUserDetails } from "../../redux/actions";
import mainLoading from "../../Assets/mainLoading.gif";
import { EmpDetails } from "../../Apis/EmpDetails.js";
import LoginImg from "../../Assets/LoginImg.png";
import { ToastContainer, toast } from "react-toastify";

const LoadingScreen = ({ hooks }) => {
  const { accessToken, userEmail } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CompanyReducer = useSelector((state) => state.CompanyReducer);
  const authReducer = useSelector((state) => state.authReducer);
  const [isAuth, setIsAuth] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    app.getContext().then((context) => {
      dispatch(storeUserEmail(context.user.userPrincipalName));
    });
  }, []);

  useEffect(() => {
    // Initialize Teams SDK and handle theme changes
    app.initialize().then(() => {
      app.registerOnThemeChangeHandler((theme) => {
        dispatch(setTheme(theme));
      });
      app.getContext().then((context) => {
        dispatch(setTheme(context.app.theme));
      });
    });
  }, [dispatch]);

  useEffect(() => {
    // Set the app theme based on the current theme
    if (CompanyReducer.theme === "dark") {
      hooks(teamsDarkTheme);
    } else if (CompanyReducer.theme === "contrast") {
      hooks(teamsHighContrastTheme);
    } else {
      hooks(teamsTheme);
    }
  }, [CompanyReducer.theme, hooks]);

  useEffect(() => {
    // Determine if the user is authenticated
    getAuthToken();
  }, []);

  useEffect(() => {
    // Redirect the user after authentication
    if (isAuth) {
      if (isMobile) {
        if (authReducer.devEmail.includes(authReducer.userEmail)) {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuth, isMobile, authReducer.devEmail, authReducer.userEmail, navigate]);

  async function getAuthToken() {
    try {
      const clientSideToken = await getClientSideToken();
      const profile = await getServerSideToken(clientSideToken);
      await fetchProfilePhotos(
        profile.data.res.mail,
        profile.data.token,
        graphEndpoint
      );
      await getEmployeeDetails(profile.data.res.mail, profile.data.token);
      setIsAuth(true);
    } catch (error) {
      handleAuthError(error);
      toast.error("Something went wrong. Please try again!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async function getClientSideToken() {
    try {
      const result = await microsoftTeams.authentication.getAuthToken();
      return result;
    } catch (error) {
      throw new Error("Error getting client-side token: " + error);
    }
  }

  async function getServerSideToken(clientSideToken) {
    try {
      const context = await microsoftTeams.app.getContext();
      const response = await fetch(`${API_URL}/getMicrosoftAccessTokenOfUser`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          tid: context.user.tenant.id,
          token: clientSideToken,
        }),
        mode: "cors",
        cache: "default",
      });
      if (!response.ok) {
        setError(true);
        throw new Error(`Server response not OK: ${response.status}`);
      }

      const profile = await response.json();
      return profile;
    } catch (error) {
      throw new Error("Error getting server-side token: " + error);
    }
  }

  async function fetchProfilePhotos(userEmail, accessToken, endPoint) {
    const graphConfig = {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "image/jpeg",
      },
      responseType: "arraybuffer",
    };
    try {
      const email = userEmail;
      const response = await axios.get(
        `${endPoint}${email}/photo/$value`,
        graphConfig
      );
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      let profilePhotoUrl = `data:image/jpeg;base64,${base64}`;
      dispatch(storeAccessToken(accessToken));
      dispatch(storeProfilePhoto(profilePhotoUrl));
    } catch (error) {
      if (
        accessToken === null ||
        accessToken === undefined ||
        accessToken === ""
      ) {
        console.log("Unable to get AccessToken", error);
        throw new Error("Unable to get AccessToken " + error);
      }
      dispatch(storeAccessToken(accessToken));
      dispatch(storeProfilePhoto(null));
      console.log("Unable to get Profile Photo", error);
    }
  }

  function handleAuthError(error) {
    if (error.message === "invalid_grant") {
      display(`Error: ${error.message} - user or admin consent required`);
      setIsAuth(false);
    } else {
      display(`Error from web service: ${error.message}`);
    }
  }

  function display(text, elementTag) {
    var logDiv = document?.getElementById("logs");
    if (logDiv) {
      var p = document.createElement(elementTag ? elementTag : "p");
      p.innerText = text;
      logDiv.append(p);
      console.log("ssoDemo: " + text);
      return p;
    }
  }

  async function getEmployeeDetails(userEmail, accessToken) {
    let payload = {
      emailId: userEmail,
    };
    try {
      const response = await EmpDetails(accessToken).post(
        `/employeeDetail`,
        payload
      );
      dispatch(fetchLoggedInUserDetails(response.data.data[0]));
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching employee details: " + error);
    }
  }
  useEffect(() => {
    // Add an event listener to monitor window width changes
    const handleResize = () => {
      // Define your mobile threshold width (e.g., 768 pixels)
      const mobileThreshold = 768;
      // Check if the window width is less than the mobile threshold
      const isMobile = window.innerWidth < mobileThreshold;
      setIsMobile(isMobile);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {error ? (
        <Flex
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text as="h1" content="Sorry, You are not authorised!" />
        </Flex>
      ) : isMobile ? (
        <Flex
          style={{
            height: "100%",
          }}
        >
          <Flex
            className="coming-soon-overlay"
            column
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={LoginImg}
              style={{
                height: "10rem",
                width: "10rem",
                maxHeight: "10rem",
                maxWidth: "10rem",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "8px",
                color: "white",
                fontSize: "20px",
              }}
            >
              Coming Soon For Mobile...
            </div>
          </Flex>
        </Flex>
      ) : (
        <Flex
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ height: "100px", width: "100px" }}
            src={mainLoading}
            alt="Loading..."
          />
        </Flex>
      )}
      <ToastContainer />
    </>
  );
};

export default LoadingScreen;
