import formReducer from "./formReducer";
import authReducer from "./authReducer";
import CompanyReducer from "./CompanyReducer";
import { combineReducers } from "@reduxjs/toolkit";
import hrQueryReducer from "./HRQueryReducer";
import hrEmpReducer from "./hrEmpReducer";
import careerReducer from "./careerReducer";
import foodReducer from "./foodReducer";
import { refAdminReducer } from "./refAdminReducer";
import connectReducer from "./connectReducer";
import travelReducer from "./travelReducer";

const rootReducers = combineReducers({
  formReducer,
  authReducer,
  foodReducer,
  CompanyReducer,
  hrQueryReducer,
  hrEmpReducer,
  careerReducer,
  refAdminReducer,
  connectReducer,
  travelReducer
});

export default rootReducers;
