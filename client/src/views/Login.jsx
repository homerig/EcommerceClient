import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, logout } from '../Redux/authSlice';
import { resetCartState } from "../Redux/cartSlice"; 
import { fetchCart } from "../Redux/cartSlice";
import './css/Login.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, role } = useSelector((state) => state.auth);
  const { items: cartItems, cartId } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.user?.userId);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCartState());
    navigate('/login');
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId)); 
    }
  }, [userId, dispatch]);
  
  if (user) {
    return (
      <div className="login-container">
        <div className="login-modal">
          <h1>Perfil de Usuario</h1>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
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
