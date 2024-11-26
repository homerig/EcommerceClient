import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../Redux/categoriesSlice";
import Swal from "sweetalert2";
import "./css/Categories.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Categories = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector((state) => state.categories);

  const [newDescription, setNewDescription] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    dispatch(createCategory({ description: newDescription }))
      .unwrap()
      .then(() => {
        setNewDescription("");
        setShowInput(false);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Categoría agregada correctamente",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo agregar la categoría.",
        });
      });
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!editCategory) return;

    dispatch(updateCategory({ categoryId: editCategory.id, description: newDescription }))
      .unwrap()
      .then(() => {
        setEditCategory(null);
        setNewDescription("");
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Categoría actualizada correctamente",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la categoría.",
        });
      });
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      dispatch(deleteCategory(categoryId))
        .unwrap()
        .then(() => {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Categoría eliminada correctamente",
            showConfirmButton: false,
            timer: 2000,
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la categoría.",
          });
        });
    }
  };

  return (
    <div className="categories-container">
      <h2>Categorías</h2>
      {loading && <p>Cargando categorías...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="categories-list">
        {categories.map((category) => (
          <li key={category.id}>
            <div className="category-item">
              {editCategory && editCategory.id === category.id ? (
                <form onSubmit={handleUpdateCategory} className="category-form">
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Editar categoría"
                    required
                  />
                  <button type="submit" className="save-button">Guardar</button>
                  <button type="button" onClick={() => setEditCategory(null)} className="cancel-button">Cancelar</button>
                </form>
              ) : (
                <>
                  <span>{category.description}</span>
                  <div className="button-group">
                    <button
                      className="icon-button"
                      onClick={() => {
                        setEditCategory(category);
                        setNewDescription(category.description);
                      }}
                      title="Editar categoría"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-button"
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Eliminar categoría"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="formCategories">
        <button className="add-category-button" onClick={() => setShowInput(!showInput)}>
          {showInput ? "Cancelar" : "Agregar Categoría"}
        </button>

        {showInput && (
          <form onSubmit={handleAddCategory} className="category-form">
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Nueva categoría"
              required
            />
            <button type="submit">Agregar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Categories;
