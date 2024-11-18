import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../Redux/categoriesSlice";
import { createProduct } from "../../../Redux/productosSlice";

const CreateForm = ({ setCreateModalOpen }) => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [stock, setstock] = useState(0);
  const [categoryId, setcategoryId] = useState("");
  const [images, setimages] = useState([]);

  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreateSubmit = (e) => {
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

    dispatch(createProduct(formData));

    // Resetear los estados del formulario
    setname("");
    setdescription("");
    setprice(0);
    setdiscount(0);
    setstock(0);
    setcategoryId("");
    setimages([]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={() => setCreateModalOpen(false)}>
          ✖
        </button>
        <h3>Crear Producto</h3>
        <form onSubmit={handleCreateSubmit}>
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setname(e.target.value)} required
            />
          </label>
          <label>
            Descripción
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setdescription(e.target.value)} required
            />
          </label>
          <div>
            <label>Categoría</label>
            <select name="categoryId" onChange={(e) => setcategoryId(e.target.value)} required>
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
                onChange={(e) => setprice(e.target.value)} required
              />
            </label>
            <label>
              Descuento
              <input
                type="number"
                name="discount"
                value={discount}
                onChange={(e) => setdiscount(e.target.value)} required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                name="stock"
                value={stock}
                onChange={(e) => setstock(e.target.value)} required
              />
            </label>
          </div>
          <label>
            Imágenes
            <input
              type="file"
              name="images"
              multiple
              onChange={(e) => setimages(e.target.files)} required
            />
          </label>
          <button className="btn save-button submit-button" type="submit">
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
