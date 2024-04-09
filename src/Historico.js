import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Define el ícono predeterminado del Mapa
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const HistoricoUbicaciones = ({ userId }) => {
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("No hay token de autenticación disponible.");
          return;
        }
    
        const response = await axios.get('http://localhost:3000/historialUbicaciones', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        console.log('Ubicaciones cargadas:', response.data);
        setUbicaciones(response.data);
      } catch (error) {
        console.error('Error cargando las ubicaciones históricas:', error);
      }
    };

    cargarUbicaciones();
  }, []);

  return (
    <MapContainer center={[40.4168, -3.7038]} zoom={6} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {ubicaciones.map(ubicacion => (
        <Marker
          key={ubicacion._id}
          position={[ubicacion.latitude, ubicacion.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            {`Registrado el: ${new Date(ubicacion.timestamp).toLocaleString()}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default HistoricoUbicaciones;
