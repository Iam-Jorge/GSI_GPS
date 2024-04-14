import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <button className="nav-button" onClick={handleLogout}>Cerrar Sesión</button>
  );
}

export default Logout;