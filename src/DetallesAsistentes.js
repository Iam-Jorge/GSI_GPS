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
        <h3 className="title">Asistentes de la Clase</h3>
        {asistentes.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {asistentes.map(asistente => (
              <li key={asistente._id} style={{ textAlign: 'center', margin: '10px auto', backgroundColor: '#202340', padding: '10px', borderRadius: '5px' }} onClick={() => handleSelectAsistente(asistente)}>
                <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                  <strong>{asistente.nombre}</strong><br />
                  {asistente.email}<br />
                  <button className="submit" style={{ marginLeft: 0 }} onClick={() => handleSelectAsistente(asistente)}>Ver ubicación</button>
                </div>
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
            backgroundColor: 'white', // Fondo blanco
            padding: '20px',
            width: '60%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h4>{selectedAsistente.nombre}</h4>
            <p>Email: {selectedAsistente.email}</p>
            {selectedAsistente.latitud && selectedAsistente.longitud ? (
              <Mapa position={[selectedAsistente.latitud, selectedAsistente.longitud]} style={{ width: '100%', height: '300px' }} />
            ) : (
              <p>No hay información de ubicación disponible para este asistente.</p>
            )}
            <button className="submit" style={{ width: '50%', height: '30px' }} onClick={() => setSelectedAsistente(null)}>Cerrar</button>
          </div>
        )}
      </div>
    );
}

export default DetallesAsistentes;
