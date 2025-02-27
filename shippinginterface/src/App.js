import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginSOC from './components/LoginSOC';
import Navbar from './components/Navbar';
import RegisterSOC from './components/RegisterSOC';
import SOCOrders from './components/SOCOrders';
import AdminOrders from './components/AdminOrders';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/orders" element={<SOCOrders />} />
            <Route path="/register" element={<RegisterSOC />} />
            <Route path="/login" element={<LoginSOC />} />
            <Route path="/admin-orders" element={<AdminOrders />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
