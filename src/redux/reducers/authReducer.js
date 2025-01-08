const initialState = {
  isAuthenticated: false,
  user: {},
  userEmail: "",
  error: null,
  accessToken: "",
  profilePhoto: "",
  devEmail: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: {
          ...state.user,
          accounts: action.payload,
        },
        error: null,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_AUTH":
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case "SET_MOBILE_ACCESSTOKEN":
      return {
        ...state,
        mobileAccessToken: action.payload,
      };
    case "STORE_ACCESS_TOKEN":
      return {
        ...state,
        accessToken: action.payload,
      };
    case "STORE_USER_EMAIL":
      return {
        ...state,
        userEmail: action.payload,
      };
    case "STORE_PROFILE_PHOTO":
      return {
        ...state,
        profilePhoto: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
