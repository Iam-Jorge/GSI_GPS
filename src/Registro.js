import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Registro() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.name) {
            alert('Todos los campos son obligatorios');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/registero', formData);
            console.log(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al registrar usuario: ' + (error.response ? error.response.data : error.message));
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />

            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br />

            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} /><br />

            <button type="submit">Registrar</button>
        </form>
    );
}

export default Registro;