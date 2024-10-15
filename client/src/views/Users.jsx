import React, { useState } from 'react';
import './Users.css';
import UserCard from './UserCard';

const Users = () => {
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'Lara Alonso', email: 'laraalonsoad@gmail.com', role: 'Comprador', orders: '#1, #4' },
    { id: 2, name: 'Lara Migueltorena', email: 'Miguelmigueltorena@gmail.com', role: 'Comprador', orders: '#2' },
    { id: 3, name: 'Francisco Cosentino', email: 'FranciscoCosentino@gmail.com', role: 'Comprador', orders: '#3, #5' },
    { id: 4, name: 'Homero Gonzalez', email: 'Homerogonzalez@gmail.com', role: 'Comprador', orders: '#6, #8' },
    { id: 5, name: 'Barbara Gaito', email: 'Bgaito@gmail.com', role: 'Administrador' },
    { id: 6, name: 'Juan Perez', email: 'JuanP@gmail.com', role: 'Administrador' },
    { id: 7, name: 'Pedro Gonzalez', email: 'pegonzalez@gmail.com', role: 'Administrador' },
    { id: 8, name: 'Paula Fernandez', email: 'paulafernandez@gmail.com', role: 'Comprador',orders: '#7' }
  ];

  // Función para manejar el filtro
  const filteredUsers = users.filter(user => {
    // Filtro por rol
    if (filter !== 'Todos' && user.role !== filter) {
      return false;
    }
    // Filtro por búsqueda (nombre o email)
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="users-container">
      <h1>Usuarios</h1>
      <div className="search-filter">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Comprador">Comprador</option>
          <option value="Administrador">Administrador</option>
        </select>
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      <div className="user-list">
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;
