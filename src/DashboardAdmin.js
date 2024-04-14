import React, { useState } from 'react';
import PerfilAdmin from './PerfilAdmin';
import AñadirGrado from './AñadirGrado';
import GestionarAsignaturas from './GestionarAsignaturas';
import Logout from './Logout'; 

function DashboardAdmin() {
  const [vistaActual, setVistaActual] = useState('perfil');

  const cambiarVista = (vista) => {
    setVistaActual(vista);
  };

  return (
    <div>
      <div className="nav-container">
        <button className="nav-button" onClick={() => cambiarVista('perfil')}>Ver Perfil</button>
        <button className="nav-button" onClick={() => cambiarVista('añadirGrado')}>Añadir Grado</button>
        <button className="nav-button" onClick={() => cambiarVista('gestionarAsignaturas')}>Gestionar Asignaturas</button>
        <Logout />
      </div>
      <div className="content">
        {vistaActual === 'perfil' && <PerfilAdmin />}
        {vistaActual === 'añadirGrado' && <AñadirGrado />}
        {vistaActual === 'gestionarAsignaturas' && <GestionarAsignaturas />}
      </div>
    </div>
  );
}

export default DashboardAdmin;