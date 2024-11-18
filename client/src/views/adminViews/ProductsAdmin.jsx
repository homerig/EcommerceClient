import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import './css/ProductsAdmin.css';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct, deleteProduct } from "../../Redux/productosSlice";
import { fetchCategories } from "../../Redux/categoriesSlice";
import CreateForm from './Modals/createProductModal';
import EditProductModal from './Modals/EditProductModal';

const ProductTable = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);


  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${id}?`)) {
      dispatch(deleteProduct(id));
    }
  };


  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormValues({
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      categoryId: product.categoryId,
      images: null,
    });
    setEditModalOpen(true);
  };

  const handleImageModalOpen = (images) => {
    setSelectedProductImages(images);
    setImageModalOpen(true);
  };
  
  const filteredProducts = products.filter(
    (product) =>
      product.name &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return (
    <div className="product-table-container">
      <div className="table-actions">
      <h2>Productos</h2>
      <div className="table-actions">
      <button className="add-button" onClick={() => setCreateModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} /> Agregar
        </button>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            className="searchBar"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
      </div>
        
      </div>
      <div className="tableContainer">
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Descuento %</th>
            <th>Imágenes</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>#{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price.toLocaleString()}</td>
              <td>{product.discount}%</td>
              <td>
                <button onClick={() => handleImageModalOpen(product.images)}>
                  <FontAwesomeIcon icon={faEye} /> Ver
                </button>
              </td>
              <td>{product.stock}</td>
              <td>
                <button className="btn edit-button" onClick={() => handleEditClick(product)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn delete-button" onClick={() => handleDelete(product.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      

      {/* Modal de creación */}
      {createModalOpen && <CreateForm setCreateModalOpen={setCreateModalOpen} />}

      {/* Modal de edición */}
      {editModalOpen && ( <EditProductModal
        setEditModalOpen={setEditModalOpen}
        initialValues={{
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          discount: editingProduct.discount,
          stock: editingProduct.stock,
          images: null,
        }}
        editingProduct={editingProduct}
      />
      )}

      {/* Modal de visualización de imágenes */}
      {imageModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <h3>Imágenes del Producto</h3>
          <div className="image-gallery">
            {selectedProductImages.map((image, index) => (
              <img 
                key={index} 
                src={`data:image/jpeg;base64,${image}`}  // Asegúrate de que sea 'image/jpeg' o el tipo MIME correcto
                alt={`Product Image ${index + 1}`} 
                
              />
            ))}
          </div>
          <button className="btn cancel-button" onClick={() => setImageModalOpen(false)}>
            Cerrar
          </button>
        </div>
      </div>
    )}
    </div>
  );
};

export default ProductTable;
