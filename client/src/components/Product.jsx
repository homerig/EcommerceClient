import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Product.css';

const Product = ({ product }) => {
  const [finalPrice, setFinalPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch del precio final
  useEffect(() => {
    const fetchFinalPrice = async () => {
      try {
        const response = await fetch(`http://localhost:4002/products/${product.id}/final-price`);
        if (!response.ok) {
          throw new Error('Error al obtener el precio final');
        }
        const price = await response.json();
        setFinalPrice(price);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false); // Asegúrate de marcar como no cargando, independientemente del resultado
      }
    };

    fetchFinalPrice();
  }, [product.id]);

  if (loading) return <p>Cargando precio...</p>;
  if (error) return <p>Error: {error}</p>;

  const initialPrice = product.price.toLocaleString();
  const discountedPrice = finalPrice?.toLocaleString();

  return (
    <Link to={`/ViewProduct/${product.id}`} className="product-link">
      <div className="product-card">
        <img src={product.img} alt={product.name} className="product-image" />
        <div className="product-name">{product.name}</div>
        <div className="product-price-container">
          {product.discount > 0 ? ( // Si hay descuento, mostrar precio inicial y final
            <>
              {product.discount && (
                <span className="product-old-price">
                  ${initialPrice} {/* Precio inicial con formato */}
                </span>
              )}
              <span className="product-final-price">
                ${discountedPrice || 'Precio no disponible'}
              </span>
            </>
          ) : (
            // Si no hay descuento, mostrar solo el precio final
            <span className="product-final-price">
              ${discountedPrice || 'Precio no disponible'} {/* Utiliza el precio final del endpoint */}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;
