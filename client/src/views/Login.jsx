// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Crear instancia del hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4002/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas o problema en el servidor.');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.userId); 

      // Redirigir a la pantalla inicial después del login
      navigate('/'); // Cambia '/' a la ruta que corresponda a tu pantalla inicial

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-modal">
        <h1>¡Bienvenido/a!</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Iniciar Sesión</button>
        </form>
        <p>¿Has olvidado tu contraseña?</p>
        <p>
          ¿Aún no tienes cuenta?{' '}
          <span
            className="register-link"
            onClick={() => navigate('/register')} // Navega a la pantalla de registro
          >
            Registrarse
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
