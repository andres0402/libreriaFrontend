import './Usuarios.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrashIcon from '../TrashIcon';
import PencilIcon from '../PencilIcon';


export default function Usuarios() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL_USUARIOS);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    function handleDeleteUser(userId) {
        if (!confirm('¿Seguro que deseas eliminar este usuario?')) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL_USUARIOS}${userId}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }
            // Actualizar la lista de usuarios después de eliminar
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        })
        .catch((error) => {
            alert(`Error al eliminar el usuario: ${error.message}`);
        });
    }

  return (
    <section className="usuarios-module">
      <div className="module-toolbar">
        <div className="usuarios-header">
          <h2>Gestión de usuarios</h2>
          <p>Administra los usuarios del sistema desde esta vista.</p>
        </div>
        <Link to="/usuarios/nuevo" className="button-primary" title="Agregar nuevo usuario">
          Agregar usuario
        </Link>
      </div>

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Fecha de nacimiento</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.email}</td>
                <td>{user.fechaNacimiento}</td>
                <td className="col-acciones">
                  <div className="acciones-group">
                    <Link
                      to={`/usuarios/${user.id}/editar`}
                      className="button-edit"
                      title="Editar usuario"
                      aria-label={`Editar usuario ${user.nombre} ${user.apellido}`}
                    >
                      <PencilIcon />
                    </Link>
                    <button
                      className="button-delete"
                      title="Eliminar usuario"
                      aria-label={`Eliminar usuario ${user.nombre} ${user.apellido}`}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
