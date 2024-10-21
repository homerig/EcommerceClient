import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/EditUser.css'; // Reutiliza el mismo archivo de estilos para uniformidad

const FinishCart = ({ isOpen, onClose, cartId }) => {
  const [formData, setFormData] = useState({
    dni: '',
    pais: '',
    direccion: '',
    ciudad: '',
    metodoPago: '',
    numeroTarjeta: '',
    vencimiento: '',
    codigoSeguridad: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirección

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Llamada para finalizar el carrito
      const finishCartResponse = await fetch(`http://localhost:4002/cart/${cartId}/finish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (finishCartResponse.status !== 500 && !finishCartResponse.ok) {
        throw new Error('Error al finalizar la compra');
      }
  
      if (finishCartResponse.status === 500) {
        console.warn('Se recibió un error 500 al finalizar la compra, pero se continuará con el proceso.');
      }
  
      // Llamada para vaciar el carrito
      const clearCartResponse = await fetch(`http://localhost:4002/cart/${cartId}/clear`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!clearCartResponse.ok) {
        throw new Error('Error al vaciar el carrito');
      }
  
      console.log('Compra confirmada y carrito vaciado correctamente');

      // Mostrar mensaje de éxito y redirigir a la página principal
      alert('¡Compra finalizada con éxito!');
      navigate('/'); // Redirigir a la página de inicio

      onClose(); // Cerrar el modal
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>✕</button>
        <h2>Complete sus datos</h2>
        {error && <p className="error-message">{error}</p>}
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

          <select name="metodoPago" value={formData.metodoPago} onChange={handleChange} required>
            <option value="">Seleccione un método de pago</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
          </select>

          {formData.metodoPago === 'efectivo' && (
            <p>Realizar el pago antes de las 48 horas. Enviar comprobante al mail Matecito@gmail.com</p>
          )}

          {formData.metodoPago === 'transferencia' && (
            <p>Realizar el pago antes de las 48 horas. Enviar comprobante al mail Matecito@gmail.com</p>
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

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Confirmando...' : 'Confirmar compra'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinishCart;
