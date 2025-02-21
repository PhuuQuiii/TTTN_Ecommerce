import React, { useState } from "react";
import { Button } from "antd";

function SigninForm({ handleChange, handleSubmit, state, loading, switchToSignup }) {
  const [value, setValue] = useState({ hidden: true });

  const toggleShow = () => {
    setValue({ hidden: !value.hidden });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div
        className="illustration"
        onClick={toggleShow}
        style={{ cursor: "pointer", color: "#ffff" }}
      >
        {value.hidden ? <i className="fa fa-eye-slash" /> : <i className="fa fa-eye" />}
      </div>

      <div className="form-group">
        <input type="email" className="form-control" placeholder="Email" name="email" onChange={handleChange} value={state.email} required />
      </div>

      <div className="form-group">
        <input type={value.hidden ? "password" : "text"} className="form-control" placeholder="Password" name="password" onChange={handleChange} value={state.password} required />
      </div>

      <div className="form-group check-group">
        <input type="checkbox" id="checkbox" onClick={toggleShow} defaultChecked={!value.hidden} />
        <label htmlFor="checkbox" className="checkbox-label">Show password</label>
      </div>

      <p className="switch-form">
        Already have a shop but not registered?{" "}
        <span onClick={switchToSignup} style={{ color: "#1985ea", cursor: "pointer" }}>Click here</span>
      </p>

      <div className="form-group">
        <Button className="btn btn-primary btn-block" htmlType="submit" loading={loading}>
          Log In
        </Button>
      </div>
    </form>
  );
}

export default SigninForm;
