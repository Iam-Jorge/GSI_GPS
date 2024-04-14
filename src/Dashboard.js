import React, { useState, useEffect } from 'react';
import MapaUbicacion from './MapaUbicacion';
import Perfil from './Perfil';
import Historico from './Historico';
import RegistroActividad from './RegistroActividad';
import Logout from './Logout';

function Dashboard() {
  const [userPosition, setUserPosition] = useState(null);
  const [vistaActual, setVistaActual] = useState('perfil');

  const cambiarVista = (vista) => {
    setVistaActual(vista);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function(position) {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        }, 
        function(error) {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    } else {
      alert("La geolocalización no es soportada por este navegador.");
    }
  }, []);

  return (
    <div>
      <div className="nav-container">
        <button className="nav-button" onClick={() => cambiarVista('perfil')}>Ver Perfil</button>
        <button className="nav-button" onClick={() => cambiarVista('mapa')}>Ver Mapa</button>
        <button className="nav-button" onClick={() => cambiarVista('historico')}>Historial</button>
        <button className="nav-button" onClick={() => cambiarVista('registroActividad')}>Registro de Actividad</button>
        <Logout />
      </div>
      <div className="content">
        {vistaActual === 'perfil' && <Perfil />}
        {vistaActual === 'mapa' && userPosition && <MapaUbicacion position={userPosition} />}
        {vistaActual === 'historico' && <Historico />}
        {vistaActual === 'registroActividad' && <RegistroActividad userPosition={userPosition} />}
      </div>
    </div>
  );
}

export default Dashboard;