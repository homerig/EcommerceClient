import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../Redux/categoriesSlice";
import { updateProduct } from "../../../Redux/productosSlice";

const EditProductModal = ({ setEditModalOpen, initialValues, editingProduct }) => {
  const [name, setname] = useState(initialValues.name);
  const [description, setdescription] = useState(initialValues.description);
  const [price, setprice] = useState(initialValues.price);
  const [discount, setdiscount] = useState(initialValues.discount);
  const [stock, setstock] = useState(initialValues.stock);
  const [categoryDescription, setcategoryDescription] = useState(initialValues.categoryDescription);
  const [categoryId, setcategoryId] = useState(null);
  const [images, setimages] = useState([]);

  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && categoryDescription) {
      const selectedCategory = categories.find((item) => item.description === categoryDescription);
      if (selectedCategory) {
        setcategoryId(selectedCategory.id); 
      }
    }
  }, [categories, categoryDescription]);

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);


    // Añadir imágenes al FormData
    if (images.length > 0) {
      Array.from(images).forEach((image) => {
        formData.append("images", image);
      });
    }

    dispatch(updateProduct({ id: editingProduct.id, productData: formData }))
    .then(() => {
      setEditModalOpen(false); // Cierra el modal al completar la acción
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Producto</h3>
        <form onSubmit={handleEditSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </label>
        <label>
          Descripción
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />
        </label>
        <div>
            <label>Categoría</label>
            <select
                name="categoryId"
                value={categoryId} // Mantener el estado sincronizado con el valor seleccionado
                onChange={(e) => setcategoryId(e.target.value)}
                required
            >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.description}
                </option>
                ))}
            </select>
        </div>

          <div className="inputGroup">

          
        <label>
          Precio
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setprice(e.target.value)}
          />
        </label>
        <label>
          Descuento
          <input
            type="number"
            name="discount"
            value={discount}
            onChange={(e) => setdiscount(e.target.value)}
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            name="stock"
            value={stock}
            onChange={(e) => setstock(e.target.value)}
          />
        </label>
        </div>
        <label>
          Imágenes
          <input
            type="file"
            name="images"
            multiple
            onChange={(e) => setimages(e.target.files)}
          />
        </label>

        <button className="btn save-button" type="submit">
          Guardar Cambios
        </button>

        <button className="btn cancel-button" onClick={() => setEditModalOpen(false)}>
          Cancelar
        </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
