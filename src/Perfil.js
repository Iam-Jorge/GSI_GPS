import React, { useState, useEffect } from 'react';

function Perfil() {
  const [userData, setUserData] = useState({
    nombre: 'Cargando...', // Valor inicial mientras carga la información
    email: 'Cargando...',
    role: '' // Asegúrate de inicializar todas las propiedades que usarás
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData); // Actualizar el estado con los datos del usuario, incluido el rol
        console.log('Datos del usuario parseados:', parsedData);
      } else {
        console.log('No se encontraron datos del usuario en localStorage.');
        setUserData({
          nombre: 'Invitado',
          email: 'No especificado',
          role: 'Desconocido' // Proporciona un valor por defecto para el rol si es necesario
        });
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();
    alert('Contraseña cambiada con éxito.');
  };

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p>Nombre: {userData.nombre}</p>
      <p>Email: {userData.email}</p>
      <p>Rol: {userData.role || 'Rol no definido'}</p> {/* Manejo de casos donde el rol no está definido */}
      
      {userData.role !== 'estudiante' && (
        <div>
          <h3>Opciones avanzadas</h3>
          {/* Contenido específico del rol aquí */}
        </div>
      )}

      <form onSubmit={handleChangePassword}>
        <label>
          Nueva Contraseña:
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </label>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
}

export default Perfil;
