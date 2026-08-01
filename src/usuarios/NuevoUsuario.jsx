import './Usuarios.css'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function NuevoUsuario() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        fechaNacimiento: '',
    });
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setGuardando(true);
        setError(null);

        try {
            const response = await fetch(import.meta.env.VITE_API_URL_USUARIOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!response.ok) {
                throw new Error('Error al crear el usuario');
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
        <h2>Nuevo usuario</h2>
        <p>Completa los datos para registrar un usuario.</p>
      </div>

      {error && <p className="form-message is-error">{error}</p>}

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
            {guardando ? 'Guardando...' : 'Crear usuario'}
          </button>
          <Link to="/usuarios" className="button-secondary">Cancelar</Link>
        </div>
      </form>
    </section>
  )
}
