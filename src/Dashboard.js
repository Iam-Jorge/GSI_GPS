import React, { useState, useEffect } from 'react';
import Mapa from './Mapa';
import Perfil from './Perfil';
import Historico from './Historico';

function Dashboard() {
  const [vistaActual, setVistaActual] = useState('');
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function(position) {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      }, function(error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      });
    } else {
      alert("La geolocalización no es soportada por este navegador.");
    }
  }, []);

  // Mostrar y ocultar Historico
  const toggleHistorico = () => {
    if (vistaActual === 'historico') {
      setVistaActual('');
    } else {
      setVistaActual('historico');
    }
  };

  // Mostrar y ocultar Mapa
  const toggleMapa = () => {
    if (vistaActual === 'mapa') {
      setVistaActual('');
    } else {
      setVistaActual('mapa');
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setVistaActual(vistaActual === 'perfil' ? '' : 'perfil')}>Ver Perfil</button>
        <button onClick={() => setVistaActual(vistaActual === 'mapa' ? '' : 'mapa')}>Ver Mapa Actual</button>
        <button onClick={toggleHistorico}>Ver Historial de Ubicaciones</button> {/* Botón para cambiar a HistoricoUbicaciones */}
      </nav>
      {vistaActual === 'perfil' && <Perfil />}
      {vistaActual === 'mapa' && userPosition && <Mapa position={userPosition} />}
      {vistaActual === 'historico' && <Historico />} {/* Asegúrate de pasar props necesarias si las hay */}
    </div>
  );
}

export default Dashboard;