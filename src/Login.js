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

      // Limpia el almacenamiento local antes de guardar nuevos datos
      localStorage.clear();

      // Si el login es exitoso, almacenar el token y los datos del usuario en el almacenamiento local
      localStorage.setItem('token', token); // Almacenar el token
      localStorage.setItem('userData', JSON.stringify(user)); // Almacenar los datos del usuario como un string JSON

      console.log('Login exitoso:', response.data);
      console.log('Datos del usuario:', user); 

      // Redirige al usuario basado en su rol
      switch (user.role) {
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
          navigate('/'); // Redirige a la página principal o de error si el rol no es reconocido
          break;
      }
      
    } catch (error) {
      const errorMsg = error.response ? error.response.data : 'Error desconocido';
      console.error('Error de login:', errorMsg);
      alert(`Falló el inicio de sesión: ${errorMsg}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
