import './Prestamos.css'
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EditarPrestamo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [libros, setLibros] = useState([]);
    const [form, setForm] = useState({
        fechaPrestamo: '',
        fechaDevolucion: '',
        usuario: '',
        libro: '',
        estadoPrestamo: '',
    });
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoan = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL_PRESTAMOS}${id}`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar el préstamo');
                }
                const data = await response.json();
                setForm({
                    // El input date exige el formato yyyy-MM-dd
                    fechaPrestamo: (data.fechaPrestamo ?? '').slice(0, 10),
                    fechaDevolucion: (data.fechaDevolucion ?? '').slice(0, 10),
                    // El value del desplegable se compara como texto
                    usuario: String(data.usuario ?? ''),
                    libro: String(data.libro ?? ''),
                    estadoPrestamo: data.estadoPrestamo ?? '',
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchLoan();
    }, [id]);

    useEffect(() => {
        // Listas para poblar los desplegables de usuario y libro
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
                console.error('Error fetching opciones de préstamo:', error);
            }
        };

        fetchOpciones();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setGuardando(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL_PRESTAMOS}${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // Los desplegables guardan el id como texto; la API espera el id numérico
                body: JSON.stringify({
                    id: Number(id),
                    ...form,
                    usuario: Number(form.usuario),
                    libro: Number(form.libro),
                }),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el préstamo');
            }
            navigate('/prestamos');
        } catch (error) {
            setError(error.message);
        } finally {
            setGuardando(false);
        }
    }

  return (
    <section className="prestamos-module">
      <div className="prestamos-header">
        <h2>Editar préstamo</h2>
      </div>

      {error && <p className="form-message is-error">{error}</p>}

      {cargando ? (
        <p className="form-loading">Cargando préstamo...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="fechaPrestamo">Fecha de préstamo</label>
              <input
                id="fechaPrestamo"
                name="fechaPrestamo"
                type="date"
                value={form.fechaPrestamo}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="fechaDevolucion">Fecha de devolución</label>
              <input
                id="fechaDevolucion"
                name="fechaDevolucion"
                type="date"
                value={form.fechaDevolucion}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="usuario">Usuario</label>
              <select
                id="usuario"
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                disabled={guardando}
                required
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="libro">Libro</label>
              <select
                id="libro"
                name="libro"
                value={form.libro}
                onChange={handleChange}
                disabled={guardando}
                required
              >
                <option value="">Selecciona un libro</option>
                {libros.map((libro) => (
                  <option key={libro.id} value={libro.id}>
                    {libro.titulo}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="estadoPrestamo">Estado del préstamo</label>
              <select
                id="estadoPrestamo"
                name="estadoPrestamo"
                value={form.estadoPrestamo}
                onChange={handleChange}
                disabled={guardando}
              >
                <option value="">Selecciona un estado</option>
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="PRESTADO">PRESTADO</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <Link to="/prestamos" className="button-secondary">Cancelar</Link>
          </div>
        </form>
      )}
    </section>
  )
}
