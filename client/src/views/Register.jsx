import React, { useState } from 'react';
import './css/Register.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LogoMatecito.png';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    console.log('Registro exitoso:', formData);
    
    // Redirigir a la página de inicio después de un registro exitoso
    navigate('/home');
  };

  return (
    <div className="register-container">
      <div className="register-modal">
      <Link to="/" className="logo-link">
          <img src={logo} alt="Matecito Logo" className="logo" />
        </Link>
        <h1>Complete sus datos</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Nombre Completo"
            value={formData.fullName}
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
          {error && <p className="error">{error}</p>}
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
