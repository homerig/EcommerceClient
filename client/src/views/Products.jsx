// src/Products.js
import React, { useState } from 'react';
import './css/Products.css';
import mateImg from '../assets/Mate_1.png';

const productos = [
  { nombre: 'Mate camionero clásico', precio: 30000, imagen: mateImg },
  { nombre: 'Mate Imperial clásico', precioAnterior: 29700, precio: 25000, imagen: mateImg },
  { nombre: 'Mate de Acero clásico', precio: 35000, imagen: mateImg },
  { nombre: 'Mate camionero personalizado', precio: 50000, imagen: mateImg },
  { nombre: 'Mate Imperial personalizado', precio: 55000, imagen: mateImg },
  { nombre: 'Mate de Acero personalizado', precio: 60000, imagen: mateImg },
  { nombre: 'Mate torpedo', precio: 23000, imagen: mateImg },
  { nombre: 'Mate criollo', precioAnterior: 29700, precio: 24500, imagen: mateImg },
  { nombre: 'Mate Stanley', precio: 45500, imagen: mateImg },
];

const Products = () => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

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
          <h3>Categorías:</h3>
          <label><input type="checkbox" /> Imperial</label>
          <label><input type="checkbox" /> Camionero</label>
          <label><input type="checkbox" /> Acero</label>
          <label><input type="checkbox" /> Criollo</label>
          <label><input type="checkbox" /> Stanley</label>
          <label><input type="checkbox" /> Torpedos</label>

          <h3>Color:</h3>
          <label><input type="checkbox" /> Rosa</label>
          <label><input type="checkbox" /> Blanco</label>
          <label><input type="checkbox" /> Negro</label>
          <label><input type="checkbox" /> Marrón</label>
          <label><input type="checkbox" /> Verde</label>
          <label><input type="checkbox" /> Azul</label>

          <h3>Precio:</h3>
          <input type="number" placeholder="Desde" />
          <input type="number" placeholder="Hasta" />
          <button className="aplicar-filtros">Aplicar filtros</button>
        </div>
      )}

      <div className="productos-grid">
        {productos.map((producto, index) => (
          <div key={index} className="producto-card">
            <img 
              src={producto.imagen} 
              alt={producto.nombre} 
              className="producto-imagen" 
            />
            <h2>{producto.nombre}</h2>
            {producto.precioAnterior && (
              <span className="precio-anterior">
                ${producto.precioAnterior.toLocaleString()}
              </span>
            )}
            <p className="precio">${producto.precio.toLocaleString()}</p>
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
