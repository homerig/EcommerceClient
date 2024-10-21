import React, { useState, useEffect } from 'react';
import './css/Products.css';
import mateImg from '../assets/Mate_1.png';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const userId = localStorage.getItem('userId');

  const toggleFilters = () => setShowFilters(!showFilters);


  const fetchProducts = () => {
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
  };

 
  const fetchCategories = () => {
    fetch('http://localhost:4002/categories')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        return response.json();
      })
      .then((data) => setCategorias(data))
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories(); 
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  const agregarAlCarrito = async (producto) => {
    try {
      
      let existingCart = null;

      const cartResponse = await fetch(`http://localhost:4002/cart?userId=${userId}`);
      if (cartResponse.ok) {
        const carts = await cartResponse.json();
        if (carts.length > 0) {
          existingCart = carts[0];
        }
      }

      
      if (!existingCart) {
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

        existingCart = await createResponse.json();
      }

      
      const addResponse = await fetch(`http://localhost:4002/catalogo/${existingCart.id}/add-product`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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


  
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (selectedCategories.length > 0) {
      filterByCategory(selectedCategories[0]); 
    } else {
      filterByPrice();
    }
  };

 
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' }); 
    setShowFilters(false); 
    const checkboxes = document.querySelectorAll('.filtro-categorias input[type="checkbox"]');
    checkboxes.forEach((checkbox) => (checkbox.checked = false)); 

    fetchProducts(); 
  };


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
    <div key={producto.id} className="producto-card">
      <img 
        src={`data:image/jpeg;base64,${producto.images[0]}`}  
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
