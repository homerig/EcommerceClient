import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import { fetchProducts } from '../Redux/productosSlice';
import './css/Home.css';
import mateHome from '../assets/Mates_Home.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import loader from '../assets/gifLoader.gif';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return (<div className="home-container">
    <section className="hero-section">
      <h1 className="hero-title">Cada mate es único.</h1>
      <img src={mateHome} alt="Unique Mate" className="hero-image" />
    </section>

    <div className="containerLoader"><img src={loader} alt="Cargando.." className="loader" /><p> Cargando...</p></div>;

  </div>)

  if (error) return <p>Error al cargar productos: {error}</p>;
  
  const filteredProducts = products.filter(
    (product) =>
      product.stock != 0
  ).slice(0, 6);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Cada mate es único.</h1>
        <img src={mateHome} alt="Unique Mate" className="hero-image" />
      </section>

      <section className="products-section">
        <div className="products-header">
          <h2 className="products-title">Nuestros Productos</h2>
          <Link to="/Products" className="ver-mas-link">
            Ver más   <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;