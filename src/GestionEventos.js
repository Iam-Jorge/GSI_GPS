import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GestionEventos({ profesorId }) {
  const [asignaturas, setAsignaturas] = useState([]);
  const [nuevaClase, setNuevaClase] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    descripcion: '',
    asignatura: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('clase');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAsignaturas = await axios.get('http://localhost:3000/asignaturas');
        setAsignaturas(resAsignaturas.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setMensaje('Error al cargar datos: ' + error.message);
      }
    };

    fetchData();
  }, [profesorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaClase(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let baseData = {
      fecha: nuevaClase.fecha,
      horaInicio: nuevaClase.horaInicio,
      horaFin: nuevaClase.horaFin,
      descripcion: nuevaClase.descripcion,
      profesor: profesorId
    };
  
    if (tipo === 'clase' && nuevaClase.asignatura) {
      baseData.asignatura = nuevaClase.asignatura;
    }
  
    const endpoint = tipo === 'clase' ? 'http://localhost:3000/clases' : 'http://localhost:3000/eventos';
  
    try {
      const response = await axios.post(endpoint, baseData);
      const codigo = response.data.idClase || response.data.idEvento; // Asegúrate de que la API envía esto en la respuesta
      setMensaje(`${tipo === 'clase' ? 'Clase' : 'Evento'} creado con éxito! Código: ${codigo}`);
    } catch (error) {
      console.error(`Error al crear ${tipo}:`, error);
      setMensaje(`Error al crear ${tipo}: ` + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Gestión de Eventos</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <input type="date" name="fecha" value={nuevaClase.fecha} onChange={handleInputChange} required />
        <input type="time" name="horaInicio" value={nuevaClase.horaInicio} onChange={handleInputChange} required />
        <input type="time" name="horaFin" value={nuevaClase.horaFin} onChange={handleInputChange} required />

        <select name="tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="clase">Clase</option>
          <option value="evento">Evento</option>
        </select>

        {tipo === 'clase' && (
          <select name="asignatura" value={nuevaClase.asignatura} onChange={handleInputChange}>
            <option value="">Selecciona una asignatura</option>
            {asignaturas.map(asignatura => (
              <option key={asignatura._id} value={asignatura._id}>{asignatura.nombre}</option>
            ))}
          </select>
        )}

        <textarea name="descripcion" placeholder="Descripción (opcional)" value={nuevaClase.descripcion} onChange={handleInputChange} />
        <button type="submit">{tipo === 'clase' ? 'Crear Clase' : 'Crear Evento'}</button>
      </form>
    </div>
  );
}

export default GestionEventos;
