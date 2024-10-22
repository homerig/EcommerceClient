import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './css/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null); 
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPasswordError(null);

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    fetch('http://localhost:4002/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }
      return response.json();
    })
    .then((data) => {
      const decodedToken = JSON.parse(atob(data.access_token.split('.')[1]));
      
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', decodedToken.sub); 
      localStorage.setItem('userEmail', formData.email);

      navigate('/');

    })
    .catch((error) => {
      setError(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  

  return (
    <div className="register-container">
      <div className="register-modal">
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
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {passwordError && <p className="error">{passwordError}</p>}
        {error && <p className="error">Error: {error}</p>}
        {success && <p className="success">¡Usuario registrado exitosamente!</p>}
      </div>
    </div>
  );
};

export default Register;
