
//
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, filterByCategory, filterByPrice, agregarAlCarrito } from "../Redux/catalogoSlice";
import { Link } from 'react-router-dom';
import './css/Products.css';
<<<<<<< HEAD

const Products = () => {
  const dispatch = useDispatch();
  const { productos, categorias, loading, error } = useSelector((state) => state.catalogo);
  
=======
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from '../Redux/productosSlice';
import { fetchCategories } from "../Redux/categoriesSlice";


const Products = () => {
  const [showFilters, setShowFilters] = useState(false);
>>>>>>> main
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleFilters = () => setShowFilters(!showFilters);

<<<<<<< HEAD
=======
  const dispatch = useDispatch();
  const { items: products, loadingProducts, errorProducts } = useSelector((state) => state.products);
  const { items: categories, loadingCategories, errorCategories } = useSelector((state) => state.categories);


  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);


  if (loadingProducts) return <p>Cargando productos...</p>;
  if (errorProducts) return <p>Error: {error}</p>;

  const agregarAlCarrito = async (producto) => {
    try {
      let existingCart = null;
  
      // Buscar el carrito existente para el usuario
      const cartResponse = await fetch(`http://localhost:4002/cart/user/${userId}`);
  
      // Si se obtiene una respuesta 404, significa que no hay carrito, entonces lo creamos
      if (cartResponse.status === 404) {
        const createResponse = await fetch('http://localhost:4002/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
  
        if (!createResponse.ok) {
          throw new Error('Error al crear el carrito');
        }
  
        // Obtener el carrito recién creado
        existingCart = await createResponse.json();
      } else if (cartResponse.ok) {
        existingCart = await cartResponse.json();
      }
  
      if (!existingCart || !existingCart.id) {
        throw new Error('No se pudo obtener o crear el carrito');
      }
  
      // Agregar el producto al carrito existente
      const addResponse = await fetch(`http://localhost:4002/catalogo/${existingCart.id}/add-product`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          cartId: existingCart.id,
          productId: producto.id,
          quantity: 1,
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
  
  
  const filterByCategory = (categoryId) => {
    fetch(`http://localhost:4002/catalogo/products/by-category/${categoryId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al filtrar productos por categoría');
        }
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message);
      });
  };

  const filterByPrice = () => {
    const { min, max } = priceRange;
    fetch(`http://localhost:4002/catalogo/filter-by-price?minPrice=${min}&maxPrice=${max}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al filtrar productos por precio');
        }
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message);
      });
  };


  
>>>>>>> main
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

  const handleAddToCart = (producto) => {
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
              {categories.map((categoria) => (
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
<<<<<<< HEAD
=======
<div className="productos-grid">
  {products.map((producto) => (
    <div className="producto-card" key={producto.id}>
      <Link to={`/ViewProduct/${producto.id}`} className="product-link">
        <img 
          src={`data:image/jpeg;base64,${producto.images[0]}`}  
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
        onClick={() => agregarAlCarrito(producto)}
        disabled={producto.stock === 0} 
      >
        {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
      </button>
    </div>
  ))}
</div>
>>>>>>> main

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
