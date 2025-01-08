const initialState = {
  referredStatus: [],
  referredCandidates: [],
  referredLeaderboard: [],
  isLoading: true,
  isYourReferralsLoading: true,
  theme: "",
  particularRef: [],
  particularRefLoading: false,
  isLeaderboardLoading: true,
  rerenderReferralPortal: false,
};

const CompanyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILL_REFERRED_STATUS":
      return {
        ...state,

        referredStatus: action.payload[0],
      };

    case "FILL_REFERRED_CANDIDATES":
      return {
        ...state,

        referredCandidates: action.payload[1],
      };

    case "FILL_REFERRED_LEADERBOARD":
      return {
        ...state,

        referredLeaderboard: action.payload[2],
      };

    case "FILL_PROFILEPHOTO_LEADERBOARD":
      return {
        ...state,

        referredLeaderboard: action.payload,
      };

    case "SET_IS_LOADING":
      return {
        ...state,

        isLoading: action.payload,
      };
    case "SET_LEADERBOARD_LOADING":
      return {
        ...state,
        isLeaderboardLoading: action.payload,
      };
    case "SET_THEME":
      return {
        ...state,

        theme: action.payload,
      };

    case "FILL_PARTICULAR_REF":
      return {
        ...state,

        particularRef: action.payload,
      };

    case "SET_PARTICULAR_REF_LOADING":
      return {
        ...state,

        particularRefLoading: action.payload,
      };
    case "SET_YOUR_REFERRALS_LOADING":
      return {
        ...state,
        isYourReferralsLoading: action.payload,
      };
    case "SET_RERENDER_REFERRAL_PORTAL":
      return {
        ...state,
        rerenderReferralPortal: action.payload,
      };
    case "RESET_COMPANY_STATE": {
      return {
        ...state,
        referredStatus: [],
        referredCandidates: [],
        referredLeaderboard: [],
        isLoading: true,
        isYourReferralsLoading: true,
        particularRef: [],
        particularRefLoading: false,
        isLeaderboardLoading: true,
      };
    }
    default:
      return state;
  }
};

export default CompanyReducer;
