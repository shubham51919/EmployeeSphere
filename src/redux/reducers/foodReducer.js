const initialState = {
  checkLunch: false,
  checkDinner: false,
  orderedLunch: true,
  orderedDinner: true,
  isLunchAfterTen: false,
  isDinnerAfterThree: false,
  reRenderOrderDetails: false,
};

const foodReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SUBMIT_ORDER_LUNCH_STATUS":
      return {
        ...state,
        checkLunch: action.payload,
      };
    case "SUBMIT_ORDER_DINNER_STATUS":
      return {
        ...state,
        checkDinner: action.payload,
      };
    case "CURRENT_LUNCH_ORDER_STATUS":
      return {
        ...state,
        orderedLunch: action.payload,
      };
    case "CURRENT_DINNER_ORDER_STATUS":
      return {
        ...state,
        orderedDinner: action.payload,
      };
    case "IS_AFTER_TEN_LUNCH":
      return {
        ...state,
        isLunchAfterTen: action.payload,
      };
    case "IS_AFTER_THREE_DINNER":
      return {
        ...state,
        isDinnerAfterThree: action.payload,
      };
    case "RERENDER_ORDER_DETAILS":
      return {
        ...state,
        reRenderOrderDetails: action.payload,
      };
    default:
      return state;
  }
};
export default foodReducer;
