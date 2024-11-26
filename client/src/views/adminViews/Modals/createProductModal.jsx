import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../Redux/categoriesSlice";
import { createProduct } from "../../../Redux/productosSlice";
import Swal from "sweetalert2"; 
import "sweetalert2/dist/sweetalert2.min.css";

const CreateForm = ({ setCreateModalOpen }) => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [stock, setstock] = useState(0);
  const [categoryId, setcategoryId] = useState("");
  const [images, setimages] = useState([]);
  const imageInputRef = useRef(null);

  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);

    if (images.length > 0) {
      Array.from(images).forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await dispatch(createProduct(formData));

    if (response.meta.requestStatus === "fulfilled") {
      setname("");
      setdescription("");
      setprice(0);
      setdiscount(0);
      setstock(0);
      setcategoryId("");
      setimages([]);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      Swal.fire({
        title: "¡Producto Creado!",
        text: "El producto se creó correctamente.",
        icon: "success",
        timer: 3000, 
        showConfirmButton: false,
        toast: true, 
        position: "top-end", 
      });
    }
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
              onChange={(e) => setname(e.target.value)}
              required
            />
          </label>
          <label>
            Descripción
            <input
              type=""
              name="description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              required
            />
          </label>
          <div>
            <label>Categoría</label>
            <select
              name="categoryId"
              value={categoryId}
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
              onFocus={() => setprice("")}
              onBlur={(e) => setprice(e.target.value === "" ? 0 : e.target.value)}
              onChange={(e) => setprice(e.target.value)}
              required
            />
          </label>
          <label>
            Descuento
            <input
              type="number"
              name="discount"
              value={discount}
              onFocus={() => setdiscount("")}
              onBlur={(e) => setdiscount(e.target.value === "" ? 0 : e.target.value)}
              onChange={(e) => {
                const value = Math.min(100, Math.max(0, e.target.value));
                setdiscount(value);
              }}
              required
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              name="stock"
              value={stock}
              onFocus={() => setstock("")}
              onBlur={(e) => setstock(e.target.value === "" ? 0 : e.target.value)}
              onChange={(e) => setstock(e.target.value)}
              required
            />
          </label>

          </div>
          <label>
            Imágenes
            <input
              type="file"
              name="images"
              multiple
              ref={imageInputRef}
              onChange={(e) => setimages(e.target.files)}
              required
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
