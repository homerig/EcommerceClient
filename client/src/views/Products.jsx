import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, filterByCategory, filterByPrice, agregarAlCarrito } from "../Redux/catalogoSlice";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import './css/Products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import loader from '../assets/gifLoader.gif';

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

  const handleCategoryChange = (e) => {
    setSelectedCategories([e.target.value]); 
    dispatch(filterByCategory(e.target.value)); 
  };

  const handlePriceChange = () => {
    if (priceRange.min || priceRange.max) {
      dispatch(filterByPrice(priceRange));
    } else {
      dispatch(fetchProducts()); 
    }
  };

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => {
      const newPriceRange = { ...prev, [name]: value };
      dispatch(filterByPrice(newPriceRange));
      return newPriceRange;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    dispatch(fetchProducts()); 
  };

  const navigate = useNavigate(); 

  const handleAddToCart = async (producto) => {
    if (!auth?.user?.access_token) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe iniciar sesión para agregar un producto al carrito',
      });
      navigate("/Login");
      return;
    }
    const resultAction = await dispatch(agregarAlCarrito(producto));
    if (agregarAlCarrito.fulfilled.match(resultAction)) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Producto agregado al carrito',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else if (agregarAlCarrito.rejected.match(resultAction)) {
      const warningMessage = resultAction.payload?.warning || "No se pudo agregar el producto al carrito.";
      alert(warningMessage); 
    }
  };
  
  
  

  if (loading) return  (<div className="productos-container">
    <header className="productos-header">
      <h1>Productos</h1>
      <button className="filtro-button">
        Filtrar <FontAwesomeIcon icon={faFilter} />
      </button>
    </header>
    <div className="containerLoaderProducts"><img src={loader} alt="Cargando.." className="loader" /><p> Cargando productos...</p></div>;
    </div>);
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="productos-container">
      <header className="productos-header">
        <h1>Productos</h1>
        <button className="filtro-button" onClick={() => setShowFilters(!showFilters)}>
          Filtrar <FontAwesomeIcon icon={faFilter} />
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
                onChange={handlePriceInputChange} 
              />
              <input
                type="number"
                name="max"
                placeholder="Hasta"
                value={priceRange.max}
                onChange={handlePriceInputChange} 
              />
            </div>
          </div>
          <button className="limpiar-filtros-button" onClick={clearFilters}>
          Limpiar Filtros
        </button>
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
