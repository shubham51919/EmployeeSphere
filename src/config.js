export const msalConfig = {
  auth: {
    clientId: "",
    authority:
      "https://login.microsoftonline.com/",
    redirectUri: window.location.origin + "/",
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// config file

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read", "Directory.Read.All"],
};

export const authConfig = {
  clientId: "",
  initiateLoginEndpoint: window.location.origin,
};

export const config = {
  initiateLoginEndpoint: window.location.origin + "/auth-start.html",
  clientId: process.env.REACT_APP_CLIENT_ID,
};
export const graphEndpoint = "https://graph.microsoft.com/v1.0/users/";
export const TALSUITE_URL = "";
export const EMP_DETAILS_API_URL =
  "/api/notification";
export const API_URL = "";
