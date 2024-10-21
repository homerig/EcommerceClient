import React, { useState, useEffect } from 'react';
import './css/Users.css';
import UserCard from './UserCard';
import EditUser from './EditUser'; // Importamos el modal para editar

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', role: '' });
  const [filter, setFilter] = useState('Todos'); // Filtro para los roles
  const [searchTerm, setSearchTerm] = useState(''); // Barra de búsqueda
  const [error, setError] = useState(null); // Manejamos los errores
  const [loading, setLoading] = useState(true); // Estado de carga
  const [orders, setOrders] = useState({}); // Estado para almacenar las órdenes por usuario

  useEffect(() => {
    // Obtener los usuarios
    fetch('http://localhost:4002/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);

        // Obtener las órdenes de cada usuario
        data.forEach(user => {
          fetch(`http://localhost:4002/order/user/${user.id}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error al obtener las órdenes del usuario ${user.id}`);
              }
              return response.json();
            })
            .then(orderData => {
              setOrders(prevOrders => ({
                ...prevOrders,
                [user.id]: orderData, // Guardamos las órdenes por userId
              }));
            })
            .catch(err => setError(err.message));
        });
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar el usuario');
        }
        return response.json();
      })
      .then(updatedUserData => {
        setUsers(users.map(user => (user.id === updatedUserData.id ? updatedUserData : user)));
        setEditingUser(null);
      })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      fetch(`http://localhost:4002/users/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
          }
          setUsers(users.filter(user => user.id !== id)); // Eliminar usuario de la lista localmente
        })
        .catch(err => setError(err.message));
    }
  };

  // Filtro de usuarios según el rol y búsqueda por nombre o email
  const filteredUsers = users.filter((user) => {
    if (filter !== 'Todos' && user.role !== filter) {
      return false;
    }
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="users-container">
      <h1>Usuarios</h1>

      {/* Barra de búsqueda y filtro por rol */}
      <div className="search-filter">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="USER">User</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <input 
          type="text" 
          placeholder="Buscar por nombre o email..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="user-list">
        {filteredUsers.map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            orders={orders[user.id]} // Pasamos las órdenes al componente UserCard
            onEdit={() => handleEdit(user)} 
            onDelete={() => handleDelete(user.id)} 
          />
        ))}
      </div>

      {/* Modal para editar usuario */}
      {editingUser && (
        <EditUser 
          isOpen={editingUser !== null} 
          onClose={() => setEditingUser(null)} 
          user={editingUser}
          updatedUser={updatedUser} 
          setUpdatedUser={setUpdatedUser} 
          handleUpdate={handleUpdate} 
        />
      )}
    </div>
  );
};

export default ViewUsers;
