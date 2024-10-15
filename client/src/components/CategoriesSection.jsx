import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import './CategoriesSection.css'; // Asegúrate de agregar los estilos
import sectionImg from '../assets/Mate-512.webp';

const categories = [
  { id: 1, name: 'Mates de Madera', img: sectionImg },
  { id: 2, name: 'Mates de Cerámica', img: sectionImg },
  { id: 3, name: 'Mates de Vidrio', img: sectionImg  },
  { id: 4, name: 'Mates Personalizados', img: sectionImg  },
  { id: 5, name: 'Accesorios', img: sectionImg  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3, 
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '20px',  
  autoplay: true,
  autoplay: 3000
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
