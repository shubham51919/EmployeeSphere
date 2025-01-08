export const submitFormData = (formData) => {
  return {
    type: "SUBMIT_FORM_DATA",

    payload: formData,
  };
};
export const storeAccessToken = (formData) => {
  return {
    type: "STORE_ACCESS_TOKEN",
    payload: formData,
  };
};
export const storeProfilePhoto = (formData) => {
  return {
    type: "STORE_PROFILE_PHOTO",
    payload: formData,
  };
};
export const storeUserEmail = (formData) => {
  return {
    type: "STORE_USER_EMAIL",
    payload: formData,
  };
};
export const fetchFormDataRequest = () => ({
  type: "FETCH_FORM_DATA_REQUEST",
});

export const fetchLoggedInUserDetails = (formData) => ({
  type: "FETCH_LOGGED_IN_USER_DETAILS",

  payload: formData,
});

export const fetchFormDataFailure = (error) => ({
  type: "FETCH_FORM_DATA_FAILURE",

  payload: error,
});

export const preFillFormData = (formData) => ({
  type: "PRE_FILL_FORM_DATA",

  payload: formData,
});

export const inputChanged = (name, value) => ({
  type: "INPUT_CHANGED",

  payload: {
    name,

    value,
  },
});

export const fileUploaded = (file) => ({
  type: "FILE_UPLOADED",
  payload: file,
});

export const fetchJobRole = (jobRole) => ({
  type: "FETCH_JOB_ROLE",

  payload: jobRole,
});

export const fetchJobTitle = (jobTitle) => ({
  type: "FETCH_JOB_ROLE",

  payload: jobTitle,
});

export const loginSuccess = (user) => {
  return {
    type: "LOGIN_SUCCESS",

    payload: user,
  };
};

export const errorInit = (name, value) => ({
  type: "ERROR_INIT",

  payload: {
    name,

    value,
  },
});

export const fillReferredStatus = (candidates) => {
  return {
    type: "FILL_REFERRED_STATUS",

    payload: candidates,
  };
};

export const fillReferredCandidates = (allCandidates) => {
  return {
    type: "FILL_REFERRED_CANDIDATES",

    payload: allCandidates,
  };
};

export const fillReferredLeaderboard = (allCandidates) => {
  return {
    type: "FILL_REFERRED_LEADERBOARD",

    payload: allCandidates,
  };
};

export const fillProfilePhotoLeaderboard = (url) => {
  return {
    type: "FILL_PROFILEPHOTO_LEADERBOARD",

    payload: url,
  };
};

export const setIsLoading = (isLoading) => {
  return {
    type: "SET_IS_LOADING",

    payload: isLoading,
  };
};

export const setYourReferralsLoading = (isLoading) => {
  return {
    type: "SET_YOUR_REFERRALS_LOADING",
    payload: isLoading,
  };
};

export const fillEmpDetails = (emp) => {
  return {
    type: "FILL_EMPLOYEE_DETAILS",

    payload: emp,
  };
};

export const setTheme = (theme) => {
  return {
    type: "SET_THEME",

    payload: theme,
  };
};

export const fillInProgressResult = (items) => {
  return {
    type: "FILL_IN_PROGRESS_RESULT",

    payload: items,
  };
};

export const fillPendingResult = (items) => {
  return {
    type: "FILL_IN_PENDING_RESULT",

    payload: items,
  };
};

export const fillResolvedResult = (items) => {
  return {
    type: "FILL_RESOLVED_RESULT",

    payload: items,
  };
};

export const setLoad = (data) => {
  return {
    type: "SET_LOADING",

    payload: data,
  };
};

export const setLoadHrAdminTable = (data) => {
  return {
    type: "SET_LOAD_HR_ADMIN_TABLE",

    payload: data,
  };
};

export const clearReferralForm = () => {
  return {
    type: "CLEAR_REFERRAL_FORM",
  };
};

export const fillLoggedInUser = (data) => {
  return {
    type: "FILL_LOGEEDIN_USER",

    payload: data,
  };
};

export const setCarrerAdviceLoading = (data) => {
  return {
    type: "SET_CARRER_LOADING",
    payload: data,
  };
};

export const fillParticularRef = (data) => {
  return {
    type: "FILL_PARTICULAR_REF",

    payload: data,
  };
};

export const setParticularRefLoading = (data) => {
  return {
    type: "SET_PARTICULAR_REF_LOADING",

    payload: data,
  };
};

export const setRefAdminLoading = (data) => {
  return {
    type: "SET_REF_ADMIN_LOADING",

    payload: data,
  };
};

