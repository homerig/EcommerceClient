import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { finishCart } from "../Redux/cartSlice";
import { useParams } from "react-router-dom";
import "./css/EditUser.css";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FinishCart = ({ setModalOpen }) => {
  const { cartId } = useParams();
  const dispatch = useDispatch();

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

  const { loading, error, success } = useSelector((state) => state.cart);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(finishCart({ cartId, formData }))
      .then(() => {
        Swal.fire({
          title: "¡Compra Finalizada!",
          text: "Tu compra se realizó con éxito.",
          icon: "success",
          timer: 3000, 
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });

        setModalOpen(false);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={() => setModalOpen(false)}>
          &times;
        </button>
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
          <select
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un método de pago</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
          {formData.metodoPago === "transferencia" && (
            <>
              <h4>
                Realizar el pago antes de las 48hs. Enviar comprobante al mail
                matecito@gmail.com.
              </h4>
              <h4>CBU: 0000003100081555502173, ALIAS: matecito.mates, Matecito SA</h4>
            </>
          )}
          {formData.metodoPago === "efectivo" && (
            <>
              <h4>
                Realizar el pago antes de las 48hs en RapiPago. Enviar comprobante al
                mail matecito@gmail.com.
              </h4>
              <h4>CBU: 0000003100081555502173, ALIAS: matecito.mates, Matecito SA</h4>
            </>
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
            {loading ? "Procesando..." : "Finalizar Compra"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinishCart;

