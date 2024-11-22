import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, logout } from '../Redux/LoginSlice';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, role } = useSelector((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (user) {
    return (
      <div className="login-container">
        <div className="login-modal">
          <h1>Perfil de Usuario</h1>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
    );
  }

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
          {loading && <p>Cargando...</p>}
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
