import React, { useState } from 'react';
import PerfilAdmin from './PerfilAdmin'; // Componente para el perfil del administrador
import AñadirGrado from './AñadirGrado'; // Componente para añadir un nuevo grado
import GestionarAsignaturas from './GestionarAsignaturas'; // Componente para gestionar asignaturas y asignar profesores
import Logout from './Logout'; 

function DashboardAdmin() {
  const [vistaActual, setVistaActual] = useState('perfil');

  const cambiarVista = (vista) => {
    setVistaActual(vista);
  };

  return (
    <div>
      <nav>
        <button onClick={() => cambiarVista('perfil')}>Ver Perfil</button>
        <button onClick={() => cambiarVista('añadirGrado')}>Añadir Grado</button>
        <button onClick={() => cambiarVista('gestionarAsignaturas')}>Gestionar Asignaturas</button>
        <Logout />
      </nav>

      {vistaActual === 'perfil' && <PerfilAdmin />}
      {vistaActual === 'añadirGrado' && <AñadirGrado />}
      {vistaActual === 'gestionarAsignaturas' && <GestionarAsignaturas />}
    </div>
  );
}

export default DashboardAdmin;
