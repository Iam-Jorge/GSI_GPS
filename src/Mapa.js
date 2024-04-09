import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define el ícono predeterminado para el Mapa
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationMarker = ({ position }) => {
  useMapEvents({
    click(e) {
      // Aquí puedes implementar la lógica para manejar el click en el mapa
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}>
      <Popup>Un pedido está aquí.</Popup>
    </Marker>
  );
};

const Mapa = ({ position }) => {
  const registrarUbicacion = async () => {
    try {
      const timestamp = new Date(); // Fecha y hora actual
      await axios.post('http://localhost:3000/registrarUbicacion', {
        latitud: position[0],
        longitud: position[1],
        timestamp: timestamp.toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Ubicación registrada con éxito');
    } catch (error) {
      console.error('Error registrando la ubicación:', error);
      alert('Error al registrar la ubicación');
    }
  };

  return (
    <>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} />
      </MapContainer>
      <button onClick={registrarUbicacion} style={{ margin: '10px' }}>
        Registrar Ubicación
      </button>
    </>
  );
};

export default Mapa;
