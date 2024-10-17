import React, { useState, useEffect } from 'react';
import './css/Products.css';
import mateImg from '../assets/Mate_1.png';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para los filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

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

  // Función para filtrar productos
  const filterProducts = () => {
    return productos.filter((producto) => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(producto.category);
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(producto.color);
      const matchesPrice = (!priceRange.min || producto.price >= priceRange.min) && (!priceRange.max || producto.price <= priceRange.max);
      return matchesCategory && matchesColor && matchesPrice;
    });
  };

  const filteredProducts = filterProducts();

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
          <div className="filtro-categorias">
            <h3>Categorías:</h3>
            <label><input type="checkbox" value="Imperial" onChange={(e) => setSelectedCategories(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(c => c !== e.target.value))} /> Imperial</label>
            <label><input type="checkbox" value="Camionero" onChange={(e) => setSelectedCategories(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(c => c !== e.target.value))} /> Camionero</label>
            <label><input type="checkbox" value="Acero" onChange={(e) => setSelectedCategories(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(c => c !== e.target.value))} /> Acero</label>
          </div>
          <div className="filtro-colores">
            <h3>Colores:</h3>
            <label><input type="checkbox" value="Rojo" onChange={(e) => setSelectedColors(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(c => c !== e.target.value))} /> Rojo</label>
            <label><input type="checkbox" value="Blanco" onChange={(e) => setSelectedColors(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(c => c !== e.target.value))} /> Blanco</label>
            <label><input type="checkbox" value="Negro" onChange={(e) => setSelectedColors(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(c => c !== e.target.value))} /> Negro</label>
          </div>
          <div className="filtro-precio">
            <h3>Precio:</h3>
            <input type="number" placeholder="Desde" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} />
            <input type="number" placeholder="Hasta" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} />
          </div>
        </div>
      )}

      <div className="productos-grid">
        {filteredProducts.map((producto) => (
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

      {/* Se eliminó la sección de paginación */}
    </div>
  );
};

export default Products;
