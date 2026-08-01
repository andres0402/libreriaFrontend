import './Home.css'
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <header className="home-header">
      <h1>Bienvenido a la Gestión de Préstamos</h1>
      <p>Utiliza el menú para navegar entre las secciones de usuarios, libros y préstamos.</p>
      <nav className="home-nav">
        <NavLink to="/usuarios">Usuarios</NavLink>
        <NavLink to="/libros">Libros</NavLink>
        <NavLink to="/prestamos">Préstamos</NavLink>
      </nav>
    </header>
  );
}
