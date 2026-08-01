import './Usuarios.css'
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EditarUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        fechaNacimiento: '',
    });
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL_USUARIOS}${id}`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar el usuario');
                }
                const data = await response.json();
                setForm({
                    nombre: data.nombre ?? '',
                    apellido: data.apellido ?? '',
                    email: data.email ?? '',
                    // El input date exige el formato yyyy-MM-dd
                    fechaNacimiento: (data.fechaNacimiento ?? '').slice(0, 10),
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchUser();
    }, [id]);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setGuardando(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL_USUARIOS}${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Number(id), ...form }),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }
            navigate('/usuarios');
        } catch (error) {
            setError(error.message);
        } finally {
            setGuardando(false);
        }
    }

  return (
    <section className="usuarios-module">
      <div className="usuarios-header">
        <h2>Editar usuario</h2>
      </div>

      {error && <p className="form-message is-error">{error}</p>}

      {cargando ? (
        <p className="form-loading">Cargando usuario...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={handleChange}
                disabled={guardando}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <Link to="/usuarios" className="button-secondary">Cancelar</Link>
          </div>
        </form>
      )}
    </section>
  )
}
