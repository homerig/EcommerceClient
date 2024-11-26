import Swal from 'sweetalert2';
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
import loader from '../assets/gifLoader.gif';

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
      dispatch(fetchCart(userId)); 
    }
  }, [dispatch, userId]);

  const agregarProducto = () => {
    if (cartId) {
      dispatch(agregarAlCarrito(product))
        .then(() => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se pudo agregar el producto al carrito',
          });
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe iniciar sesión para agregar un producto al carrito',
      });
      navigate("/Login");
    }
  };

  if (loading) return <div className="containerLoader"><img src={loader} alt="Cargando.." className="loader" /><p> Cargando producto...</p></div>;
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
          className="agregarCarrito"
          onClick={agregarProducto}
          disabled={product.stock === 0}
        >
          <FontAwesomeIcon icon={faShoppingCart} className='buttonIcon' />
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductView;
