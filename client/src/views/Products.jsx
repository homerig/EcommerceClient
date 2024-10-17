import React, { useState, useEffect } from 'react';
import './css/Products.css';
import mateImg from '../assets/Mate_1.png';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [carrito, setCarrito] = useState(null); // Cambiado a null para poder verificar más tarde
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 1; // Cambia esto por la manera en que obtienes el userId

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Alterna el estado de showFilters
  };

  const agregarAlCarrito = async (producto) => {
    if (!producto.id) {
        console.error('El producto no tiene un ID válido:', producto);
        alert('Error: el producto no tiene un ID válido.');
        return;
    }

    try {
        // Si el carrito no existe, crear uno
        if (!carrito) {
            const response = await fetch('http://localhost:4002/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }), // Cambia esto si necesitas un formato diferente
            });

            if (!response.ok) {
                throw new Error('Error al crear el carrito');
            }

            const newCart = await response.json();
            setCarrito(newCart.id); // Guardar el ID del nuevo carrito
        }

        // Agregar el producto al carrito
        const addResponse = await fetch(`http://localhost:4002/catalogo/${carrito}/add-product`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: producto.id, // Asegúrate de que este ID sea un número
                quantity: 1, // Cambia la cantidad si es necesario
            }),
        });

        if (!addResponse.ok) {
            const errorDetails = await addResponse.json();
            throw new Error(`Error al agregar el producto al carrito: ${errorDetails.message || 'Sin detalles'}`);
        }

        alert(`${producto.name} agregado al carrito`);
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo agregar el producto al carrito: ' + error.message);
    }
};

  
  // Fetch de productos desde el backend
  useEffect(() => {
    fetch('http://localhost:4002/catalogo/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="productos-container">
      <header className="productos-header">
        <h1>Productos</h1>
        <button className="filtro-button" onClick={toggleFilters}>
          Filtrar <span>🔽</span>
        </button>
      </header>

      {/* Aquí puedes agregar la lógica para mostrar los filtros si showFilters es true */}
      {showFilters && (
        <div className="filtros-container">
          {/* Aquí van tus filtros */}
          <p>Filtros aquí...</p>
        </div>
      )}

      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <img 
              src={producto.images?.[0]?.url || mateImg} 
              alt={producto.name} 
              className="producto-imagen" 
            />
            <h2>{producto.name}</h2>
            {producto.discount && (
              <span className="precio-anterior">
                ${(producto.price * (1 + producto.discount)).toFixed(2)}
              </span>
            )}
            <p className="precio">${producto.price.toFixed(2)}</p>
            <button 
              className="agregar-carrito-btn" 
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
