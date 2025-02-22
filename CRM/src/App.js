import "antd/dist/antd.css";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.scss";
import Alert from "./components/common/Alert";
import Signin from "./components/pages/Signin";
import { loadMe } from "./redux/actions/auth_actions";
import store from "./redux/store";
import MainRouter from "./router/MainRouter";
import { verifyLocalStorage } from "./utils/common";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = (props) => {
  useSelector(state => state.auth.isAuth);

  useEffect(() => {
    if (!localStorage.token) return;
    store.dispatch(loadMe()); // returns socket user obj else null
  }, []);

  return (
    <>
      <Alert />
      {!verifyLocalStorage() ? <Signin /> : <MainRouter />}
    </>
  );
};

export default App;