export const setLeaderboardLoading = (data) => {
  return {
    type: "SET_LEADERBOARD_LOADING",
    payload: data,
  };
};
export const setBlogData = (data) => {
  return {
    type: "SET_BLOG_DATA",
    payload: data,
  };
};

export const setAllSuggestions = (data) => {
  return {
    type: "SET_ALL_SUGGESTIONS",
    payload: data,
  };
};

export const setAllSuggestionsLoading = (data) => {
  return {
    type: "SET_ALL_SUGGESTIONS_LOADING",
    payload: data,
  };
};

export const setCommentSubmitted = (data) => {
  return {
    type: "SET_COMMENT_SUBMITTED",
    payload: data,
  };
};

export const setCommentOnParticularBlog = (data) => {
  return {
    type: "SET_COMMENT_ON_PARTICULAR_BLOG",
    payload: data,
  };
};

export const setUserProfilePhoto = (data) => {
  return {
    type: "SET_USER_PROFILE_PHOTO",
    payload: data,
  };
};

export const setAllBlogsLoading = (data) => {
  return {
    type: "SET_ALL_BLOGS_LOADING",
    payload: data,
  };
};

export const setAuth = (data) => {
  return {
    type: "SET_AUTH",
    payload: data,
  };
};

export const setTotalQueries = (data) => {
  return {
    type: "SET_TOTAL_QUERIES",
    payload: data,
  };
};
export const setTotalPending = (data) => {
  return {
    type: "SET_TOTAL_PENDING",
    payload: data,
  };
};

// Food Portal

export const OrderStatusLunch = (data) => {
  return {
    type: "SUBMIT_ORDER_STATUS",
    payload: data,
  };
};
export const OrderStatusDinner = (data) => {
  return {
    type: "SUBMIT_ORDER_DINNER_STATUS",
    payload: data,
  };
};
export const CurrStatusLunch = (data) => {
  return {
    type: "CURRENT_LUNCH_ORDER_STATUS",
    payload: data,
  };
};
export const CurrStatusDinner = (data) => {
  return {
    type: "CURRENT_DINNER_ORDER_STATUS",
    payload: data,
  };
};
export const checkLunchAfterTen = (data) => {
  return {
    type: "IS_AFTER_TEN_LUNCH",
    payload: data,
  };
};
export const checkDinnerAfterThree = (data) => {
  return {
    type: "IS_AFTER_THREE_DINNER",
    payload: data,
  };
};

export const renderOnSubmitOrderDetails = (data) => {
  return {
    type: "RERENDER_ORDER_DETAILS",
    payload: data,
  };
};

export const setEditorHtml = (data) => {
  return {
    type: "SET_EDITOR_HTML",
    payload: data,
  };
};

export const setTitle = (data) => {
  return {
    type: "SET_TITLE",
    payload: data,
  };
};

export const setCategory = (data) => {
  return {
    type: "SET_CATEGORY",
    payload: data,
  };
};

export const showSuccessMessage = (data) => {
  return {
    type: "SHOW_SUCCESS_MESSAGE",
    payload: data,
  };
};

export const resetConnectState = () => {
  return {
    type: "RESET_STATE",
  };
};

export const setRerenderActivity = (data) => {
  console.log("gb", data);
  return {
    type: "RERENDER_ACTIVITY",
    payload: data,
  };
};
export const setReRenderComment = (data) => {
  return {
    type: "RERENDER_COMMENT",
    payload: data,
  };
};

export const setNewComment = (data) => {
  return {
    type: "SET_NEW_COMMENT",
    payload: data,
  };
};

export const setAccessToken = (data) => {
  return {
    type: "SET_ACCESS_TOKEN",
    payload: data,
  };
};

export const resetCompanyState = () => {
  return {
    type: "RESET_COMPANY_STATE",
  };
};

export const setRerenderReferralPortal = (data) => {
  return {
    type: "SET_RERENDER_REFERRAL_PORTAL",
    payload: data,
  };
};

// ******* travel ******

export const setIsTicketSelected = (data) => {
  return {
    type: "TICKET_SELECTED_TRUE",
    payload: data,
  };
};
export const setSelectedTicketId = (data) => {
  return {
    type: "STORE_SELECTED_TICKET_ID",
    payload: data,
  };
};
export const setItem = (data) => {
  return {
    type: "SET_ITEM",
    payload: data,
  };
};
export const resetTravelState = () => {
  return {
    type: "RESET_TRAVEL_STATE",
  };
};
