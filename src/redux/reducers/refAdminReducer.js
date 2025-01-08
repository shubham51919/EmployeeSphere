const initialState = {
  loading: "",
};

export const refAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_REF_ADMIN_LOADING": {
      return {
        ...state,
        loading: action.payload,
      };
    }
    default:
      return state;
  }
};
