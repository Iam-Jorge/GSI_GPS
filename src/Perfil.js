import React, { useState, useEffect } from 'react';

function Perfil() {
  const [userData, setUserData] = useState({
    nombre: 'Cargando...', // Valor inicial mientras carga la información
    email: 'Cargando...'
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Definir 'storedUserData' dentro del useEffect para asegurar su ámbito correcto
    try {
      const storedUserData = localStorage.getItem('userData'); // Aquí se define 'storedUserData'
      if (storedUserData) {
        // Solo se intenta parsear si 'storedUserData' no es undefined
        const parsedData = JSON.parse(storedUserData); // Usar 'storedUserData' correctamente dentro de su ámbito
        setUserData(parsedData); // Actualizar el estado con los datos del usuario
        console.log('Datos del usuario parseados:', parsedData);
      } else {
        console.log('No se encontraron datos del usuario en localStorage.');
        // Opcional: Establecer un estado de usuario por defecto
        setUserData({
          nombre: 'Invitado',
          email: 'No especificado'
        });
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // Manejar errores de parseo aquí
    }
  }, []);

  // Simulación de la actualización de la contraseña
  const handleChangePassword = (e) => {
    e.preventDefault();
    alert('Contraseña cambiada con éxito.');
  };


  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p>Nombre: {userData.nombre}</p>
      <p>Email: {userData.email}</p>
      
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
