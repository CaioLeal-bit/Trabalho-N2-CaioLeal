import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ToastContainer from './components/ToastContainer';
import { useEstudosStore } from './store/useEstudosStore';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import AlunoLayout from './layouts/AlunoLayout';

// Root Pages
import SelecaoPerfil from './pages/SelecaoPerfil';

// Aluno Pages
import AlunoDashboard from './pages/aluno/AlunoDashboard';
import CatalogoCursoDetalhes from './pages/aluno/CatalogoCursoDetalhes';
import CatalogoTrilhaDetalhes from './pages/aluno/CatalogoTrilhaDetalhes';
import AlunoAssinaturas from './pages/aluno/AlunoAssinaturas';
import SalaDeAula from './pages/aluno/SalaDeAula';
import AlunoCertificados from './pages/aluno/AlunoCertificados';

// Admin Pages
import Categorias from './pages/Categorias';
import Trilhas from './pages/Trilhas';
import Cursos from './pages/Cursos';
import Modulos from './pages/Modulos';
import Aulas from './pages/Aulas';
import Usuarios from './pages/Usuarios';
import Assinaturas from './pages/Assinaturas';
import Certificados from './pages/Certificados';
import DetalhesCurso from './pages/DetalhesCurso';
import Planos from './pages/Planos';

import './App.css';

function App() {
  const { fetchInitialData } = useEstudosStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <>
      <ToastContainer />
      <Routes>
      <Route path="/" element={<SelecaoPerfil />} />
      
      {/* Rotas de Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="cursos" replace />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="trilhas" element={<Trilhas />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="cursos/:id" element={<DetalhesCurso />} />
        <Route path="modulos" element={<Modulos />} />
        <Route path="aulas" element={<Aulas />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="planos" element={<Planos />} />
        <Route path="assinaturas" element={<Assinaturas />} />
        <Route path="certificados" element={<Certificados />} />
      </Route>

      {/* Rotas do Aluno */}
      <Route path="/aluno" element={<AlunoLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AlunoDashboard />} />
        <Route path="cursos/:id" element={<CatalogoCursoDetalhes />} />
        <Route path="trilhas/:id" element={<CatalogoTrilhaDetalhes />} />
        <Route path="assinaturas" element={<AlunoAssinaturas />} />
        <Route path="sala-aula/:id" element={<SalaDeAula />} />
        <Route path="certificados" element={<AlunoCertificados />} />
        {/* Futuras rotas de LMS ficarão aqui */}
      </Route>
    </Routes>
    </>
  );
}

export default App;
