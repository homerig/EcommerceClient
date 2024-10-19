import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import './css/ProductsAdmin.css';
import axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [images, setImages] = useState([]); 
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    categoryId: '',
    images: null,
  });
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value, files } = e.target; // Incluye files para manejar imágenes
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: files ? files : value, // Si es un input de archivo, asigna files
    }));
  };
  
  const handleImageChange = (e) => {
    setImages(e.target.files); // Guardar los archivos seleccionados
  };

  useEffect(() => {
    fetch('http://localhost:4002/catalogo/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4002/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${id}?`)) {
      fetch(`http://localhost:4002/products/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setProducts(products.filter((product) => product.id !== id));
            alert('Producto eliminado exitosamente');
          } else {
            alert('Error al eliminar el producto');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar el producto:', error);
          alert('Hubo un problema al intentar eliminar el producto.');
        });
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
      images: null,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('description', formValues.description);
    formData.append('price', formValues.price);
    formData.append('discount', formValues.discount);
    formData.append('stock', formValues.stock);

    if (formValues.images) {
      for (let i = 0; i < formValues.images.length; i++) {
        formData.append('images', formValues.images[i]);
      }
    }

    fetch(`http://localhost:4002/products/${editingProduct.id}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert('Producto actualizado correctamente');
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === editingProduct.id ? { ...product, ...formValues } : product
            )
          );
          setEditModalOpen(false);
          setEditingProduct(null);
        } else {
          alert('Error al actualizar el producto');
        }
      })
      .catch((error) => {
        console.error('Error al actualizar el producto:', error);
        alert('Hubo un problema al intentar actualizar el producto.');
      });
  };

  const handleCreateProduct = () => {
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('description', formValues.description);
    formData.append('price', parseFloat(formValues.price));
    formData.append('discount', parseFloat(formValues.discount));
    formData.append('stock', parseInt(formValues.stock, 10));
    formData.append('categoryId', parseInt(formValues.categoryId, 10));

    if (formValues.images) {
      for (let i = 0; i < formValues.images.length; i++) {
        formData.append('images', formValues.images[i]);
      }
    }

    fetch('http://localhost:4002/products', {
      method: 'POST',
      body: formData,
    })
    .then((response) => {
      if (response.ok) {
        setCreateModalOpen(false);
        setFormValues({ name: '', description: '', price: 0, discount: 0, stock: 0, categoryId: '', images: null });
        fetch('http://localhost:4002/catalogo/products')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching data:', error));
      } else {
        alert('Error al guardar el producto');
      }
    })
    .catch((error) => {
      console.error('Error al guardar el producto:', error);
      alert('Hubo un problema al intentar guardar el producto.');
    });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleImageModalOpen = (images) => {
    setSelectedProductImages(images);
    setImageModalOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Modal de creación */}
      {createModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Crear Producto</h3>
            <label>
              Nombre:
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Descripción:
              <input
                type="text"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
              />
            </label>
            <div>
              <label>Category:</label>
              <select name="categoryId" onChange={handleChange} required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.description}
                  </option>
                ))}
              </select>
            </div>
            <label>
              Precio:
              <input
                type="number"
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Descuento:
              <input
                type="number"
                name="discount"
                value={formValues.discount}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                name="stock"
                value={formValues.stock}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Imágenes:
              <input
                type="file"
                name="images"
                multiple
                onChange={(e) => setFormValues({ ...formValues, images: e.target.files })}
              />
            </label>
            <button className="btn save-button" onClick={handleCreateProduct}>
              Crear Producto
            </button>
            <button className="btn cancel-button" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Producto</h3>
            <label>
              Nombre:
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Descripción:
              <input
                type="text"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Descuento:
              <input
                type="number"
                name="discount"
                value={formValues.discount}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                name="stock"
                value={formValues.stock}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Imágenes:
              <input
                type="file"
                name="images"
                multiple
                onChange={(e) => setFormValues({ ...formValues, images: e.target.files })}
              />
            </label>
            <button className="btn save-button" onClick={handleEditSubmit}>
              Guardar Cambios
            </button>
            <button className="btn cancel-button" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de visualización de imágenes */}
      {imageModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Imágenes del Producto</h3>
            <div className="image-gallery">
              {selectedProductImages.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`Product Image ${index + 1}`} />
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
