import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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
      
      // Si el login es exitoso, almacenar el token en el almacenamiento local
      localStorage.setItem('token', response.data.token);  // Asumiendo que el servidor envía un objeto con un campo 'token'
      
      console.log('Login exitoso:', response.data);
      navigate('/dashboard'); // Navega al dashboard
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
