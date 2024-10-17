import React from 'react';
import './CategoriesSection.css'; // Asegúrate de tener un archivo CSS separado para la sección
import mate_fondo from "../assets/Mate_1.png"; // Asegúrate de que la extensión del archivo sea correcta

const CategoriesSection = ({ categories }) => {
  return (
    <section className="categories-section">
      <h2>Categorías</h2>
      <div className="categories-grid">
        {categories.map(category => (
          <div
            key={category.id}
            className="category-item"
            style={{ backgroundImage: `url(${mate_fondo})` }} // Ajusta la propiedad de fondo aquí
          >
            <div className="category-name">
              {category.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
