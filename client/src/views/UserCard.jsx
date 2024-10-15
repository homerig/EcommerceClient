import React from 'react';
import './css/UserCard.css';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      <p><strong>Órdenes:</strong> {user.orders}</p>
    </div>
  );
};

export default UserCard;
