import React from 'react';
import Product from '../components/Product';
import CategoriesSection from '../components/CategoriesSection'; 
import './Home.css';
import mateImg from '../assets/Mate_1.png'
import mateHome from '../assets/Mates_Home.png'

const Home = () => {
  const products = [
    { id: 1, name: 'Mate artesanal 1', price: 30000, img: mateImg },
    { id: 2, name: 'Mate artesanal 2', price: 30000, img: mateImg },
    { id: 3, name: 'Mate artesanal 3', price: 30000, img: mateImg },
    { id: 4, name: 'Mate artesanal 4', price: 30000, img: mateImg },
    { id: 5, name: 'Mate artesanal 5', price: 30000, img: mateImg },
    { id: 6, name: 'Mate artesanal 6', price: 30000, img: mateImg },
    { id: 7, name: 'Mate artesanal 7', price: 30000, img: mateImg },
    { id: 8, name: 'Mate artesanal 8', price: 30000, img: mateImg },
    { id: 9, name: 'Mate artesanal 9', price: 30000, img: mateImg },
  ];

  return (
    <div className="home-container">

      <section className="hero-section">
        <h1 className="hero-title">Cada mate es único.</h1>
        <img src= {mateHome} alt="Unique Mate" className="hero-image" />
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
