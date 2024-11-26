import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, logout } from '../Redux/authSlice';
import { resetCartState } from "../Redux/cartSlice"; 
import { fetchCart } from "../Redux/cartSlice";
import './css/Login.css';
import mate from '../assets/logoisotipo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";

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
          <h2>Perfil de Usuario</h2>
          <div className='infoUser'>
            <p><FontAwesomeIcon icon={faUser} className="perfilIcon" /><strong>Nombre:</strong> {user.name}</p>
            <p><FontAwesomeIcon icon={faEnvelope} className="perfilIcon" /><strong>Email:</strong> {user.email}</p>
          </div>
          <br />
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-modal">
      <img src={mate} alt=" Logo" className="logoisotipo" />
        <h2>¡Bienvenido/a!</h2>
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
        <br />
        <p> ¿Aún no tienes una cuenta?{' '} </p>
        <button className="register-link" onClick={() => navigate('/register')}>
            Registrarse
          </button>
      </div>
    </div>
  );
};

export default Login;
