const initialState = {
  isLoading: true,
  inProgressResult: [],
  pendingResult: [],
  resolvedResult: [],
  totalQueries: 0,
  totalPending: 0,
};

const hrEmpReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILL_IN_PROGRESS_RESULT": {
      return {
        ...state,
        inProgressResult: action.payload,
      };
    }
    case "FILL_IN_PENDING_RESULT": {
      return {
        ...state,
        pendingResult: action.payload,
      };
    }
    case "FILL_RESOLVED_RESULT": {
      return {
        ...state,
        resolvedResult: action.payload,
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case "SET_TOTAL_QUERIES": {
      return {
        ...state,
        totalQueries: action.payload,
      };
    }
    case "SET_TOTAL_PENDING": {
      return {
        ...state,
        totalPending: action.payload,
      };
    }
    default:
      return state;
  }
};

export default hrEmpReducer;
