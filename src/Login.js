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
      const response = await axios.post('http://localhost:3000/login', { email, password });
      const { token, user } = response.data;
      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));

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
          navigate('/');
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
      <form className="form" onSubmit={handleSubmit}>
        <div className="title">Bienvenido!</div>
        <div className="subtitle">Inicia sesión</div>
        <div className="input-container ic2">
          <input className="input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
          <div className="cut cut-short"></div>
          <label htmlFor="email" className="placeholder">Correo electrónico: </label>
        </div>
        <div className="input-container ic1">
          <input id="password" className="input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " required />
          <div className="cut cut-short"></div>
          <label htmlFor="password" className="placeholder">Contraseña: </label>
        </div>
        <button className="submit" type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;