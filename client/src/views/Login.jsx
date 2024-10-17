import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState(null); // Guardar nombre del usuario
  const [userEmail, setUserEmail] = useState(null); // Guardar email del usuario
  const navigate = useNavigate();

  // Verificar si hay una sesión iniciada al cargar la vista
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('authToken');

    if (token && storedName && storedEmail) {
      setUserName(storedName);
      setUserEmail(storedEmail);
    }
  }, []);

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

      // Guardar datos del usuario en localStorage
      localStorage.setItem('authToken', data.accessToken); 
      localStorage.setItem('userName', data.name); // Asegúrate de que 'data.name' existe
      localStorage.setItem('userEmail', data.email); // Asegúrate de que 'data.email' existe
      localStorage.setItem('userId', data.id);

      // Actualizar estado con los datos del usuario
      setUserName(data.name); 
      setUserEmail(data.email); 

      navigate('/'); // Redirigir a la pantalla principal
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Limpiar la sesión
    setUserName(null); // Borrar estado del usuario
    setUserEmail(null);
    navigate('/login'); // Redirigir al Login
  };

  // Mostrar perfil si ya hay sesión activa
  if (userName && userEmail) {
    return (
      <div className="login-container">
        <div className="login-modal">
          <h1>Perfil de Usuario</h1>
          <p><strong>Nombre:</strong> {userName}</p>
          <p><strong>Email:</strong> {userEmail}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
    );
  }

  // Mostrar formulario de login si no hay sesión activa
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
          <span className="register-link" onClick={() => navigate('/register')}>
            Registrarse
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
