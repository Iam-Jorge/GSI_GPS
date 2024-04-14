import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'estudiante',
        securityCode: '',
    });

    useEffect(() => {
        if (formData.role === 'estudiante') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                securityCode: '',
            }));
        }
    }, [formData.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.name) {
            alert('Todos los campos son obligatorios');
            return;
        }
        try {
            const dataToSend = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role,
                ...(formData.role !== 'estudiante' && { securityCode: formData.securityCode }),
            };
    
            const response = await axios.post('http://localhost:3000/registero', dataToSend);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
    
            switch (response.data.user.role) {
                case 'estudiante':
                    navigate('/dashboard');
                    break;
                case 'profesor':
                    navigate('/dashboardprofesor');
                    break;
                case 'administrador':
                    navigate('/dashboardadmin');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error.response ? error.response.data : error.message);
            alert('Hubo un error al registrar usuario: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form">
                <div className="title">Bienvenido!</div>
                <div className="subtitle">Registrarse</div>
                <div className="input-container ic2">
                    <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                        <option value="estudiante">Estudiante</option>
                        <option value="profesor">Profesor</option>
                        <option value="administrador">Administrador</option>
                    </select>
                    <div className="cut cut-short"></div>
                    <label htmlFor="role" className="placeholder">Rol</label>
                </div>

                {formData.role !== 'estudiante' && (
                    <div className="input-container ic2">
                        <input type="password" id="securityCode" name="securityCode" className="input" value={formData.securityCode} onChange={handleChange} required/>
                        <div className="cut cut-short"></div>
                        <label htmlFor="securityCode" className="placeholder">Código de Seguridad:</label>
                    </div>
                )}

                <div className="input-container ic2">
                    <input className="input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    <div className="cut cut-short"></div>
                    <label htmlFor="email" className="placeholder">Correo electrónico:</label>
                </div>
                <div className="input-container ic2">
                    <input className="input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    <div className="cut cut-short"></div>
                    <label htmlFor="password" className="placeholder">Contraseña:</label>
                </div>
                <div className="input-container ic2">
                    <input className="input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    <div className="cut cut-short"></div>
                    <label htmlFor="name" className="placeholder">Nombre:</label>
                </div>
                <button className="submit" type="submit">Registrar</button>
            </div>
        </form>
    );
}

export default Registro;