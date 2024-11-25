import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  incrementProductQuantity,
  decrementProductQuantity,
  removeItem,
} from "../Redux/cartSlice";
import FinishCart from "./FinishCart";
import "./css/ViewCart.css";
import axios from "axios";

const ViewCart = () => {
  const dispatch = useDispatch();

  // Estado global
  const { items: cartItems, cartId, loading, error } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.user?.userId);

  // Estado local
  const [isModalOpen, setModalOpen] = useState(false);
  const [detailedCartItems, setDetailedCartItems] = useState([]);

  // Función para sincronizar los detalles de los productos
  const syncDetailedCartItems = async (items) => {
    try {
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await axios.get(`http://localhost:4002/products/${item.productId}`);
            const product = response.data;
            return {
              ...item,
              productName: product.name,
              productPrice: product.price * (1 - product.discount / 100),
              productImage: product.images.length > 0 ? product.images[0] : null,
              stock: product.stock,
            };
          } catch (error) {
            console.error(`Error al obtener detalles del producto ${item.productId}:`, error);
            return item; // Devuelve el item sin detalles en caso de error
          }
        })
      );
      setDetailedCartItems(itemsWithDetails);
    } catch (error) {
      console.error("Error al sincronizar los detalles del carrito:", error);
    }
  };

  // Cargar carrito y sincronizar detalles al iniciar
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId)); // Obtener carrito desde Redux
    }
  }, [userId, dispatch]);

  useEffect(() => {
    syncDetailedCartItems(cartItems); // Sincronizar detalles cada vez que cambie `cartItems`
  }, [cartItems]);

  // Manejo de cantidad (incrementar o decrementar)
  const handleQuantityChange = async (type, productId) => {
    const action = type === "increment" ? incrementProductQuantity : decrementProductQuantity;

    // Actualizar cantidad en Redux
    const response = await dispatch(action({ cartId, productId }));
    if (response.meta.requestStatus === "fulfilled") {
      // Actualizar el estado local
      setDetailedCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: response.payload.updatedProduct.quantity }
            : item
        )
      );
    } else {
      console.error(response.payload || "Error al actualizar la cantidad.");
    }
  };

  const handleRemoveItem = async (productId) => {
    const response = await dispatch(removeItem({ cartId, productId }));
    if (response.meta.requestStatus === "fulfilled") {
      // Remover del estado local
      setDetailedCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    } else {
      console.error(response.payload || "Error al eliminar el producto.");
    }
  };

  if (loading) return <p>Cargando carrito...</p>;

  if (error) {
    return <p>Error: {error.message || "Ocurrió un error inesperado."}</p>;
  }

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {detailedCartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <div className="cart-items">
            {detailedCartItems.map((item) => (
              <div className="cart-item" key={item.productId}>
                <img
                  src={item.productImage ? `data:image/jpeg;base64,${item.productImage}` : "/placeholder.png"}
                  alt={item.productName}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h2>{item.productName}</h2>
                  <p>Precio: ${item.productPrice}</p>
                  <p>Subtotal: ${(item.quantity * item.productPrice).toFixed(2)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleQuantityChange("decrement", item.productId)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increment", item.productId)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-item-button"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Resumen de Compra</h3>
            <p>Total: $
              {detailedCartItems
                .reduce((acc, item) => acc + item.quantity * item.productPrice, 0)
                .toFixed(2)}
            </p>
            <button className="confirm-cart-button" onClick={() => setModalOpen(true)}>
              Confirmar Carrito
            </button>
          </div>
        </>
      )}

      {/* Modal para finalizar carrito */}
      {isModalOpen && <FinishCart isOpen={isModalOpen} onClose={() => setModalOpen(false)} cartId={cartId} />}
    </div>
  );
};

export default ViewCart;
