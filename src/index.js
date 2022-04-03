import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { HashRouter } from "react-router-dom";
// import reportWebVitals from './reportWebVitals';
// import * as serviceWorker from './serviceWorker';
import "../src/main.scss";
import { UserSignupPage } from "./pages/UserSignupPage";
import { LoginPage } from "./pages/LoginPage";
import * as apiCalls from "./api/apiCalls";

import App from "./containers/App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import authReducer from "./redux/authReducer";
import logger from "redux-logger";
import thunk from "redux-thunk";
import configureStore from "./redux/configureStore";

// const actions = {
//     postSignup: apiCalls.signup
// }

// const actions = {
//     postLogin: apiCalls.login
// }

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// serviceWorker.unregister();
