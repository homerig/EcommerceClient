import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, incrementProductQuantity, decrementProductQuantity, removeItem ,resetCartState } from "../Redux/cartSlice";
import FinishCart from "./FinishCart";
import "./css/ViewCart.css";

const ViewCart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, cartId, loading, error } = useSelector((state) => state.cart);
  const userId = localStorage.getItem("userId");

  // Estado para controlar el modal
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.productId}>
                <img
                  src={item.productImage ? `data:image/jpeg;base64,${item.productImage}` : "/placeholder.png"}
                  alt={item.productName}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h2>{item.productName}</h2>
                  <p>Precio: ${item.productPrice}</p>
                </div>
                <div className="cart-item-quantity">
                  {item.quantity > 1 && (
                    <button onClick={() => dispatch(decrementProductQuantity({ cartId, productId: item.productId }))}>
                      -
                    </button>
                  )}
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(incrementProductQuantity({ cartId, productId: item.productId }))}>
                    +
                  </button>
                </div>
                <button className="remove-item-button" onClick={() => dispatch(removeItem({ cartId, productId: item.productId }))}>
                  🗑
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Resumen de compra</h3>
            <p>Productos ({cartItems.length})</p>
            <p>
              Total: $
              {cartItems.reduce((acc, item) => acc + item.quantity * item.productPrice, 0)}
            </p>
            <button className="confirm-cart-button" onClick={openModal}>
              Confirmar carrito
            </button>
          </div>
        </>
      )}

      {/* Modal de FinishCart: solo se renderiza si isModalOpen es true */}
      {isModalOpen && <FinishCart isOpen={isModalOpen} onClose={closeModal} cartId={cartId} />}
      
    </div>
  );
};

export default ViewCart;
