import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  incrementProductQuantity,
  decrementProductQuantity,
  removeItem,
  fetchProductDetails, // Nuevo import
} from "../Redux/cartSlice";
import FinishCart from "./FinishCart";
import "./css/ViewCart.css";

const ViewCart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, cartId, loading, error } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.user?.userId);

  const [isModalOpen, setModalOpen] = useState(false);
  const [detailedCartItems, setDetailedCartItems] = useState([]);

  const syncDetailedCartItems = async (items) => {
    try {
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const productDetails = await dispatch(fetchProductDetails(item.productId));
          return productDetails.payload
            ? {
                ...item,
                productName: productDetails.payload.name,
                productPrice:
                  productDetails.payload.price * (1 - productDetails.payload.discount / 100),
                productImage:
                  productDetails.payload.images.length > 0
                    ? productDetails.payload.images[0]
                    : null,
                stock: productDetails.payload.stock,
              }
            : item; // En caso de error, devolver el item sin modificar.
        })
      );
      setDetailedCartItems(itemsWithDetails);
    } catch (error) {
      console.error("Error al sincronizar los detalles del carrito:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    syncDetailedCartItems(cartItems);
  }, [cartItems]);

  

  const handleQuantityChange = async (type, productId) => {
    const action = type === "increment" ? incrementProductQuantity : decrementProductQuantity;
    const response = await dispatch(action({ cartId, productId }));
    if (response.meta.requestStatus === "fulfilled") {
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
            <p>
              Total: $
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

      {isModalOpen && <FinishCart setModalOpen={setModalOpen} />}
    </div>
  );
};

export default ViewCart;
