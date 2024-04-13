import React, { useState, useEffect } from 'react';
import './AñadirGrado.css'; // Importa tu archivo de estilos CSS

function AñadirGrado() {
  const [grados, setGrados] = useState([]); // Para almacenar los grados existentes
  const [nombreGrado, setNombreGrado] = useState(''); // Para el input de nuevo grado

  // Función para cargar grados existentes desde el backend
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
        cargarGrados(); // Recargar grados
      } else {
        console.error('Error al añadir grado');
      }
    } catch (error) {
      console.error('Error al añadir el grado:', error);
    }
  };

  return (
    <div className="añadir-grado-container">
      <h2>Añadir Grado</h2>
      <input
        type="text"
        value={nombreGrado}
        onChange={(e) => setNombreGrado(e.target.value)}
        placeholder="Nombre del nuevo grado"
      />
      <button onClick={manejarAñadirGrado}>Añadir</button>

      <div className="grados-existentes-container">
        <h3>Grados Existentes</h3>
        <ul>
          {grados.map((grado) => (
            <li key={grado._id}>
              {grado.nombre}
              {/* Puedes añadir botones o acciones para editar o eliminar grados aquí */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AñadirGrado;
