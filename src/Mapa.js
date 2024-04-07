import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define el ícono predeterminado
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41], // Tamaño del ícono
  iconAnchor: [12, 41], // Punto del ícono que corresponderá a la ubicación del marcador
  popupAnchor: [1, -34], // Punto desde el cual se mostrará el popup en relación al iconAnchor
  shadowSize: [41, 41] // Tamaño de la sombra
});


const Mapa = ({ position }) => {
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={defaultIcon}>
        <Popup>
          Un pedido está aquí.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Mapa;
