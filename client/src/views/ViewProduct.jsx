import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import './css/ViewProduct.css'; 

const ProductView = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const agregarAlCarrito = async (producto) => {
    try {
      let existingCart = null;
  
      const cartResponse = await fetch(`http://localhost:4002/cart/user/${userId}`);
  
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
  
        existingCart = await createResponse.json();
      } else if (cartResponse.ok) {
        existingCart = await cartResponse.json();
      }
  
      if (!existingCart || !existingCart.id) {
        throw new Error('No se pudo obtener o crear el carrito');
      }
  
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
  
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4002/products/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el producto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>Error: {error}</p>;

  const finalPrice = (product.price - (product.price * product.discount) / 100).toLocaleString();

  return (
    <div className="product-view">
      

      {product.images && product.images.length > 1 ? (
        <Carousel 
        className="carouselProducto"
          showArrows={true}   
          infiniteLoop={true} 
          showThumbs={false} 
        >
          {product.images.map((image, index) => (
            <div key={index}>
              <img src={`data:image/jpeg;base64,${image}`} alt={`Producto ${index + 1}`} />
            </div>
          ))}
        </Carousel>
      ) : (
        <img src={`data:image/jpeg;base64,${product.images[0]}`} alt={product.name} className="productoEnVerImagen" />
      )}

      <div>
      <h2>{product.name}</h2>

        <p>{product.description}</p>

        <div className="product-price-container">
          {product.discount > 0 ? (
            <>
              <span className="product-old-price">
                ${product.price.toLocaleString()}
              </span>
              <span className="product-final-price">
                ${finalPrice} 
              </span>
            </>
          ) : (
            <span className="product-final-price">
              ${product.price.toLocaleString()} 
            </span>
          )}
        </div>

          <button 
                  className="agregar-carrito-btn" 
                  onClick={() => agregarAlCarrito(product)}
                  disabled={product.stock === 0} 
                ><FontAwesomeIcon icon={faShoppingCart} />
                {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                
            </button>
      </div>
      
    </div>
  );
};

export default ProductView;
