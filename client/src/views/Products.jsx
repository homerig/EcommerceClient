// src/Products.js
import React, { useState, useEffect } from 'react';
import './css/Products.css';
import mateImg from '../assets/Mate_1.png'; // Esta imagen puede ser un placeholder

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleFilters = () => setShowFilters(!showFilters);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
    alert(`${producto.name} agregado al carrito`);
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

      {showFilters && (
        <div className="filtros">
          {/* Filtros de ejemplo */}
          <h3>Categorías:</h3>
          <label><input type="checkbox" /> Imperial</label>
          <label><input type="checkbox" /> Camionero</label>
          <label><input type="checkbox" /> Acero</label>
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

      <footer className="paginacion">
        {[1, 2, 3, 4, 5].map((num) => (
          <button key={num} className="paginacion-boton">
            {num}
          </button>
        ))}
      </footer>
    </div>
  );
};

export default Products;
