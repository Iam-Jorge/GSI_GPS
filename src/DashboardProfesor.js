import React, { useState } from 'react';
import PerfilProfesor from './PerfilProfesor';
import GestionEventos from './GestionEventos';
import ClasesProfesor from './ClasesProfesor';
import Logout from './Logout';

function DashboardProfesor() {
    const [vistaActual, setVistaActual] = useState('perfil');

    // Obtener el ID del profesor desde el almacenamiento local
    const userData = localStorage.getItem('userData');
    const profesorId = userData ? JSON.parse(userData).id : null;

    const cambiarVista = (vista) => {
        setVistaActual(vista);
    };

    return (
        <div>
            <nav>
                <button onClick={() => cambiarVista('perfil')}>Ver Perfil</button>
                <button onClick={() => cambiarVista('gestionarEventos')}>Gestión de eventos</button>
                <button onClick={() => cambiarVista('clasesProfesor')}>Ver Clases</button> {/* Nuevo botón para cambiar a la vista de ClasesProfesor */}
                <Logout />
            </nav>

            {vistaActual === 'perfil' && <PerfilProfesor />}
            {vistaActual === 'gestionarEventos' && <GestionEventos profesorId={profesorId} />}
            {vistaActual === 'clasesProfesor' && <ClasesProfesor profesorId={profesorId} />} {/* Añade la vista para el componente ClasesProfesor */}
        </div>
    );
}

export default DashboardProfesor;
