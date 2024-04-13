import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mapa from './Mapa';

function DetallesAsistentes({ claseId }) {
    const [asistentes, setAsistentes] = useState([]);
    const [selectedAsistente, setSelectedAsistente] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      const fetchAsistentes = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:3000/clases/${claseId}/estudiantes`);
          setAsistentes(response.data);
        } catch (error) {
          console.error('Error al cargar los asistentes:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchAsistentes();
    }, [claseId]);
  
    const handleSelectAsistente = (asistente) => {
      if (asistente.locationHistory && asistente.locationHistory.length > 0) {
        const lastLocation = asistente.locationHistory[asistente.locationHistory.length - 1];
        setSelectedAsistente({
          ...asistente,
          latitud: lastLocation.latitude,
          longitud: lastLocation.longitude
        });
      } else {
        setSelectedAsistente({
          ...asistente,
          latitud: null,
          longitud: null
        });
      }
    };
  
    if (isLoading) return <p>Cargando asistentes...</p>;
  
    return (
      <div>
        <h3>Asistentes de la Clase</h3>
        {asistentes.length > 0 ? (
          <ul>
            {asistentes.map(asistente => (
              <li key={asistente._id} onClick={() => handleSelectAsistente(asistente)}>
                {asistente.nombre} ({asistente.email})
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay asistentes registrados para esta clase.</p>
        )}
        {selectedAsistente && (
          <div className="modal" style={{
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 100, 
            backgroundColor: 'white', 
            padding: '20px',
            width: '60%', // Ajusta según necesidad
            maxHeight: '80vh', 
            overflow: 'auto', // Si el contenido es mucho, permitirá scroll
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h4>{selectedAsistente.nombre}</h4>
            <p>Email: {selectedAsistente.email}</p>
            {selectedAsistente.latitud && selectedAsistente.longitud ? (
              <Mapa position={[selectedAsistente.latitud, selectedAsistente.longitud]} style={{ width: '100%', height: '300px' }} />
            ) : (
              <p>No hay información de ubicación disponible para este asistente.</p>
            )}
            <button onClick={() => setSelectedAsistente(null)}>Cerrar</button>
          </div>
        )}
      </div>
    );
  }
  
  export default DetallesAsistentes;
  
