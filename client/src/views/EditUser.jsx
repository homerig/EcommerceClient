import React from 'react';
import './css/EditUser.css'; // Si tienes una hoja de estilos específica

const EditUser = ({ isOpen, onClose, user, updatedUser, setUpdatedUser, handleUpdate }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no se muestra nada.

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Editar Usuario</h2>
        <form onSubmit={handleUpdate}>
          <label>
            Nombre:
            <input
              type="text"
              value={updatedUser.name}
              onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
              placeholder="Nombre"
            />
          </label>
          <label>
            Correo electrónico:
            <input
              type="email"
              value={updatedUser.email}
              onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              placeholder="Correo electrónico"
            />
          </label>
          <label>
            Rol:
            <select
              value={updatedUser.role}
              onChange={(e) => setUpdatedUser({ ...updatedUser, role: e.target.value })}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
          <button type="submit" className="submit-button">Actualizar</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
