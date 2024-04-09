import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Intenta hacer login con email y contraseña
      const response = await axios.post('http://localhost:3000/login', { email, password });
      
      // Desestructuración para extraer token y user directamente de la respuesta
      const { token, user } = response.data;

      // Si el login es exitoso, almacenar el token y los datos del usuario en el almacenamiento local
      localStorage.setItem('token', token); // Almacenar el token
      localStorage.setItem('userData', JSON.stringify(user)); // Almacenar los datos del usuario como un string JSON

      console.log('Login exitoso:', response.data);
      console.log('Datos del usuario:', user); 
      navigate('/dashboard'); // Navegar al dashboard tras el login exitoso
    } catch (error) {
      console.error('Error de login:', error.response ? error.response.data : 'Error desconocido');
      alert('Falló el inicio de sesión');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
