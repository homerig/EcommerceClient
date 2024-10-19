import React, { useState, useEffect } from 'react';
import './css/ViewCart.css';
import FinishCart from './FinishCart'; // Importa el modal

const ViewCart = () => {
  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId');
  });

  useEffect(() => {
    if (userId) {
      fetchCart();
    } else {
      setError('El ID de usuario no está disponible.');
    }
  }, [userId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:4002/cart/user/${userId}`);
      if (response.ok) {
        const cart = await response.json();
        if (cart && cart.id) {
          setCartId(cart.id);
          if (cart.items && Array.isArray(cart.items)) {
            const itemsWithDetails = await Promise.all(
              cart.items.map(async (item) => {
                const productResponse = await fetch(`http://localhost:4002/products/${item.productId}`);
                if (productResponse.ok) {
                  const productData = await productResponse.json();
                  return {
                    ...item,
                    productName: productData.name,
                    productPrice: productData.price,
                    productImage: productData.image,
                  };
                } else {
                  setError('Error al obtener los detalles del producto.');
                  return item;
                }
              })
            );
            setCartItems(itemsWithDetails);
          } else {
            setError('El carrito no contiene items.');
          }
        } else {
          setError('No se encontró el carrito para el usuario.');
        }
      } else {
        setError('Error al obtener el carrito.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      console.error(err);
    }
  };

  const incrementProductQuantity = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:4002/cart/incOne?cartId=${cartId}&productId=${productId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setError('Error al incrementar la cantidad del producto.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      console.error(err);
    }
  };

  const decrementProductQuantity = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:4002/cart/decOne?cartId=${cartId}&productId=${productId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setCartItems((prevItems) => {
          const item = prevItems.find((item) => item.productId === productId);
          if (item) {
            if (item.quantity > 1) {
              return prevItems.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              );
            } else {
              removeItem(productId);
              return prevItems.filter((item) => item.productId !== productId);
            }
          }
          return prevItems;
        });
      } else {
        setError('Error al decrementar la cantidad del producto.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:4002/cart/remove-product?cartId=${cartId}&productId=${productId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
      } else {
        setError('Error al eliminar el producto del carrito.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      console.error(err);
    }
  };

  const finishCart = () => {
    openModal(); // Mostrar el modal al confirmar el carrito
  };

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {error && <p>{error}</p>}
      {cartItems.length === 0 ? (
        <p>El carrito está vacío (userId: {userId})</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.productImage} alt={item.productName} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2>{item.productName}</h2>
                  <p>Precio: ${item.productPrice}</p>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => decrementProductQuantity(item.productId)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementProductQuantity(item.productId)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Resumen de compra</h3>
            <p>Productos ({cartItems.length})</p>
            <p>Total: ${cartItems.reduce((acc, item) => acc + item.quantity * item.productPrice, 0)}</p>
            <button className="confirm-cart-button" onClick={finishCart}>Confirmar carrito</button>
          </div>
        </>
      )}

      {/* Modal FinishCart */}
      <FinishCart isOpen={isModalOpen} onClose={closeModal} cartId={cartId} />
    </div>
  );
};

export default ViewCart;
