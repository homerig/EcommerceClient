import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de tener Link importado
import Product from '../components/Product';
import CategoriesSection from '../components/CategoriesSection';
import './css/Home.css';
import mateHome from '../assets/Mates_Home.png'; // Imagen de héroe o principal
import mateImg from '../assets/Mate_1.png'; // Placeholder de imagen de producto

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);

  // Fetch de productos (limitar a 5 productos)
  useEffect(() => {
    fetch('http://localhost:4002/catalogo/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.slice(0, 5)); // Limitar a los primeros 5 productos
        setLoadingProducts(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorProducts(error.message);
        setLoadingProducts(false);
      });
  }, []);

  // Fetch de categorías
  useEffect(() => {
    fetch('http://localhost:4002/categories')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorCategories(error.message);
        setLoadingCategories(false);
      });
  }, []);

  if (loadingProducts || loadingCategories) return <p>Cargando...</p>;
  if (errorProducts) return <p>Error al cargar productos: {errorProducts}</p>;
  if (errorCategories) return <p>Error al cargar categorías: {errorCategories}</p>;

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Cada mate es único.</h1>
        <img src={mateHome} alt="Unique Mate" className="hero-image" />
      </section>

      <section className="products-section">
        {/* Contenedor para el título y el botón */}
        <div className="products-header">
          <h2 className="products-title">Nuestros Productos</h2>
          {/* Enlace Ver más alineado a la derecha */}
          <Link to="/Products" className="ver-mas-link">
            Ver más
          </Link>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <Product
              key={product.id}
              product={{ ...product, img: product.images?.[0]?.url || mateImg }}
            />
          ))}
        </div>
      </section>

      <CategoriesSection categories={categories} /> {/* Mostrar categorías */}
    </div>
  );
};

export default Home;
