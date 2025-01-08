const initialState = {
  fetchFormData: {},
  loggedInUserDetails: [],
  file: null,
  loading: false,
  jobRole: {},
  jobTitle: {},
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_FORM_DATA_REQUEST":
      return { ...state, loading: true };
    case "FETCH_LOGGED_IN_USER_DETAILS":
      return {
        ...state,
        loading: false,
        loggedInUserDetails: action.payload,
      };
    case "INPUT_CHANGED":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };
    case "FETCH_FORM_DATA_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "PRE_FILL_FORM_DATA":
      return { ...state, fetchFormData: action.payload };

    case "SUBMIT_FORM_DATA":
      return {
        ...state,
        loading: false,
        formData: { ...state.formData },
      };
    case "FILE_UPLOADED":
      return { ...state, file: action.payload };
    case "FETCH_JOB_ROLE":
      return {
        ...state,
        loading: false,
        jobRole: {
          ...state.jobRole,
          ...action.payload,
        },
      };
    case "FETCH_JOB_TITLE":
      return {
        ...state,
        loading: false,
        jobRole: {
          ...state.jobTitle,
          ...action.payload,
        },
      };
    case "ERROR_INIT":
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.name]: action.payload.value,
        },
      };
    case "CLEAR_REFERRAL_FORM": {
      return {
        ...state,
        formData: {
          FirstName: "",
          LastName: "",
          EmailID: "",
          Mobile: "",
          Experience: "",
          formJobRole: "",
          formJobTitle: "",
          Resume: null,
          LinkedInUrl: "",
          Skills: "",
        },
        jobRole: {},
        jobTitle: {},
        file: null,
      };
    }
    default:
      return state;
  }
};

export default formReducer;
