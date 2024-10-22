import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import './css/Orders.css';
import axios from 'axios';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // Estado para las órdenes filtradas
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor del input de búsqueda
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4002/order');
        setOrders(response.data);
        setFilteredOrders(response.data); // Iniciar con todas las órdenes
      } catch (err) {
        setError('Error al obtener las órdenes');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  

  // Filtrar órdenes cuando el término de búsqueda cambia
  useEffect(() => {
    const results = orders.filter(order =>
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-table-container">
      <h2>Ver Órdenes</h2>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Buscar por email..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el valor del input de búsqueda
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>N° Orden</th>
            <th>E-Mail</th>
            <th>Total</th>
            <th>Orden</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.user.email}</td> {/* Accede a order.user.email aquí */}
              <td>${order.totalPrice.toFixed(2)}</td> {/* Aquí usamos totalPrice */}
              <td>
                <button className="view-button" onClick={() => handleViewOrder(order)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h3>Detalles de la Orden #{selectedOrder.id}</h3>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} - ${item.product.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <button onClick={closePopup}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
