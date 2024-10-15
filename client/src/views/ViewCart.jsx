// src/ViewCart.jsx
import React, { useState } from 'react';
import './ViewCart.css';
import mateImg from '../assets/Mate_1.png'; // Reemplaza con la ruta correcta
import { FaTrash } from 'react-icons/fa'; // Para el ícono de la basura
import FinishCart from './FinishCart'; // Importamos el modal

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, nombre: 'Mate camionero', color: 'Rosa', cantidad: 1, precio: 25000, imagen: mateImg },
    { id: 2, nombre: 'Mate camionero', color: 'Marrón', cantidad: 2, precio: 25000, imagen: mateImg },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  const incrementItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const decrementItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalProductos = cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = cartItems.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

  const openModal = () => {
    setIsModalOpen(true); // Abrir modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cerrar modal
  };

  return (
    <div className="cart-container">
      <h1>Tu carrito</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
            <div className="cart-item-details">
              <h2>{item.nombre}</h2>
              <p>Color: {item.color}</p>
            </div>
            <div className="cart-item-quantity">
              <button onClick={() => decrementItem(item.id)}>-</button>
              <span>{item.cantidad}</span>
              <button onClick={() => incrementItem(item.id)}>+</button>
            </div>
            <p className="cart-item-price">${(item.cantidad * item.precio).toLocaleString()}</p>
            <button className="remove-item-button" onClick={() => removeItem(item.id)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Resumen de compra</h3>
        <p>Productos ({totalProductos})</p>
        <p>Total: ${totalPrecio.toLocaleString()}</p>
        <button className="confirm-cart-button" onClick={openModal}>Confirmar carrito</button>
      </div>

      {/* Modal de Confirmar Compra */}
      <FinishCart isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ViewCart;
