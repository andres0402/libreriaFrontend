import './Libros.css'
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EditarLibro() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        titulo: '',
        isbn: '',
        edicion: '',
        fechaPublicacion: '',
        autor: '',
    });
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL_LIBROS}${id}`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar el libro');
                }
                const data = await response.json();
                setForm({
                    titulo: data.titulo ?? '',
                    isbn: data.isbn ?? '',
                    edicion: data.edicion ?? '',
                    // El input date exige el formato yyyy-MM-dd
                    fechaPublicacion: (data.fechaPublicacion ?? '').slice(0, 10),
                    autor: data.autor ?? '',
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchBook();
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
            const response = await fetch(`${import.meta.env.VITE_API_URL_LIBROS}${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Number(id), ...form }),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el libro');
            }
            navigate('/libros');
        } catch (error) {
            setError(error.message);
        } finally {
            setGuardando(false);
        }
    }

  return (
    <section className="libros-module">
      <div className="libros-header">
        <h2>Editar libro</h2>
      </div>

      {error && <p className="form-message is-error">{error}</p>}

      {cargando ? (
        <p className="form-loading">Cargando libro...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="titulo">Título</label>
              <input
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="isbn">ISBN</label>
              <input
                id="isbn"
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="edicion">Edición</label>
              <input
                id="edicion"
                name="edicion"
                value={form.edicion}
                onChange={handleChange}
                disabled={guardando}
              />
            </div>
            <div className="form-field">
              <label htmlFor="fechaPublicacion">Fecha de publicación</label>
              <input
                id="fechaPublicacion"
                name="fechaPublicacion"
                type="date"
                value={form.fechaPublicacion}
                onChange={handleChange}
                disabled={guardando}
              />
            </div>
            <div className="form-field">
              <label htmlFor="autor">Autor</label>
              <input
                id="autor"
                name="autor"
                value={form.autor}
                onChange={handleChange}
                disabled={guardando}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <Link to="/libros" className="button-secondary">Cancelar</Link>
          </div>
        </form>
      )}
    </section>
  )
}
