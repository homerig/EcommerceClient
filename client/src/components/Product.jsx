import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFinalPrice } from '../Redux/productosSlice';
import './Product.css';

const Product = ({ product }) => {
  const dispatch = useDispatch();

  // Extraer productos y estados de Redux
  const { items: products, loading, error, finalPrices } = useSelector((state) => state.products);

  const filteredProducts = products.filter((product) => product.stock !== 0).slice(0, 6);

  useEffect(() => {
    filteredProducts.forEach((product) => {
      if (!finalPrices[product.id]) {
        dispatch(fetchFinalPrice(product.id));
      }
    });
  }, [dispatch, filteredProducts, finalPrices]);

  
  const initialPrice = product.price;

  const discountedPrice = product.discount
    ? initialPrice - (initialPrice * product.discount) / 100
    : initialPrice;

  const formattedInitialPrice = initialPrice.toLocaleString();
  const formattedDiscountedPrice = discountedPrice.toLocaleString();

  return (
    <Link to={`/ViewProduct/${product.id}`} className="product-link">
      <div className="product-card">
        <img
          src={`data:image/jpeg;base64,${product.images.length > 0 ? product.images[0] : ''}`}
          alt={product.name}
          className="product-image"
        />
        <div className="product-name">{product.name}</div>
        <div className="product-price-container">
          {product.stock === 0 ? (
            <span className="product-out-of-stock">Sin stock</span>
          ) : (
            <>
              {product.discount > 0 ? (
                <>
                  <span className="product-old-price">${formattedInitialPrice}</span>
                  <span className="product-final-price">${formattedDiscountedPrice}</span>
                </>
              ) : (
                <span className="product-final-price">${formattedDiscountedPrice}</span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;
