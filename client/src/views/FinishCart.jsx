// src/FinishCart.jsx
import React, { useState } from 'react';
import './FinishCart.css';

const FinishCart = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dni: '',
    pais: '',
    direccion: '',
    ciudad: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de la compra:', formData);
    // Aquí puedes manejar la lógica para finalizar la compra
  };

  if (!isOpen) return null; // No mostrar si el modal está cerrado

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>✕</button>
        <h2>Complete sus datos</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pais"
            placeholder="País"
            value={formData.pais}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">Confirmar compra</button>
        </form>
      </div>
    </div>
  );
};

export default FinishCart;
