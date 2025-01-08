const initialState = {
  allBlogs: [],
  allSuggestions: [],
  allSuggestionsLoading: false,
  isAllBlogLoading: false,
  commented: true,
  loading: false,
  userProfilePhoto: "",
};

const careerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BLOG_DATA":
      return {
        ...state,
        allBlogs: action.payload,
      };
    case "FILL_LOGEEDIN_USER": {
      return { ...state, loggedInUserDetails: action.payload };
    }
    case "SET_CARRER_LOADING": {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case "SET_COMMENT_SUBMITTED": {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case "SET_ALL_SUGGESTIONS":
      return {
        ...state,
        allSuggestions: action.payload,
      };
    case "SET_ALL_SUGGESTIONS_LOADING":
      return {
        ...state,
        allSuggestionsLoading: action.payload,
      };
    case "SET_USER_PROFILE_PHOTO":
      return {
        ...state,
        userProfilePhoto: action.payload,
      };
    case "SET_ALL_BLOGS_LOADING":
      return {
        ...state,
        isAllBlogLoading: action.payload,
      };

    default:
      return state;
  }
};

export default careerReducer;
