import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Redux/authSlice";
import { fetchCart } from "../Redux/cartSlice";
import "./css/Register.css";
import mate from '../assets/logoisotipo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?.userId);
  const { loading, error } = useSelector((state) => state.auth);

  const [passwordError, setPasswordError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(null);


    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }


    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        navigate("/"); 
      })
      .catch((err) => {
        console.error("Error al registrar el usuario:", err);
      });
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId)); 
    }
  }, [userId, dispatch]);

  return (
    <div className="register-container">
      <div className="register-modal">
        <img src={mate} alt="Logo" className="logoisotipo" />
        <h2>Complete sus datos</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre Completo"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {passwordError && <p className="error">{passwordError}</p>}
        {error && <p className="error">Error: {error}</p>}
<br />
        <p> ¿Ya tienes una cuenta?{' '} </p>
        <button className="register-link" onClick={() => navigate('/login')}>
          Inicia Sesión
          </button>
      </div>
    </div>
  );
};

export default Register;
