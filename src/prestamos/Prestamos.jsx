import './Prestamos.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrashIcon from '../TrashIcon';
import PencilIcon from '../PencilIcon';

export default function Prestamos() {
    const [loans, setLoans] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [libros, setLibros] = useState([]);
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [filtroLibro, setFiltroLibro] = useState('');

    useEffect(() => {
        const fetchLoans = async () => {
            const base = import.meta.env.VITE_API_URL_PRESTAMOS;
            let url = base;
            if (filtroUsuario) {
                url = `${base}usuario/${filtroUsuario}`;
            } else if (filtroLibro) {
                url = `${base}libro/${filtroLibro}`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();
                // La API no tiene un endpoint que combine los dos filtros: cuando ambos
                // están activos se consulta por usuario y se refina por libro en el cliente
                setLoans(
                    filtroUsuario && filtroLibro
                        ? data.filter((loan) => String(loan.libro) === filtroLibro)
                        : data
                );
            } catch (error) {
                console.error('Error fetching loans:', error);
            }
        };

        fetchLoans();
    }, [filtroUsuario, filtroLibro]);

    useEffect(() => {
        const fetchOpciones = async () => {
            try {
                const [responseUsuarios, responseLibros] = await Promise.all([
                    fetch(import.meta.env.VITE_API_URL_USUARIOS),
                    fetch(import.meta.env.VITE_API_URL_LIBROS),
                ]);
                if (responseUsuarios.ok) {
                    setUsuarios(await responseUsuarios.json());
                }
                if (responseLibros.ok) {
                    setLibros(await responseLibros.json());
                }
            } catch (error) {
                console.error('Error fetching opciones de filtro:', error);
            }
        };

        fetchOpciones();
    }, []);

    function handleFiltroUsuario(event) {
        setFiltroUsuario(event.target.value);
    }

    function handleFiltroLibro(event) {
        setFiltroLibro(event.target.value);
    }

    function handleLimpiarFiltros() {
        setFiltroUsuario('');
        setFiltroLibro('');
    }

    function handleDeleteLoan(loanId) {
        if (!confirm('¿Seguro que deseas eliminar este préstamo?')) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL_PRESTAMOS}${loanId}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al eliminar el préstamo');
            }
            // Actualizar la lista de préstamos después de eliminar
            setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== loanId));
        })
        .catch((error) => {
            alert(`Error al eliminar el préstamo: ${error.message}`);
        });
    }

  return (
    <section className="prestamos-module">
      <div className="module-toolbar">
        <div className="prestamos-header">
          <h2>Gestión de préstamos</h2>
          <p>Administra los préstamos activos y finalizados.</p>
        </div>
        <Link to="/prestamos/nuevo" className="button-primary" title="Agregar nuevo préstamo">
          Agregar préstamo
        </Link>
      </div>

      <div className="filtros-bar">
        <div className="form-field">
          <label htmlFor="filtroUsuario">Filtrar por usuario</label>
          <select id="filtroUsuario" value={filtroUsuario} onChange={handleFiltroUsuario}>
            <option value="">Todos los usuarios</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} {usuario.apellido}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="filtroLibro">Filtrar por libro</label>
          <select id="filtroLibro" value={filtroLibro} onChange={handleFiltroLibro}>
            <option value="">Todos los libros</option>
            {libros.map((libro) => (
              <option key={libro.id} value={libro.id}>
                {libro.titulo}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={handleLimpiarFiltros}
          disabled={!filtroUsuario && !filtroLibro}
        >
          Limpiar
        </button>
      </div>

      <div className="prestamos-table-container">
        <table className="prestamos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha de préstamo</th>
              <th>Fecha de devolución</th>
              <th>Usuario</th>
              <th>ID libro</th>
              <th>Estado del préstamo</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 && (
              <tr>
                <td className="prestamos-empty" colSpan={7}>
                  {filtroUsuario || filtroLibro
                    ? 'No hay préstamos que coincidan con el filtro.'
                    : 'No hay préstamos registrados.'}
                </td>
              </tr>
            )}
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.fechaPrestamo}</td>
                <td>{loan.fechaDevolucion}</td>
                <td>{loan.usuario}</td>
                <td>{loan.libro}</td>
                <td>{loan.estadoPrestamo}</td>
                <td className="col-acciones">
                  <div className="acciones-group">
                    <Link
                      to={`/prestamos/${loan.id}/editar`}
                      className="button-edit"
                      title="Editar préstamo"
                      aria-label={`Editar préstamo ${loan.id}`}
                    >
                      <PencilIcon />
                    </Link>
                    <button
                      className="button-delete"
                      title="Eliminar préstamo"
                      aria-label={`Eliminar préstamo ${loan.id}`}
                      onClick={() => handleDeleteLoan(loan.id)}
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
