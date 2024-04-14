import React, { useState } from 'react';
import PerfilProfesor from './PerfilProfesor';
import GestionEventos from './GestionEventos';
import ClasesProfesor from './ClasesProfesor';
import Logout from './Logout';

function DashboardProfesor() {
    const [vistaActual, setVistaActual] = useState('perfil');

    const userData = localStorage.getItem('userData');
    const profesorId = userData ? JSON.parse(userData).id : null;

    const cambiarVista = (vista) => {
        setVistaActual(vista);
    };

    return (
        <div>
            <div className="nav-container">
                <button className="nav-button" onClick={() => cambiarVista('perfil')}>Ver Perfil</button>
                <button className="nav-button" onClick={() => cambiarVista('gestionarEventos')}>Gestión de eventos</button>
                <button className="nav-button" onClick={() => cambiarVista('clasesProfesor')}>Ver Clases</button> {}
                <Logout />
            </div>
            <div className="content">
                {vistaActual === 'perfil' && <PerfilProfesor />}
                {vistaActual === 'gestionarEventos' && <GestionEventos profesorId={profesorId} />}
                {vistaActual === 'clasesProfesor' && <ClasesProfesor profesorId={profesorId} />} {}
            </div>
        </div>
    );
}

export default DashboardProfesor;