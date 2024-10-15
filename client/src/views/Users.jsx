import React from 'react';
import './Users.css';
import UserCard from './UserCard';

const Users = () => {
  const users = [
    { id: 1, name: 'Lara Alonso', email: 'laraalonsoad@gmail.com', role: 'Comprador', orders: '#1, #19' },
    { id: 2, name: 'Lara Migueltorena', email: 'Miguelmigueltorena@gmail.com', role: 'Comprador', orders: '#2' },
    { id: 3, name: 'Francisco Cosentino', email: 'FranciscoCosentino@gmail.com', role: 'Comprador', orders: '#3, #10' },
    { id: 4, name: 'Homero Gonzalez', email: 'Homerogonzalez@gmail.com', role: 'Comprador', orders: '#6, #15' },
    { id: 5, name: 'Barbara Gaito', email: 'Bgaito@gmail.com', role: 'Administrador' },
    { id: 6, name: 'Juan Perez', email: 'JuanP@gmail.com', role: 'Vendedor'}
  ];

  return (
    <div className="users-container">
      <h1>Usuarios</h1>
      <div className="search-filter">
        <select>
          <option>Todos</option>
          <option>Comprador</option>
          <option>Vendedor</option>
          <option>Administrador</option>
        </select>
        <input type="text" placeholder="Buscar..." />
      </div>
      <div className="user-list">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;
