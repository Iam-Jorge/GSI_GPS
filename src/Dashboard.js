import React, { useState, useEffect } from 'react';
import Mapa from './Mapa';
import Perfil from './Perfil';
import Historico from './Historico';
import RegistroActividad from './RegistroActividad';
import Logout from './Logout'; // Importa el componente Logout

function Dashboard() {
  const [vistaActual, setVistaActual] = useState('');
  const [userPosition, setUserPosition] = useState(null); // Inicializa como null

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function(position) {
          // Actualiza userPosition con las coordenadas actuales del usuario
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

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión del usuario
    console.log("Logout"); // Ejemplo de mensaje de logout en consola
  };

  return (
    <div>
      <nav>
        <button onClick={() => setVistaActual(vistaActual === 'perfil' ? '' : 'perfil')}>Ver Perfil</button>
        <button onClick={() => setVistaActual(vistaActual === 'mapa' ? '' : 'mapa')}>Ver/Cerrar Mapa Actual</button>
        <button onClick={() => setVistaActual(vistaActual === 'historico' ? '' : 'historico')}>Ver/Cerrar Historial de Ubicaciones</button>
        <button onClick={() => setVistaActual(vistaActual === 'registroActividad' ? '' : 'registroActividad')}>Registro de Actividad</button>
        <Logout onClick={handleLogout} /> {/* Agrega el botón de logout */}
      </nav>
      {vistaActual === 'perfil' && <Perfil />}
      {vistaActual === 'mapa' && userPosition && <Mapa position={userPosition} />}
      {vistaActual === 'historico' && <Historico />}
      {/* Pasa userPosition como prop a RegistroActividad */}
      {vistaActual === 'registroActividad' && <RegistroActividad userPosition={userPosition} />}
    </div>
  );
}

export default Dashboard;
