import axios from 'axios';
import React, { useState } from 'react';

const RegisterSOC = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    establishedDate: '',
    username: '',
    password: '',
    role: 'SOC',
    photo: '',
    idCardNumber: '',
    businessLicense: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/soc/register', formData);
      alert('Registration successful');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
      <input type="date" name="establishedDate" placeholder="Established Date" onChange={handleChange} required />
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange} required>
        <option value="SOC">SOC</option>
        <option value="Employee">Employee</option>
      </select>
      {formData.role === 'Employee' && (
        <>
          <input type="text" name="idCardNumber" placeholder="ID Card Number" onChange={handleChange} required />
          <input type="file" name="photo" onChange={handleChange} required />
        </>
      )}
      {formData.role === 'SOC' && (
        <input type="text" name="businessLicense" placeholder="Business License" onChange={handleChange} required />
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterSOC;
