import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RegistroActividad() {
  const [codigoActividad, setCodigoActividad] = useState('');
  const [userId, setUserId] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserId(parsedData.id);
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
            setMensaje(response.data);
        } catch (error) {
            console.error('Error al registrar la actividad:', error);
            setMensaje('Error al registrar la actividad.');
        }
    }, (error) => {
        console.error('Error obteniendo la ubicación:', error);
        alert('Error obteniendo la ubicación: ' + error.message);
    });
  };

  return (
    <div>
      <h2>Registro de Actividad</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={codigoActividad} onChange={(e) => setCodigoActividad(e.target.value)} placeholder="Código de actividad" />
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default RegistroActividad;