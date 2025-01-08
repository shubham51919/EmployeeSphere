const initialState = {
  hrQueryTable: {
    loading: true,
    data: [],
    error: false,
  },
  hrVeiwTicket: {
    loading: false,
    ticketShow: [],
    error: false,
  },
  resolveStatus: "",
};

const hrQueryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCHING_HR_QUERIES":
      return {
        ...state,
        hrQueryTable: {
          ...state.hrQueryTable,
          loading: true,
        },
      };
    case "FETCHED_HR_QUERIES_SUCCESSFULLY":
      return {
        ...state,
        hrQueryTable: {
          ...state.hrQueryTable,
          // loading: false,
          data: action.payload,
          error: false,
        },
      };
    case "FETCHED_HR_QUERIES_FAILED":
      return {
        ...state,
        hrQueryTable: {
          ...state.hrQueryTable,
          loading: false,
          error: true,
          data: [],
        },
      };
    case "HR_VEIW_TICKET_SECTION_FEACHING_DATA":
      return {
        ...state,
        hrVeiwTicket: {
          ...state.hrVeiwTicket,
          loading: true,
        },
      };
    case "HR_VEIW_TICKET_SECTION_FEACHING_CLOSE":
      return {
        ...state,
        hrVeiwTicket: {
          ...state.hrVeiwTicket,
          loading: false,
        },
      };

    case "HR_VEIW_TICKET_SECTION_SUCCESSFULLY":
      return {
        ...state,
        hrVeiwTicket: {
          ...state.hrVeiwTicket,
          ticketShow: action.payload,
          loading: false,
        },
      };
    case "HR_VEIW_TICKET_SECTION_FAILED":
      return {
        ...state,
        hrVeiwTicket: {
          ...state.hrVeiwTicket,
          ticketShow: [],
          error: true,
        },
      };
    case "HR_RESOLVED_TICKET":
      return {
        ...state,
        resolveStatus: action.payload,
      };
    case "SET_LOAD_HR_ADMIN_TABLE":
      return {
        ...state,
        hrQueryTable: {
          loading: action.payload,
        },
      };
    default:
      return state;
  }
};

export default hrQueryReducer;
