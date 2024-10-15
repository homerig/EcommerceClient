import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import './CategoriesSection.css'; // Asegúrate de agregar los estilos

const categories = [
  { id: 1, name: 'Mates de Madera', img: 'https://via.placeholder.com/150?text=Mate+de+Madera' },
  { id: 2, name: 'Mates de Cerámica', img: 'https://via.placeholder.com/150?text=Mate+de+Cerámica' },
  { id: 3, name: 'Mates de Vidrio', img: 'https://via.placeholder.com/150?text=Mate+de+Vidrio' },
  { id: 4, name: 'Mates Personalizados', img: 'https://via.placeholder.com/150?text=Mate+Personalizado' },
  { id: 5, name: 'Accesorios', img: 'https://via.placeholder.com/150?text=Accesorios' },
  // Puedes agregar más categorías aquí
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3, // Número de categorías visibles a la vez
  slidesToScroll: 1,
};

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <h3>Categorías</h3>
      <Slider {...sliderSettings}>
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <img src={category.img} alt={category.name} className="category-image" />
            <h4>{category.name}</h4>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CategoriesSection;
