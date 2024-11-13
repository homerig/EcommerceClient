// ViewUsers.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchUserOrders, updateUser, deleteUser } from "../Redux/userSlice";
import UserCard from "./UserCard";
import EditUser from "./EditUser";
import "./css/Users.css";

const ViewUsers = () => {
  const dispatch = useDispatch();
  const { items: users, loading, error, orders } = useSelector((state) => state.users);

  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", role: "" });
  const [filter, setFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsers()).then((action) => {
      action.payload.forEach(user => {
        dispatch(fetchUserOrders(user.id));
      });
    });
  }, [dispatch]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedUser({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: editingUser.id, userData: updatedUser }))
      .unwrap()
      .then(() => setEditingUser(null))
      .catch((err) => console.error("Error updating user:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      dispatch(deleteUser(id)).catch((err) => console.error("Error deleting user:", err));
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter !== "Todos" && user.role !== filter) return false;
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase())
      && !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="users-container">
      <h1>Usuarios</h1>
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
            orders={orders[user.id] || []}
            onEdit={() => handleEdit(user)}
            onDelete={() => handleDelete(user.id)}
          />
        ))}
      </div>
      {editingUser && (
        <EditUser
          isOpen={!!editingUser}
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
