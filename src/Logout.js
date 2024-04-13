// Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpia el almacenamiento local, eliminando el token y otros datos de usuario
    localStorage.clear();
    // Redirige al usuario a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  );
}

export default Logout;
