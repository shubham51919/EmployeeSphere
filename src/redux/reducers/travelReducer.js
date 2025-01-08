const initialState = {
  ticketSelected: false,
  selectedTicketId: null,
  item: {},
};

const travelReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TICKET_SELECTED_TRUE":
      return {
        ...state,
        ticketSelected: action.payload,
      };

    case "STORE_SELECTED_TICKET_ID":
      return {
        ...state,
        selectedTicketId: action.payload,
      };
    case "SET_ITEM": {
      return {
        ...state,
        item: action.payload,
      };
    }
    case "RESET_TRAVEL_STATE": {
      return {
        ...state,
        ticketSelected: false,
        selectedTicketId: null,
        item: {},
      };
    }
    default:
      return state;
  }
};
export default travelReducer;
