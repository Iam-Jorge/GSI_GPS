import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PerfilProfesor() {
  const [userData, setUserData] = useState({
    nombre: 'Cargando...',
    email: 'Cargando...',
    role: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');  // Correctly initialized
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } else {
        setUserData({
          nombre: 'Invitado',
          email: 'No especificado',
          role: 'Desconocido'
        });
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage('Por favor, ingrese ambas contraseñas.');
      return;
    }
    try {
      await axios.post('http://localhost:3000/change-password', {
        email: userData.email,
        currentPassword,
        newPassword
      });
      setMessage('Contraseña actualizada con éxito.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      const errorMsg = error.response ? error.response.data : 'Error desconocido';
      setMessage(`Error al cambiar la contraseña: ${errorMsg}`);
    }
  };

  return (
    <div className="form">
      <h2 className="title">Perfil del Profesor</h2>
      <div className="subtitle">Nombre: {userData.nombre}</div>
      <div className="subtitle">Correo electrónico: {userData.email}</div>

      <form onSubmit={handleChangePassword}>
        <div className="input-container ic1">
          <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder=" " required />
          <div className="cut cut-short"></div>
          <label className="placeholder">Contraseña Actual:</label>
        </div>
        <div className="input-container ic2">
          <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder=" " required />
          <div className="cut cut-short"></div>
          <label className="placeholder">Nueva Contraseña:</label>
        </div>
        <button className="submit" type="submit">Cambiar Contraseña</button>
      </form>
      {message && <div className="subtitle">{message}</div>}
    </div>
  );
}

export default PerfilProfesor;
