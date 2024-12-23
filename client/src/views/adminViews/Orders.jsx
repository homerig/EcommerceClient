import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../Redux/ordersSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./css/Orders.css";
import loader from '../../assets/gifLoader.gif';

const OrderTable = () => {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const results = orders.filter((order) =>
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

  if (loading) return  (<div className="order-table-container">
    <div className="table-actions">
    <h2>Órdenes</h2>
    <div className="table-actions">
    <div className="search-bar bottom">
      <input
        type="text"
        placeholder="Buscar por email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
    </div>
    </div>
    
    </div>
    <div className="tableContainer">
    <table className="styled-table">
      <thead>
        <tr>
          <th>N° Orden</th>
          <th>E-Mail</th>
          <th>Total</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <div className="containerLoaderOrders"><img src={loader} alt="Cargando.." className="loader" /><p> Cargando Órdenes...</p></div>
    </div>
    

  </div>);
  if (error) return <p>{error}</p>;

  return (
    <div className="order-table-container">
      <div className="table-actions">
      <h2>Órdenes</h2>
      <div className="table-actions">
      <div className="search-bar bottom">
        <input
          type="text"
          placeholder="Buscar por email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>
      </div>
      
      </div>
      <div className="tableContainer">
      <table className="styled-table">
        <thead>
          <tr>
            <th>N° Orden</th>
            <th>Correo Electrónico</th>
            <th>Total</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.user.email}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>
                <button className="view-button" onClick={() => handleViewOrder(order)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      

      {showPopup && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h3>Detalles de la Órden #{selectedOrder.id}</h3>
            <div className="order-details">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="order-item">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>
                    ${((item.product.price - item.product.price * (item.product.discount || 0) / 100) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="order-total">
                <span>Total</span>
                <span>${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={closePopup}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
