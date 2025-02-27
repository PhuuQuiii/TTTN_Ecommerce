import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
