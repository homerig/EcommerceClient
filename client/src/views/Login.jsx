import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Verificar si hay una sesión iniciada al cargar la vista
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');

    if (token && storedName && storedEmail) {
      setUserName(storedName);
      setUserEmail(storedEmail);
      setUserRole(storedRole);
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
      
      const decodedToken = JSON.parse(atob(data.access_token.split('.')[1])); // Decodificar el token
      console.log('Rol del usuario:', data.role); // Agrega esto para verificar
      console.log('data',data);


      // Guardar el rol del usuario en localStorage
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name); // Suponiendo que 'sub' contiene el nombre del usuario
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', data.role); // Aquí guardamos el rol
  
      navigate('/');
    } catch (err) {
      console.error('Error al autenticar:', err);
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Limpiar la sesión
    setUserName(null); // Borrar estado del usuario
    setUserEmail(null);
    setUserRole(null);
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
          {/*<p><strong>ID:</strong> {localStorage.getItem('userId')}</p> { Mostrar el ID del usuario }*/}
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
