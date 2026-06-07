import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function AlunoLayout() {
  const navigate = useNavigate();
  const { usuarioLogadoId, usuarios, logout } = useEstudosStore();
  const usuario = usuarios.find(u => u.id === usuarioLogadoId);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ background: 'var(--surface)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/aluno/dashboard">
            <BookOpen size={28} className="text-primary" />
            <span className="fw-bold">EstudaAê</span>
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAluno" aria-controls="navbarNavAluno" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNavAluno">
            <ul className="navbar-nav ms-auto gap-2 align-items-lg-center">
              <li className="nav-item"><NavLink className="nav-link" to="/aluno/dashboard">Dashboard</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/aluno/assinaturas">Assinaturas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/aluno/certificados">Meus Certificados</NavLink></li>
              
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                <div className="d-flex align-items-center gap-3 p-2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                      <User size={16} />
                    </div>
                    <div className="d-flex flex-column">
                      <span className="text-white fw-bold" style={{ fontSize: '0.85rem', lineHeight: '1' }}>{usuario?.nome || 'Aluno'}</span>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>Logado</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-sm btn-outline-danger p-1" title="Sair da Conta">
                    <LogOut size={16} />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="d-flex flex-column flex-grow-1 p-3 p-md-4">
        <Outlet />
      </main>
    </>
  );
}
