import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetallesAsistentes from './DetallesAsistentes';

function ClasesProfesor({ profesorId }) {
  const [clases, setClases] = useState([]);
  const [selectedClaseId, setSelectedClaseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (profesorId) {
      const fetchClases = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/clases/${profesorId}`);
          setClases(response.data);
        } catch (error) {
          console.error('Error al cargar las clases:', error);
        }
      };
      fetchClases();
    }
  }, [profesorId]);

  const handleSelectClase = (id) => {
    setSelectedClaseId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Clases Creadas por el Profesor</h2>
      <ul>
        {clases.map(clase => (
          <li key={clase._id}> {/* Usar _id que es el identificador estándar de MongoDB */}
            {clase.fecha} - {clase.horaInicio} a {clase.horaFin}
            <br/>
            Asignatura: {clase.asignatura?.nombre}
            <br/>
            Descripción: {clase.descripcion}
            <br/>
            <button onClick={() => handleSelectClase(clase._id)}>Ver Asistentes</button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <DetallesAsistentes claseId={selectedClaseId} />
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClasesProfesor;
