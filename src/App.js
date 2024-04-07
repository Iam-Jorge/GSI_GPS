import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Registro from './Registro';
import Login from './Login';
import './App.css';

function NavigationButtons() {
  let location = useLocation();

  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="button-container">
      <button className="button"><Link to="/login" className="button-link">Login</Link></button>
      <button className="button"><Link to="/registro" className="button-link">Registro</Link></button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Seguimiento de Pedidos</h1>
        <NavigationButtons />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
