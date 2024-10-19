import React, { useState } from 'react';
import './css/FinishCart.css';

const FinishCart = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dni: '',
    pais: '',
    direccion: '',
    ciudad: '',
    metodoPago: '',  // Nuevo campo para el método de pago
    numeroTarjeta: '',
    vencimiento: '',
    codigoSeguridad: ''
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

  if (!isOpen) return null;

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

          {/* Sección del método de pago */}
          <select name="metodoPago" value={formData.metodoPago} onChange={handleChange} required>
            <option value="">Seleccione un método de pago</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
          </select>

          {/* Mostrar mensaje o campos según el método de pago */}
          {formData.metodoPago === 'efectivo' && (
            <p>Realizar el pago antes de las 48 horas.  <br />
               Enviar comprobante al mail Matecito@gmail.com</p>
          )}

          {formData.metodoPago === 'transferencia' && (
            <p>Realizar el pago antes de las 48 horas.  <br />
               Enviar comprobante al mail Matecito@gmail.com</p>
          )}

          {formData.metodoPago === 'tarjeta' && (
            <>
              <input
                type="text"
                name="numeroTarjeta"
                placeholder="Número de tarjeta"
                value={formData.numeroTarjeta}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="vencimiento"
                placeholder="Fecha de vencimiento (MM/AA)"
                value={formData.vencimiento}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="codigoSeguridad"
                placeholder="Código de seguridad"
                value={formData.codigoSeguridad}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="submit-button">Confirmar compra</button>
        </form>
      </div>
    </div>
  );
};

export default FinishCart;
