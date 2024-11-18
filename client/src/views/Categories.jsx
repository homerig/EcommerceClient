// src/components/Categories.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory } from "../Redux/categoriesSlice";
import "./css/Categories.css";

const Categories = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector((state) => state.categories);

  const [description, setNewCategory] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    dispatch(createCategory({ description })).unwrap()  
    .then(() => {
      setNewCategory("");  
      setShowInput(false);  
    })
    .catch((error) => {
      console.error("Error al agregar la categoría:", error);
    });
    
    setNewCategory("");
    setShowInput(false);
  };

  return (
    <div className="categories-container">
      <h1>Categorías</h1>
      {loading && <p>Cargando categorías...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="categories-list">
        {categories.map((category) => (
          <li key={category.id}>{category.description}</li>
        ))}
      </ul>

      <button className="add-category-button" onClick={() => setShowInput(!showInput)}>
        {showInput ? "Cancelar" : "Agregar Categoría"}
      </button>

      {showInput && (
        <form onSubmit={handleAddCategory} className="category-form">
          <input
            type="text"
            value={description}
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
