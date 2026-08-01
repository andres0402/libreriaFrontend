import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Usuarios from './usuarios/Usuarios'
import EditarUsuario from './usuarios/EditarUsuario'
import NuevoUsuario from './usuarios/NuevoUsuario'
import Libros from './libros/Libros'
import EditarLibro from './libros/EditarLibro'
import NuevoLibro from './libros/NuevoLibro'
import Prestamos from './prestamos/Prestamos'
import EditarPrestamo from './prestamos/EditarPrestamo'
import NuevoPrestamo from './prestamos/NuevoPrestamo'
import Home from './Home';

function App() {
  return (
    <>
      <BrowserRouter basename="/libreria">
      <Home/>
        <Routes>      
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/nuevo" element={<NuevoUsuario />} />
          <Route path="/usuarios/:id/editar" element={<EditarUsuario />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/libros/nuevo" element={<NuevoLibro />} />
          <Route path="/libros/:id/editar" element={<EditarLibro />} />
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />
          <Route path="/prestamos/:id/editar" element={<EditarPrestamo />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
