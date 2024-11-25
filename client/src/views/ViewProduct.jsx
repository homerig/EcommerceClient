import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './css/ViewProduct.css';
import { fetchProducts } from '../Redux/productosSlice';
import { fetchCart } from '../Redux/cartSlice';
import { agregarAlCarrito } from "../Redux/catalogoSlice";
const ProductView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.userId);
  const { items: products, loading, error } = useSelector((state) => state.products);
  const cartId = useSelector((state) => state.cart.cartId);

  const product = products.find((item) => item.id == id);

  useEffect(() => {
    dispatch(fetchProducts());
    if (userId) {
      dispatch(fetchCart(userId)); // Cargar carrito desde Redux
    }
  }, [dispatch, userId]);

  const agregarProducto = () => {
    if (cartId) {
      dispatch(agregarAlCarrito(product));
    } else {
      alert('No se encontró un carrito para este usuario.');
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Producto no encontrado.</p>;

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
        <img
          src={`data:image/jpeg;base64,${product.images[0]}`}
          alt={product.name}
          className="productoEnVerImagen"
        />
      )}

      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <div className="product-price-container">
          {product.discount > 0 ? (
            <>
              <span className="product-old-price">${product.price.toLocaleString()}</span>
              <span className="product-final-price">${finalPrice}</span>
            </>
          ) : (
            <span className="product-final-price">${product.price.toLocaleString()}</span>
          )}
        </div>

        <button
          className="agregar-carrito-btn"
          onClick={agregarProducto}
          disabled={product.stock === 0}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductView;
