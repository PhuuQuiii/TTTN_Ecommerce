import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { signIn } from "../../../redux/actions/auth_actions";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

const Login = (props) => {
  const [isSignup, setIsSignup] = useState(false);
  const history = useHistory();

  const switchToSignup = () => setIsSignup(true);
  const switchToLogin = () => setIsSignup(false);

  const [state, setState] = useState({
    email: "",
    password: "",
    error: "",
  });

  const { error, email, password } = state;
  const { loading } = props;

  const handleChange = (event) => {
    setState({
      ...state,
      error: false,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.signIn(email, password);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      axios
        .put(`https://servertttn-production.up.railway.app/api/admin-auth/email-verify?token=${token}`)
        .then((response) => {
          alert("Email verified successfully!");
          history.push("/");
        })
        .catch((error) => {
          alert("Email verification failed!");
        });
    }
  }, [history]);

  return (
    <div className="login-dark">
      {isSignup ? (
        <SignupForm switchToLogin={switchToLogin} />
      ) : (
        <SigninForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          state={state}
          loading={loading}
          switchToSignup={switchToSignup}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuth,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { signIn })(Login);
