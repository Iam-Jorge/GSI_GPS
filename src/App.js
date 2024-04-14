import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';  // Dashboard para estudiantes
import DashboardProfesor from './DashboardProfesor';  // Asegúrate de que este componente esté creado
import DashboardAdmin from './DashboardAdmin';  // Asegúrate de que este componente esté creado
import Registro from './Registro';
import Login from './Login';
import './App.css';

function NavigationButtons() {
  let location = useLocation();
  const isAuthenticated = localStorage.getItem('token');
  if (['/dashboard', '/dashboardprofesor', '/dashboardadmin'].includes(location.pathname) || isAuthenticated) {
    return null;
  }

  return (
    <div className="button-container">
      <button className="button"><Link to="/login">Login</Link></button>
      <button className="button"><Link to="/registro">Registro</Link></button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Asistencia</h1>
        <NavigationButtons />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboardprofesor" element={<DashboardProfesor />} />
          <Route path="/dashboardadmin" element={<DashboardAdmin />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
