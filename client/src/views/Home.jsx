import React from 'react';
import Product from '../components/Product';
import CategoriesSection from '../components/CategoriesSection'; 
import './Home.css';

const Home = () => {
  const products = [
    { id: 1, name: 'Mate artesanal 1', price: 30000, img: 'url-to-image-1' },
    { id: 2, name: 'Mate artesanal 2', price: 30000, img: 'url-to-image-2' },
    { id: 3, name: 'Mate artesanal 3', price: 30000, img: 'url-to-image-3' },
  ];

  return (
    <div className="home-container">

      <section className="hero-section">
        <h1 className="hero-title">Cada mate es único.</h1>
        <img src="hero-image-url" alt="Unique Mate" className="hero-image" />
      </section>

      <section className="products-section">
        <h2>Nuestros Productos</h2>
        <div className="products-grid">
          {products.map(product => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CategoriesSection /> {/* Sección de categorías con el slider */}

    </div>
  );
};

export default Home;
