import React from 'react';
import { Link } from 'react-router-dom';
import './Product.css';

const Product = ({ product }) => {
  return (
    <Link to="/ViewProduct" className="product-link">
      <div className="product-card">
        <img src={product.img} alt={product.name} className="product-image" />
        <div className="product-name">{product.name}</div>
        <div className="product-price">${product.price.toLocaleString()}</div>
      </div>
    </Link>
  );
};

export default Product;

