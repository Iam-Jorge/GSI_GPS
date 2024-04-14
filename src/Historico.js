import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Correctly configure the default icon
const defaultIcon = new L.Icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41]  // Size of the shadow
});

const HistoricoUbicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const parsedData = userData ? JSON.parse(userData) : null;
    if (parsedData) {
      setUserId(parsedData.id); // Assumes 'id' is stored correctly in the userData
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUbicaciones = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/historialUbicaciones/${userId}`);
          setUbicaciones(response.data);
        } catch (error) {
          console.error('Error al cargar las ubicaciones históricas:', error);
        }
      };

      fetchUbicaciones();
    }
  }, [userId]);

  return (
    <MapContainer center={[40.4168, -3.7038]} zoom={10} style={{ height: '400px', width: '800px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {ubicaciones.map((ubicacion, index) => (
        <Marker
          key={index}
          position={[ubicacion.latitude, ubicacion.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            Registrado el: {new Date(ubicacion.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default HistoricoUbicaciones;
