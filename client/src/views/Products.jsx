import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, filterByCategory, filterByPrice, agregarAlCarrito } from "../Redux/catalogoSlice";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import './css/Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { productos, categorias, loading, error } = useSelector((state) => state.catalogo);
  
  const [selectedCategories, setSelectedCategories] = useState([]); // Solo se puede seleccionar una categoría a la vez
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    setSelectedCategories([e.target.value]); // Actualiza con la categoría seleccionada
    dispatch(filterByCategory(e.target.value)); // Filtra por categoría al seleccionar
  };

  const handlePriceChange = () => {
    // Filtra automáticamente cuando el rango de precio cambie
    if (priceRange.min || priceRange.max) {
      dispatch(filterByPrice(priceRange));
    } else {
      dispatch(fetchProducts()); // Si no hay rango de precio, resetear a todos los productos
    }
  };

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => {
      const newPriceRange = { ...prev, [name]: value };
      // Aplica el filtro automáticamente al escribir el precio
      dispatch(filterByPrice(newPriceRange));
      return newPriceRange;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    dispatch(fetchProducts()); // Resetear filtros y cargar todos los productos
  };

  const navigate = useNavigate(); 

  const handleAddToCart = (producto) => {
    if (!auth?.user?.access_token) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      navigate("/Login"); 
      return;
    }
    dispatch(agregarAlCarrito(producto));
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="productos-container">
      <header className="productos-header">
        <h1>Productos</h1>
        <button className="filtro-button" onClick={() => setShowFilters(!showFilters)}>
          Filtrar <span>🔽</span>
        </button>
        <button className="limpiar-filtros-button" onClick={clearFilters}>
          Limpiar Filtros
        </button>
      </header>
  
      {showFilters && (
        <div className="filtros-container">
          <div className="filtros-flex">
            <div className="filtro-categorias">
              <h3>Categorías:</h3>
              {categorias.map((categoria) => (
                <label key={categoria.id}>
                  <input
                    type="radio"
                    name="categoria"
                    value={categoria.id}
                    checked={selectedCategories[0] === categoria.id.toString()}
                    onChange={handleCategoryChange}
                  />
                  {categoria.description}
                </label>
              ))}
            </div>
  
            <div className="filtro-precio">
              <h3>Precio:</h3>
              <input
                type="number"
                name="min"
                placeholder="Desde"
                value={priceRange.min}
                onChange={handlePriceInputChange} // Aplica el filtro mientras escribe
              />
              <input
                type="number"
                name="max"
                placeholder="Hasta"
                value={priceRange.max}
                onChange={handlePriceInputChange} // Aplica el filtro mientras escribe
              />
            </div>
          </div>
        </div>
      )}
  
      <div className="productos-grid">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id}>
            <Link to={`/ViewProduct/${producto.id}`} className="product-link">
              <img 
                src={producto.images && producto.images.length > 0 ? `data:image/jpeg;base64,${producto.images[0]}` : 'ruta-por-defecto.jpg'}  
                alt={producto.name}
                className="producto-imagen" 
              />
              <h2>{producto.name}</h2>
              {producto.discount > 0 && (
                <span className="precio-anterior">
                  ${producto.price.toFixed(2)}
                </span>
              )}
              <p className="precio">
                ${producto.discount > 0 
                  ? (producto.price * (1 - producto.discount / 100)).toFixed(2) 
                  : producto.price.toFixed(2)}
              </p>
            </Link>
            <button 
              className="agregar-carrito-btn" 
              onClick={() => handleAddToCart(producto)}
              disabled={producto.stock === 0} 
            >
              {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default Products;
