import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import Dashboard from './Dashboard';
import Registro from './Registro';
import Login from './Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Seguimiento de Pedidos</h1>
        <div className="button-container">
          <button className="button"><Link to="/login" className="button-link">Login</Link></button>
          <button className="button"><Link to="/registro" className="button-link">Registro</Link></button>
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          {/* Asegúrate de que el usuario esté logueado para acceder al Dashboard. Si no, reemplaza la siguiente línea según tu lógica de autenticación */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Redirige a Login como ruta por defecto */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
