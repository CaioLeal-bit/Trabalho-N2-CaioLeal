import { NavLink, Link, Outlet } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';

export default function AdminLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin/cursos">
            <BookOpen size={28} className="text-primary" />
            <span className="fw-bold">EstudaAê <span className="text-primary" style={{fontSize: '0.7em'}}>ADMIN</span></span>
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-2">
              <li className="nav-item"><NavLink className="nav-link" to="/admin/categorias">Categorias</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/cursos">Cursos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/modulos">Módulos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/aulas">Aulas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/trilhas">Trilhas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/usuarios">Usuários</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/planos">Planos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/assinaturas">Assinaturas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/certificados">Certificados</NavLink></li>
            </ul>
            <Link to="/" className="btn btn-outline-danger btn-sm ms-lg-4 d-flex align-items-center gap-2 mt-3 mt-lg-0">
              <LogOut size={16} /> Sair
            </Link>
          </div>
        </div>
      </nav>

      <main className="d-flex flex-column flex-grow-1 p-3">
        <Outlet />
      </main>
    </>
  );
}
