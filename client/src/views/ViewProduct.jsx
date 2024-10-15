import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './css/ViewProduct.css';  // Import the CSS file
import mateImg from '../assets/Mate_1.png'
import { Link } from 'react-router-dom';

const ProductView = () => {
  const [selectedColor, setSelectedColor] = useState(null);

  const colors = [
    { id: 1, name: 'Light Pink', code: '#e7cbc4' },
    { id: 2, name: 'Soft Beige', code: '#d1a592' },
    { id: 3, name: 'Dark Brown', code: '#3e2c29' },
  ];

  const handleColorClick = (colorCode) => {
    setSelectedColor(colorCode);
  };

  return (
    <div className="card">
      <Link to="/Products">
        <button className="backButton">
            <FontAwesomeIcon icon={faArrowLeft} /> Volver
          </button>
      </Link>
    <div className="container">
      

      <img
            src={mateImg}  // Use the imported image
            alt="Mate Camionero"
            className="image"
          />

      <div className="detailsSection">
        <h1 className="title">Mate Camionero</h1>
        <p className="description">
          Hecho de acero inoxidable y con tapa hermética y amplia capacidad, es
          perfecto para mantener la temperatura ideal de tus infusiones. Su
          diseño ergonómico se adapta cómodamente a la mano, convirtiéndolo en el compañero ideal para cada viaje.
        </p>

        <h3 className="subtitle">Colores:</h3>
        <div className="colorOptions">
          {colors.map((color) => (
            <button
              key={color.id}
              className="colorButton"
              style={{
                backgroundColor: color.code,
                border: selectedColor === color.code ? '2px solid black' : 'none',
              }}
              onClick={() => handleColorClick(color.code)}
            ></button>
          ))}
        </div>

        <button className="cartButton">
          <FontAwesomeIcon icon={faShoppingCart} /> Agregar al carrito
        </button>
      </div>
    </div>
    </div>
  );
};

export default ProductView;
