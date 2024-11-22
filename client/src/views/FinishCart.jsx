import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { finishCart, resetState } from "../Redux/finishCartSlice";
import { useNavigate, useParams } from "react-router-dom";
import "./css/EditUser.css";

const FinishCart = () => {
  const { cartId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dni: "",
    pais: "",
    direccion: "",
    ciudad: "",
    metodoPago: "",
    numeroTarjeta: "",
    vencimiento: "",
    codigoSeguridad: "",
  });

  const { loading, error, success } = useSelector((state) => state.finishCart);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(finishCart({ cartId, formData }));
  };

  if (success) {
    alert("¡Compra finalizada con éxito!");
    dispatch(resetState());
    navigate("/");
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
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

          {formData.metodoPago === "efectivo" && (
            <p>Realizar el pago antes de las 48 horas. Enviar comprobante al mail Matecito@gmail.com</p>
          )}

          {formData.metodoPago === "transferencia" && (
            <p>Realizar el pago antes de las 48 horas. Enviar comprobante al mail Matecito@gmail.com</p>
          )}

          {formData.metodoPago === "tarjeta" && (
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
            {loading ? "Confirmando..." : "Confirmar compra"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinishCart;
