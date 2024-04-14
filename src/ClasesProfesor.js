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
    <div className="form" style={{ margin: '20px auto', width: '100%', maxWidth: '600px' }}>
      <h2 className="title">Clases Creadas por el Profesor</h2>
      <ul className="list-container">
        {clases.map(clase => (
          <li key={clase._id} style={{ textAlign: 'center', display: 'block' }}  className="list-item" >
            {clase.fecha} - {clase.horaInicio} a {clase.horaFin}
            <br/>
            Asignatura: {clase.asignatura?.nombre}
            <br/>
            Descripción: {clase.descripcion}
            <br/>
            <button className="submit" onClick={() => handleSelectClase(clase._id)}>Ver Asistentes</button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50
        }} onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            zIndex: 100
          }}>
            <DetallesAsistentes claseId={selectedClaseId} />
            <button className="submit" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClasesProfesor;
