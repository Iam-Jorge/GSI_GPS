import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GestionAsignaturas() {
    const [asignaturas, setAsignaturas] = useState([]);
    const [grados, setGrados] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [nuevaAsignatura, setNuevaAsignatura] = useState({ nombre: '', gradoId: '', profesorId: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resGrados = await axios.get('http://localhost:3000/grados');
                const resProfesores = await axios.get('http://localhost:3000/users/rol/profesor');
                const resAsignaturas = await axios.get('http://localhost:3000/asignaturas');
                setGrados(resGrados.data);
                setProfesores(resProfesores.data);
                setAsignaturas(resAsignaturas.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar los datos. Por favor, verifique que el servidor está funcionando y las rutas están correctas.');
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNuevaAsignatura(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/asignaturas', nuevaAsignatura);
          setAsignaturas([...asignaturas, response.data]);
          setNuevaAsignatura({ nombre: '', gradoId: '', profesorId: '' });
          setError('');
        } catch (error) {
          console.error('Error al añadir la asignatura:', error);
          setError('Error al añadir la asignatura. Asegúrese de que todos los campos son correctos.');
        }
      };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/asignaturas/${id}`)
            .then(() => {
                setAsignaturas(asignaturas.filter(asignatura => asignatura._id !== id));
            })
            .catch(error => console.error('Error al eliminar la asignatura:', error));
    };

    return (
        <>
            <div className="form" style={{ margin: '20px auto', width: '80%', maxWidth: '600px'}}>
                <h2 className="title">Gestión de Asignaturas</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="input-form">
                    <div className="input-container ic2">
                        <input type="text" name="nombre" value={nuevaAsignatura.nombre} onChange={handleInputChange} required className="input" />
                        <div className="cut cut-short"></div>
                        <label htmlFor="nombre" className="placeholder">Nombre de la Asignatura</label>
                    </div>
                    <div className="input-container ic2">
                        <select name="gradoId" value={nuevaAsignatura.gradoId} onChange={handleInputChange} required className="input">
                            <option value="">Seleccione un Grado</option>
                            {grados.map(grado => (
                                <option key={grado._id} value={grado._id}>{grado.nombre}</option>
                            ))}
                        </select>
                        <div className="cut cut-short"></div>
                        <label htmlFor="gradoId" className="placeholder">Grado</label>
                    </div>
                    <div className="input-container ic2">
                        <select name="profesorId" value={nuevaAsignatura.profesorId} onChange={handleInputChange} className="input">
                            <option value="">Seleccione un Profesor (Opcional)</option>
                            {profesores.map(profesor => (
                                <option key={profesor._id} value={profesor._id}>{profesor.nombre}</option>
                            ))}
                        </select>
                        <div className="cut cut-short"></div>
                        <label htmlFor="profesorId" className="placeholder">Profesor</label>
                    </div>
                    <button type="submit" className="submit">Añadir Asignatura</button>
                </form>
            </div>
            <div className="form" style={{ width: '100%', maxWidth: '600px', margin: '20px auto', minHeight: '0px' }}>
                <h3 className="list-title">Listado de Asignaturas</h3>
                <ul>
                    {asignaturas.map(asignatura => (
                        <li key={asignatura._id} className="list-item">
                            {asignatura.nombre} - {asignatura.grado?.nombre || 'N/A'} - 
                            Profesores: {asignatura.profesores?.map(p => p.nombre).join(', ') || 'Ninguno'}
                            <button className="delete-button" onClick={() => handleDelete(asignatura._id)} style={{ width: '150px'}}>Eliminar </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default GestionAsignaturas;