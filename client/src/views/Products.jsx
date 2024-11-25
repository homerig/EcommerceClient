
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
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (selectedCategories.length > 0) {
      dispatch(filterByCategory(selectedCategories[0]));
    } else {
      dispatch(filterByPrice(priceRange));
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    dispatch(fetchProducts());
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
        <button className="filtro-button" onClick={toggleFilters}>
          Filtrar <span>🔽</span>
        </button>
        <button className="limpiar-filtros-button" onClick={clearFilters}>
          Limpiar Filtros
        </button>
      </header>

      {showFilters && (
        <form onSubmit={handleFilterSubmit}>
          <div className="filtros">
            <div className="filtro-categorias">
              <h3>Categorías:</h3>
              {categorias.map((categoria) => (
                <label key={categoria.id}>
                  <input 
                    type="checkbox" 
                    value={categoria.id} 
                    onChange={(e) => 
                      setSelectedCategories(prev => 
                        e.target.checked 
                          ? [...prev, e.target.value] 
                          : prev.filter(c => c !== e.target.value)
                      )
                    } 
                  />
                  {categoria.description}
                </label>
              ))}
            </div>
            <div className="filtro-precio">
              <h3>Precio:</h3>
              <input 
                type="number" 
                placeholder="Desde" 
                value={priceRange.min} 
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} 
              />
              <input 
                type="number" 
                placeholder="Hasta" 
                value={priceRange.max} 
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} 
              />
            </div>
            <button type="submit">Aplicar Filtros</button>
          </div>
        </form>
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