import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

// Pages
import Trilhas from './pages/Trilhas'
import Cursos from './pages/Cursos'
import Modulos from './pages/Modulos'
import Aulas from './pages/Aulas'
import Usuarios from './pages/Usuarios'
import Assinaturas from './pages/Assinaturas'
import Certificados from './pages/Certificados'
import DetalhesCurso from './pages/DetalhesCurso'

import './App.css'

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <BookOpen size={28} />
            <span>EstudaAê</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-2">
              <li className="nav-item"><NavLink className="nav-link" to="/trilhas">Trilhas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/cursos">Cursos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/modulos">Módulos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/aulas">Aulas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/usuarios">Usuários</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/assinaturas">Assinaturas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/certificados">Certificados</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="d-flex flex-column flex-grow-1 p-3">
        <Routes>
          <Route path="/" element={<Navigate to="/cursos" replace />} />
          <Route path="/trilhas" element={<Trilhas />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<DetalhesCurso />} />
          <Route path="/modulos" element={<Modulos />} />
          <Route path="/aulas" element={<Aulas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/assinaturas" element={<Assinaturas />} />
          <Route path="/certificados" element={<Certificados />} />
        </Routes>
      </main>
    </>
  )
}

export default App
