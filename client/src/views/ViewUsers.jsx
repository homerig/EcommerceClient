import React, { useState, useEffect } from 'react';
import './css/Users.css';
import UserCard from './UserCard';
import EditUser from './EditUser'; // Importamos el nuevo modal

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetch('http://localhost:4002/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedUser({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4002/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    })
      .then(response => response.json())
      .then(updatedUserData => {
        setUsers(users.map(user => (user.id === updatedUserData.id ? updatedUserData : user)));
        setEditingUser(null);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4002/users/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setUsers(users.filter(user => user.id !== id)); // Eliminar usuario de la lista localmente
        }
      });
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <div className="user-list">
        {users.map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            onEdit={() => handleEdit(user)} 
            onDelete={() => handleDelete(user.id)} // Pasamos la función de eliminar
          />
        ))}
      </div>

      <EditUser 
        isOpen={editingUser !== null} 
        onClose={() => setEditingUser(null)} 
        user={editingUser}
        updatedUser={updatedUser} 
        setUpdatedUser={setUpdatedUser} 
        handleUpdate={handleUpdate} 
      />
    </div>
  );
};

export default ViewUsers;
