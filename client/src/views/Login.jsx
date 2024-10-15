// src/Login.js
import React, { useState } from 'react';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar la autenticación
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setError('');
    console.log('Iniciar sesión con:', { email, password });
    // Aquí iría la lógica de inicio de sesión
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
        <p>
          ¿Has olvidado tu contraseña?
        </p>
        <p>
          ¿Aún no tienes cuenta? <span className="register-link">Registrarse</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
