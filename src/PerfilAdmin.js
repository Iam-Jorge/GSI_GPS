import React, { useState, useEffect } from 'react';

function PerfilAdmin() {
  const [userData, setUserData] = useState({
    nombre: 'Cargando...', // Valor inicial mientras carga la información
    email: 'Cargando...',
    role: '', // Inicializa todas las propiedades que usarás
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData); // Actualiza el estado con los datos del usuario, incluido el rol
        console.log('Datos del usuario parseados:', parsedData);
      } else {
        console.log('No se encontraron datos del usuario en localStorage.');
        setUserData({
          nombre: 'Invitado',
          email: 'No especificado',
          role: 'Desconocido', // Valor por defecto si es necesario
        });
      }
    } catch (error) {
      console.error("Error al analizar datos de usuario desde localStorage:", error);
    }
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Aquí podrías añadir la lógica para cambiar la contraseña, por ejemplo, haciendo una solicitud al backend
    console.log('La nueva contraseña sería:', newPassword);
    alert('Contraseña cambiada con éxito (simulado).');
    // Luego de cambiar la contraseña, podrías querer resetear el campo
    setNewPassword('');
  };

  return (
    <div>
      <h2>Perfil del Administrador</h2>
      <p>Nombre: {userData.nombre}</p>
      <p>Email: {userData.email}</p>
      <p>Rol: {userData.role || 'Rol no definido'}</p>
      
      {/* Secciones o funcionalidades específicas para administradores */}
      {userData.role === 'administrador' && (
        <div>
          <h3>Panel de Control Administrativo</h3>
          {/* Aquí puedes añadir enlaces o botones para tareas administrativas, como gestionar usuarios, ver registros, etc. */}
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

export default PerfilAdmin;
