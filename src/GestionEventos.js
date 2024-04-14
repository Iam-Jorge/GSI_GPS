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
    <div className="form">
      <h2 className="title">Gestión de Eventos</h2>
      {mensaje && <p style={{ color: 'white' }}>{mensaje}</p>}
      <form onSubmit={handleSubmit} className="input-form">
        <div className="flex-row">
          <div className="input-container ic2">
            <input type="date" name="fecha" className="input" value={nuevaClase.fecha} onChange={handleInputChange} required />
            <div className="cut cut-short"></div>
            <label htmlFor="fecha" className="placeholder">Fecha</label>
          </div>
          <div className="input-container ic2">
            <input type="time" name="horaInicio" className="input" value={nuevaClase.horaInicio} onChange={handleInputChange} required />
            <div className="cut cut-short"></div>
            <label htmlFor="horaInicio" className="placeholder">Hora de Inicio</label>
          </div>
          <div className="input-container ic2">
            <input type="time" name="horaFin" className="input" value={nuevaClase.horaFin} onChange={handleInputChange} required />
            <div className="cut cut-short"></div>
            <label htmlFor="horaFin" className="placeholder">Hora de Fin</label>
          </div>
        </div>
        <div className="flex-row">
          <div className="input-container ic2">
            <textarea name="descripcion" className="input" placeholder="Descripción (opcional)" value={nuevaClase.descripcion} onChange={handleInputChange} />
            <div className="cut cut-short"></div>
            <label htmlFor="descripcion" className="placeholder">Descripción</label>
          </div>
          <div className="input-container ic2">
            <select name="tipo" className="input" value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="clase">Clase</option>
              <option value="evento">Evento</option>
            </select>
            <div className="cut cut-short"></div>
            <label htmlFor="tipo" className="placeholder">Tipo</label>
          </div>
        </div>
        {tipo === 'clase' && (
          <div className="input-container ic2">
            <select name="asignatura" className="input" value={nuevaClase.asignatura} onChange={handleInputChange}>
              <option value="">Selecciona una asignatura</option>
              {asignaturas.map(asignatura => (
                <option key={asignatura._id} value={asignatura._id}>{asignatura.nombre}</option>
              ))}
            </select>
            <div className="cut cut-short"></div>
            <label htmlFor="asignatura" className="placeholder">Asignatura</label>
          </div>
        )}
        <button type="submit" className="submit">{tipo === 'clase' ? 'Crear Clase' : 'Crear Evento'}</button>
      </form>
    </div>
  );
}

export default GestionEventos;