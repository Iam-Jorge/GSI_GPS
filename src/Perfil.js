import React, { useState } from 'react';

function Perfil() {
  const [userData, setUserData] = useState({
    nombre: 'Nombre del Usuario',
    email: 'email@ejemplo.com',
  });
  const [newPassword, setNewPassword] = useState('');

  // Simulación de la actualización de la contraseña
  const handleChangePassword = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para cambiar la contraseña, por ejemplo, una llamada a una API.
    alert('Contraseña cambiada con éxito.');
  };

  // Funcionalidad para manejar la subida de la foto de perfil
  const handleProfilePictureUpload = (e) => {
    // Aquí se manejaría la subida de la imagen, por ejemplo, almacenándola en el estado y luego subiéndola a un servidor o servicio de almacenamiento en la nube.
    alert('Foto de perfil actualizada.');
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
