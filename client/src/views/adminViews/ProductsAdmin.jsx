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

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import loader from '../../assets/gifLoader.gif';

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
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar el producto con ID ${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id)).unwrap().then(() => {
          Swal.fire({
            title: "Eliminado",
            text: "El producto ha sido eliminado exitosamente.",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        }).catch(() => {
          Swal.fire({
            title: "No se ha podido eliminar",
            text: "No se puede eliminar un producto que está agregado a un carrito.",
            icon: "error",
            showConfirmButton: true,
          });
        });
      }
    });
  };
  
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormValues({
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      categoryDescription: product.categoryDescription,
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
  
  if (loading) return (<div className="product-table-container">
    <div className="table-actions">
    <h2>Productos</h2>
    <div className="table-actions">
    <button className="add-button" disabled>
        <FontAwesomeIcon icon={faPlus} /> Agregar
      </button>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
      <tbody></tbody>
    </table>
      <div className="containerLoaderProducts"><img src={loader} alt="Cargando.." className="loader" /><p> Cargando productos...</p></div>
    </div>
    

  </div>);

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
      

      
      {createModalOpen && <CreateForm setCreateModalOpen={setCreateModalOpen} />}

      
      {editModalOpen && ( <EditProductModal
        setEditModalOpen={setEditModalOpen}
        initialValues={{
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          discount: editingProduct.discount,
          stock: editingProduct.stock,
          images: null,
          categoryDescription: editingProduct.categoryDescription
        }}
        editingProduct={editingProduct}
      />
      )}

      
      {imageModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <h3>Imágenes del Producto</h3>
          <div className="image-gallery">
            {selectedProductImages.map((image, index) => (
              <img 
                key={index} 
                src={`data:image/jpeg;base64,${image}`}
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
