import React from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useDispatch } from "react-redux";
import { updateUser } from "../Redux/userSlice";
import "./css/EditUser.css";

const EditUser = ({
  isOpen,
  onClose,
  user,
  updatedUser,
  setUpdatedUser,
  handleUpdate,
  
}) => {
  const dispatch = useDispatch();
  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
  
    dispatch(updateUser({ id: user.id, userData: updatedUser })) 
    
      .then(() => {

        Swal.fire({
          title: "¡Usuario Actualizado!",
          text: "Usuario actualizado exitosamente.",
          icon: "success",
          timer: 3000, 
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
  
        onClose(); 
      })
      .catch((error) => {
        console.error("Error al actualizar el usuario:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el usuario. Intente nuevamente.",
          icon: "error",
        });
      });
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>Editar Usuario</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Nombre
            <input
              type="text"
              value={updatedUser.name}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, name: e.target.value })
              }
              placeholder="Nombre"
            />
          </label>
          <label>
            Correo electrónico
            <input
              type="email"
              value={updatedUser.email}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, email: e.target.value })
              }
              placeholder="Correo electrónico"
            />
          </label>
          <label>
            Rol
            <select
              value={updatedUser.role}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, role: e.target.value })
              }
            >
              <option value="USER">User</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
          <button type="submit" className="submit-button">
            Actualizar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
