import React, { useState } from "react";
import { Button } from "antd";
import axios from "axios";
import "../../../styles/_signup.scss";

function SignupForm({ switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    address: "",
    email: "",
    password: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // await axios.post("http://localhost:3001/api/admin-auth/signup", formData);
      await axios.post("https://backend-ecommerce-theta-plum.vercel.app/api/admin-auth/signup", formData);
      alert("Registration successful! Please check your email to verify your account.");
      switchToLogin();
    } catch (err) {
      setError("Registration failed. Please try again!");
    }
    
    setLoading(false);
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ color: "black" }} />
      </div>
      <div className="form-group">
        <input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleChange} required style={{ color: "black" }} />
      </div>
      <div className="form-group">
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required style={{ color: "black" }} />
      </div>
      <div className="form-group">
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ color: "black" }} />
      </div>
      <div className="form-group">
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ color: "black" }} />
      </div>
      <div className="form-group">
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={{ color: "black" }} />
      </div>
      <div className="form-group">
        <Button className="btn btn-primary btn-block" htmlType="submit" loading={loading}>
          Sign Up
        </Button>
      </div>
      <p className="switch-form">Already have an account? <span onClick={switchToLogin} style={{ color: 'whtite', cursor: 'pointer' }}>Log in</span></p>
    </form>
  );
}

export default SignupForm;