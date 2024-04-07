import React, { useState, useEffect } from 'react';
import Mapa from './Mapa'; // Asegúrate de importar tu componente Mapa
import Perfil from './Perfil'; // Suponiendo que tienes un componente Perfil

function Dashboard() {
  const [vistaActual, setVistaActual] = useState(''); // Inicia sin mostrar nada o con el valor que prefieras
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

  const toggleMapa = () => {
    if (vistaActual === 'mapa') {
      setVistaActual(''); // Si el mapa ya está mostrándose, lo oculta
    } else {
      setVistaActual('mapa'); // Si el mapa no está mostrándose, lo muestra
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setVistaActual(vistaActual === 'perfil' ? '' : 'perfil')}>Ver Perfil</button>
        <button onClick={toggleMapa}>Mapa</button>
      </nav>
      {vistaActual === 'perfil' && <Perfil />}
      {vistaActual === 'mapa' && userPosition && <Mapa position={userPosition} userPosition={userPosition} />}
    </div>
  );
}

export default Dashboard;
