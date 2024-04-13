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
            console.log(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al registrar usuario:', error.response ? error.response.data : error.message);
            alert('Hubo un error al registrar usuario: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="role">Rol:</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="administrador">Administrador</option>
            </select><br />

            {formData.role !== 'estudiante' && (
                <>
                    <label htmlFor="securityCode">Código de Seguridad:</label>
                    <input
                        type="password"
                        id="securityCode"
                        name="securityCode"
                        value={formData.securityCode}
                        onChange={handleChange}
                        required
                    /><br />
                </>
            )}

            <label htmlFor="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />

            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br />

            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br />

            <button type="submit">Registrar</button>
        </form>
    );
}

export default Registro;
