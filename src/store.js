import { createStore, applyMiddleware, compose } from "redux";

import thunk from "redux-thunk";

import rootReducers from "./redux/reducers/index";
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducers,

  composeEnhancer(applyMiddleware(thunk))
);

// const store = createStore(rootReducers, applyMiddleware(thunk));

export default store;
