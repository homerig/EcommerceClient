import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, incrementProductQuantity, decrementProductQuantity, removeItem } from "../Redux/cartSlice";
import FinishCart from "./FinishCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./css/ViewCart.css";
 
const ViewCart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, cartId, loading, error } = useSelector((state) => state.cart);
  const userId = localStorage.getItem("userId");
 
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);
 
  const handleIncrement = (productId) => {
    dispatch(incrementProductQuantity({ cartId, productId }));
  };
 
  const handleDecrement = (productId) => {
    dispatch(decrementProductQuantity({ cartId, productId }));
  };
 
  const handleRemove = (productId) => {
    dispatch(removeItem({ cartId, productId }));
  };
 
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
                <img src={`data:image/jpeg;base64,${item.productImage}`} alt={item.productName} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2>{item.productName}</h2>
                  <p>Precio: ${item.productPrice}</p>
                </div>
                <div className="cart-item-quantity">
                {item.quantity > 0 && (
                    <button onClick={() => handleDecrement(item.productId)}>-</button>
                  )}
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item.productId)}>+</button>
                </div>
                <button className="remove-item-button" onClick={() => handleRemove(item.productId)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Resumen de compra</h3>
            <p>Productos ({cartItems.length})</p>
            <p>Total: ${cartItems.reduce((acc, item) => acc + item.quantity * item.productPrice, 0)}</p>
            <button className="confirm-cart-button">Confirmar carrito</button>
          </div>
        </>
      )}
      <FinishCart />
    </div>
  );
};
 
export default ViewCart;