import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MapaUbicacion = () => {
  const [position, setPosition] = useState(null);

  const registrarUbicacion = async () => {
    alert('Ubicación registrada');
    if (!position) {
      alert('No se ha detectado una ubicación válida.');
      return;
    }

    try {
      const timestamp = new Date();
      const dataToSend = {
        latitud: position[0],
        longitud: position[1],
        timestamp: timestamp.toISOString()
      };

      const response = await axios.post('http://localhost:3000/registrarUbicacion', dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("Respuesta del servidor:", response.data);  // Log de la respuesta del servidor
      alert('Ubicación registrada con éxito: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Error registrando la ubicación:', error);
      alert('Error al registrar la ubicación: ' + (error.response ? error.response.data : error.message));
    }
  };

  const obtenerUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Ubicación actual obtenida:', position.coords);
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          alert('No se pudo obtener la ubicación: ' + error.message);
        }
      );
    } else {
      alert("La geolocalización no es soportada por este navegador.");
    }
  };

  return (
    <div>
      <button className="submit" onClick={obtenerUbicacionActual} style={{ margin: '10px', padding: '10px' }}>
        Obtener Ubicación Actual
      </button>
      {position && (
        <div>
          <MapContainer center={position} zoom={13} style={{ height: '400px', width: '800px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>Ubicación Actual.</Popup>
            </Marker>
          </MapContainer>
          <button className="submit" onClick={registrarUbicacion} style={{ margin: '10px', padding: '10px' }}>
            Registrar Ubicación
          </button>
        </div>
      )}
    </div>
  );
};

export default MapaUbicacion;