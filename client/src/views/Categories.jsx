import React, { useState, useEffect } from 'react';
import './css/Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState(null);
  const [showInput, setShowInput] = useState(false); 

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4002/categories');
      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4002/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newCategory }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error al agregar la categoría: ${errorDetails.message}`);
      }

      setNewCategory('');
      setShowInput(false); 
      fetchCategories(); 
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="categories-container">
      <h1>Categorías</h1>
      {error && <p className="error">{error}</p>}
      
      <ul className="categories-list">
        {categories.map((category) => (
          <li key={category.id}>{category.description}</li>
        ))}
      </ul>

      <button className="add-category-button" onClick={() => setShowInput(!showInput)}>
        {showInput ? 'Cancelar' : 'Agregar Categoría'}
      </button>

      {showInput && (
        <form onSubmit={addCategory} className="category-form">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría"
            required
          />
          <button type="submit">Agregar</button>
        </form>
      )}
    </div>
  );
};

export default Categories;
