import './Libros.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrashIcon from '../TrashIcon';
import PencilIcon from '../PencilIcon';


export default function Libros() {
    const [books, setBooks] = useState([]);
    const [isbn, setIsbn] = useState('');
    const [isbnFiltrado, setIsbnFiltrado] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            // Con ISBN se consultan solo los ejemplares disponibles (sin préstamo activo)
            const url = isbnFiltrado
                ? `${import.meta.env.VITE_API_URL_PRESTAMOS}disponibles?isbn=${encodeURIComponent(isbnFiltrado)}`
                : import.meta.env.VITE_API_URL_LIBROS;

            try {
                const response = await fetch(url);
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, [isbnFiltrado]);

    function handleBuscarDisponibles(event) {
        event.preventDefault();
        setIsbnFiltrado(isbn.trim());
    }

    function handleLimpiarFiltro() {
        setIsbn('');
        setIsbnFiltrado('');
    }

    function handleDeleteBook(bookId) {
        if (!confirm('¿Seguro que deseas eliminar este libro?')) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL_LIBROS}${bookId}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al eliminar el libro');
            }
            // Actualizar la lista de libros después de eliminar
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        })
        .catch((error) => {
            alert(`Error al eliminar el libro: ${error.message}`);
        });
    }

  return (
    <section className="libros-module">
      <div className="module-toolbar">
        <div className="libros-header">
          <h2>Gestión de libros</h2>
          <p>Administra los libros disponibles en la biblioteca.</p>
        </div>
        <Link to="/libros/nuevo" className="button-primary" title="Agregar nuevo libro">
          Agregar libro
        </Link>
      </div>

      <form className="filtros-bar" onSubmit={handleBuscarDisponibles}>
        <div className="form-field">
          <label htmlFor="isbn">Ejemplares disponibles por ISBN</label>
          <input
            id="isbn"
            value={isbn}
            onChange={(event) => setIsbn(event.target.value)}
            placeholder="Ej. 978-3-16-148410-0"
          />
        </div>
        <button type="submit" className="button-primary" disabled={!isbn.trim()}>
          Buscar
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={handleLimpiarFiltro}
          disabled={!isbnFiltrado && !isbn}
        >
          Limpiar
        </button>
      </form>

      {isbnFiltrado && (
        <p className="filtros-nota">
          Mostrando ejemplares disponibles con ISBN <strong>{isbnFiltrado}</strong>.
        </p>
      )}

      <div className="libros-table-container">
        <table className="libros-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>ISBN</th>
              <th>Edición</th>
              <th>Fecha de publicación</th>
              <th>Autor</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 && (
              <tr>
                <td className="libros-empty" colSpan={7}>
                  {isbnFiltrado
                    ? 'No hay ejemplares disponibles con ese ISBN.'
                    : 'No hay libros registrados.'}
                </td>
              </tr>
            )}
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.titulo}</td>
                <td>{book.isbn}</td>
                <td>{book.edicion}</td>
                <td>{book.fechaPublicacion}</td>
                <td>{book.autor}</td>
                <td className="col-acciones">
                  <div className="acciones-group">
                    <Link
                      to={`/libros/${book.id}/editar`}
                      className="button-edit"
                      title="Editar libro"
                      aria-label={`Editar libro ${book.titulo}`}
                    >
                      <PencilIcon />
                    </Link>
                    <button
                      className="button-delete"
                      title="Eliminar libro"
                      aria-label={`Eliminar libro ${book.titulo}`}
                      onClick={() => handleDeleteBook(book.id)}
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
