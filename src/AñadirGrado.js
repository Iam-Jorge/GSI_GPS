import React, { useState, useEffect } from 'react';

function AñadirGrado() {
  const [grados, setGrados] = useState([]);
  const [nombreGrado, setNombreGrado] = useState('');

  const cargarGrados = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/grados');
      if (respuesta.ok) {
        const gradosDesdeBackend = await respuesta.json();
        setGrados(gradosDesdeBackend);
      } else {
        console.error('Error al cargar los grados:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error al cargar los grados:', error);
    }
  };

  useEffect(() => {
    cargarGrados();
  }, []);

  const manejarAñadirGrado = async () => {
    if (!nombreGrado.trim()) {
      console.error('El nombre del grado es requerido');
      alert('Debe introducir un nombre');
      return;
    }
  
    try {
      const respuesta = await fetch('http://localhost:3000/grados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombreGrado }),
      });
  
      if (respuesta.ok) {
        console.log('Grado añadido con éxito');
        setNombreGrado('');
        cargarGrados();
      } else {
        console.error('Error al añadir grado:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error al añadir el grado:', error);
    }
  };

  const eliminarGrado = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/grados/${id}`, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        console.log('Grado eliminado con éxito');
        cargarGrados();
      } else {
        console.error('Error al eliminar grado');
      }
    } catch (error) {
      console.error('Error al eliminar el grado:', error);
    }
  };

  return (
    <div className="form">
      <h2 className="subtitle">Añadir Grado</h2>
      <div className="input-container ic1">
        <input
          className="input"
          type="text"
          value={nombreGrado}
          onChange={(e) => setNombreGrado(e.target.value)}
          placeholder=" "
        />
        <div className="cut cut-short"></div>
        <label className="placeholder">Nombre del nuevo grado</label>
      </div>
      <button className="submit" onClick={manejarAñadirGrado}>Añadir</button>

      <div className="list-container">
        <h3 className="list-title">Grados Existentes</h3>
        <ul>
          {grados.map((grado) => (
            <li key={grado._id} className="list-item">
              {grado.nombre}
              <button className="delete-button" onClick={() => eliminarGrado(grado._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AñadirGrado;