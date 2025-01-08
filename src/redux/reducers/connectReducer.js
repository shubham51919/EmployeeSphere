const initialState = {
  editorHtml: "",
  title: "",
  category: "",
  showSuccessMessgae: false,
  rerenderActivity: false,
  newComments: [
    // Example comment structure:
    // {
    //   name: "",
    //   posting: false,
    //   commentContent: "",
    // }
  ],
};

const connectReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EDITOR_HTML":
      return {
        ...state,
        editorHtml: action.payload,
      };
    case "SET_TITLE":
      return {
        ...state,
        title: action.payload,
      };
    case "SET_CATEGORY":
      return {
        ...state,
        category: action.payload,
      };
    case "SHOW_SUCCESS_MESSAGE":
      return {
        ...state,
        showSuccessMessgae: action.payload,
      };
    case "RESET_STATE":
      return {
        ...state,
        editorHtml: "",
        title: "",
        category: "",
        showSuccessMessgae: false,
        rerenderActivity: false,
        newComments: [],
      };
    case "SET_NEW_COMMENT": {
      return {
        ...state,
        newComments: [
          ...state.newComments,
          action.payload, // Append the new comment to the existing comments
        ],
      };
    }
    case "RERENDER_ACTIVITY": {
      return {
        ...state,
        rerenderActivity: action.payload,
      };
    }

    case "UPDATE_COMMENT_POSTING_STATUS": {
      const { commentId, posting } = action.payload;
      // loop through the comments and find the comment with the given id and update its posting status
      const newComments = state.newComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            posting,
          };
        }
        return comment;
      });
      return {
        ...state,
        newComments,
      };
    }
    default:
      return state;
  }
};

export default connectReducer;
