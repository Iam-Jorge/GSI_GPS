import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RegistroActividad() {
  const [codigoActividad, setCodigoActividad] = useState('');
  const [userId, setUserId] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserId(parsedData.id); // Asegúrate de que el ID del usuario se esté guardando correctamente en el registro/login
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!navigator.geolocation) {
        alert('Geolocalización no es soportada por este navegador.');
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
            const dataToSend = {
                codigo: codigoActividad,
                userId: userId,
                latitud: latitude,
                longitud: longitude,
                timestamp: new Date().toISOString()
            };

            const response = await axios.post('http://localhost:3000/registro-actividad', dataToSend);
            setMensaje('¡Actividad registrada con éxito! ' + response.data); // Puedes incluir una parte de la respuesta del servidor si envía un mensaje específico.
        } catch (error) {
            console.error('Error al registrar la actividad:', error);
            setMensaje('Error al registrar la actividad. ' + (error.response ? error.response.data : 'Intente nuevamente más tarde.')); // Mejora en la presentación del mensaje de error.
        }
    }, (error) => {
        console.error('Error obteniendo la ubicación:', error);
        alert('Error obteniendo la ubicación: ' + error.message);
    });
  };

  return (
    <div>
      <h2>Registro de Actividad</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-container ic1">
          <div className="input-container ic2">
            <input className="input" type="text" value={codigoActividad} onChange={(e) => setCodigoActividad(e.target.value)}  placeholder=" " required />
            <div className="cut cut-short"></div>
            <label className="placeholder">Código de Actividad: </label>
          </div>
          <button className="submit" type="submit">Registrar</button>
        </div>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default RegistroActividad;
