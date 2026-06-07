import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEstudosStore } from '../../store/useEstudosStore';
import { Route as RouteIcon, Star, PlayCircle, Clock, BookOpen, Lock, ArrowLeft } from 'lucide-react';

export default function CatalogoTrilhaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trilhas, trilhasCursos, cursos, assinaturas, usuarioLogadoId } = useEstudosStore();

  const trilha = trilhas.find(t => t.id === id);
  const cursosDaTrilha = trilhasCursos
    .filter(tc => tc.trilhaId === id)
    .sort((a, b) => a.ordem - b.ordem)
    .map(tc => {
      const c = cursos.find(c => c.id === tc.cursoId);
      return { ...tc, cursoObj: c };
    })
    .filter(tc => tc.cursoObj !== undefined);

  if (!trilha) {
    return <div className="text-white text-center py-5">Trilha não encontrada.</div>;
  }

  const temAssinatura = assinaturas.some(a => a.usuarioId === usuarioLogadoId && new Date(a.dataFim) > new Date());
  
  const totalCursos = cursosDaTrilha.length;
  const totalHoras = cursosDaTrilha.reduce((acc, tc) => acc + (tc.cursoObj?.totalHoras || 0), 0);

  const handleComecar = () => {
    if (cursosDaTrilha.length === 0) return;
    
    if (temAssinatura) {
      // Inicia pelo primeiro curso da trilha
      navigate(`/aluno/sala-aula/${cursosDaTrilha[0].cursoId}`);
    } else {
      navigate('/aluno/assinaturas', { state: { message: 'Você precisa de uma assinatura para acessar esta trilha.' } });
    }
  };

  return (
    <div className="container-fluid py-2 max-w-5xl mx-auto" style={{ maxWidth: '1000px' }}>
      <Link to="/aluno/dashboard" className="btn btn-link text-muted text-decoration-none p-0 mb-4 d-flex align-items-center gap-2">
        <ArrowLeft size={16} /> Voltar ao Dashboard
      </Link>

      {/* HEADER DA TRILHA */}
      <div className="card border-0 bg-dark shadow-lg mb-5 overflow-hidden" style={{ borderRadius: '16px' }}>
        <div className="p-5 d-flex flex-column justify-content-end position-relative" style={{ minHeight: '300px', background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), linear-gradient(45deg, var(--warning), #ff6b6b)' }}>
          <div className="position-relative" style={{ zIndex: 2 }}>
            <div className="d-flex gap-2 mb-3">
              <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25 d-flex align-items-center gap-1">
                <Star size={12} /> Trilha Especializada
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-white">{trilha.categoria}</span>
            </div>
            <h1 className="text-white fw-bold mb-3 display-5">{trilha.titulo}</h1>
            <p className="text-white opacity-75 mb-4 fs-5" style={{ maxWidth: '700px' }}>{trilha.descricao}</p>
            
            <div className="d-flex flex-wrap align-items-center gap-4 text-white opacity-75 mb-4">
              <span className="d-flex align-items-center gap-2"><RouteIcon size={18}/> {totalCursos} cursos sequenciais</span>
              <span className="d-flex align-items-center gap-2"><Clock size={18}/> ~{totalHoras} horas de conteúdo</span>
            </div>

            <button onClick={handleComecar} className="btn btn-light btn-lg fw-bold d-flex align-items-center gap-2 px-5 py-3 shadow" disabled={cursosDaTrilha.length === 0}>
              {temAssinatura ? <PlayCircle size={22} className="text-dark" /> : <Lock size={22} className="text-dark" />}
              {temAssinatura ? 'Iniciar Trilha' : 'Assinar para Acessar'}
            </button>
          </div>
        </div>
      </div>

      {/* ROTEIRO DA TRILHA */}
      <h4 className="text-white fw-bold mb-4">Roteiro de Formação</h4>
      <div className="position-relative ps-4 ms-2">
        {/* Linha vertical da trilha */}
        <div className="position-absolute top-0 bottom-0" style={{ left: '0', width: '2px', background: 'var(--border-subtle)', marginLeft: '24px' }}></div>
        
        <div className="d-flex flex-column gap-4">
          {cursosDaTrilha.map((tc, idx) => (
            <div key={tc.id} className="position-relative">
              {/* Ponto na linha */}
              <div className="position-absolute rounded-circle bg-warning d-flex align-items-center justify-content-center border border-4 border-dark" 
                   style={{ width: '24px', height: '24px', left: '-33px', top: '24px', zIndex: 2 }}>
                <span className="text-dark fw-bold" style={{ fontSize: '10px' }}>{idx + 1}</span>
              </div>
              
              <div className="card border-0 bg-dark hover-lift transition-all" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center gap-4">
                  <div className="rounded bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                    <BookOpen size={32} className="text-muted" />
                  </div>
                  
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-secondary bg-opacity-25 text-muted">Passo {idx + 1}</span>
                      <h5 className="text-white fw-bold mb-0">{tc.cursoObj?.titulo}</h5>
                    </div>
                    <p className="text-muted small mb-0">{tc.cursoObj?.descricao}</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Link to={`/aluno/cursos/${tc.cursoId}`} className="btn btn-outline-secondary">
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {cursosDaTrilha.length === 0 && (
            <div className="text-muted py-4">Nenhum curso associado a esta trilha ainda.</div>
          )}
        </div>
      </div>
    </div>
  );
}
