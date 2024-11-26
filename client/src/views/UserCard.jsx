import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './css/UserCard.css';

const UserCard = ({ user, orders, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>

        <>
          <h3>Órdenes:</h3>
          {orders && orders.length > 0 ? (
            <ul>
              {orders.map(order => (
                <li key={order.id}>Orden #{order.id} </li>
              ))}
            </ul>
          ) : (
            <p>No tiene órdenes.</p>
          )}
        </>

      <div className="user-actions">
        <button onClick={() => onEdit(user)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={() => onDelete(user.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
