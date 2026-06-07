import { Link } from 'react-router-dom';
import { useEstudosStore } from '../../store/useEstudosStore';
import { PlayCircle, Bookmark, Route, ArrowRight, Clock, Star, BookOpen } from 'lucide-react';

export default function AlunoDashboard() {
  const { usuarioLogadoId, cursos, trilhas, modulos, aulas, progressos } = useEstudosStore();

  // Encontrar cursos em andamento (Continue Assistindo)
  const cursosEmAndamento = cursos.filter(curso => {
    const modulosCurso = modulos.filter(m => m.cursoId === curso.id);
    const aulasCurso = aulas.filter(a => modulosCurso.some(m => m.id === a.moduloId));
    
    let temProgresso = false;
    let todoConcluido = true;

    if (aulasCurso.length === 0) return false;

    for (const aula of aulasCurso) {
      const p = progressos.find(prog => prog.usuarioId === usuarioLogadoId && prog.aulaId === aula.id);
      if (p && p.status !== 'Nao Iniciado') {
        temProgresso = true;
      }
      if (!p || p.status !== 'Concluido') {
        todoConcluido = false;
      }
    }

    return temProgresso && !todoConcluido;
  });

  return (
    <div className="container-fluid py-2">
      
      {/* HEADER BEM-VINDO */}
      <div className="mb-5">
        <h2 className="fw-bold text-white mb-2">Bem-vindo de volta!</h2>
        <p className="text-muted">Pronto para continuar seus estudos hoje?</p>
      </div>

      {/* CONTINUE ASSISTINDO */}
      {cursosEmAndamento.length > 0 && (
        <div className="mb-5">
          <h4 className="d-flex align-items-center gap-2 text-white mb-4">
            <PlayCircle size={22} className="text-primary" />
            Continue Assistindo
          </h4>
          <div className="row g-4">
            {cursosEmAndamento.map(curso => {
              const modulosCurso = modulos.filter(m => m.cursoId === curso.id);
              const aulasCurso = aulas.filter(a => modulosCurso.some(m => m.id === a.moduloId));
              const aulasConcluidas = aulasCurso.filter(a => 
                progressos.some(p => p.usuarioId === usuarioLogadoId && p.aulaId === a.id && p.status === 'Concluido')
              ).length;
              const porcentagem = aulasCurso.length > 0 ? Math.round((aulasConcluidas / aulasCurso.length) * 100) : 0;

              return (
                <div key={curso.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 bg-dark hover-lift transition-all" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="position-relative" style={{ height: '140px', background: 'linear-gradient(45deg, var(--primary-dark), var(--primary))' }}>
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <PlayCircle size={48} className="text-white opacity-75" />
                      </div>
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="text-white fw-bold mb-1 text-truncate">{curso.titulo}</h5>
                      <span className="text-muted small mb-3">{curso.instrutor}</span>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small text-muted">{porcentagem}% concluído</span>
                          <span className="small text-muted">{aulasConcluidas}/{aulasCurso.length} aulas</span>
                        </div>
                        <div className="progress mb-3" style={{ height: '6px', background: 'var(--border-subtle)' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${porcentagem}%` }}></div>
                        </div>
                        <Link to={`/aluno/sala-aula/${curso.id}`} className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2 fw-bold">
                          Retomar <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CATÁLOGO DE CURSOS */}
      <div className="mb-5">
        <h4 className="d-flex align-items-center gap-2 text-white mb-4">
          <Bookmark size={22} className="text-info" />
          Cursos Disponíveis
        </h4>
        <div className="row g-4">
          {cursos.map(curso => (
            <div key={curso.id} className="col-12 col-md-4 col-lg-3">
              <Link to={`/aluno/cursos/${curso.id}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm border-0 bg-dark hover-lift transition-all" style={{ borderRadius: '12px' }}>
                  <div className="p-3 bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style={{ height: '120px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                    <BookOpen size={40} className="text-info opacity-50" />
                  </div>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25">{curso.categoria}</span>
                      <span className="badge bg-secondary bg-opacity-25 text-white">{curso.nivel}</span>
                    </div>
                    <h6 className="text-white fw-bold mb-1 text-truncate">{curso.titulo}</h6>
                    <p className="text-muted small mb-3 text-truncate">{curso.instrutor}</p>
                    
                    <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '0.8rem' }}>
                      <span className="d-flex align-items-center gap-1"><Clock size={14}/> {curso.totalHoras}h</span>
                      <span className="d-flex align-items-center gap-1"><PlayCircle size={14}/> {curso.totalAulas} aulas</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {cursos.length === 0 && (
            <div className="col-12 text-center text-muted py-4">Nenhum curso disponível.</div>
          )}
        </div>
      </div>

      {/* CATÁLOGO DE TRILHAS */}
      <div className="mb-5">
        <h4 className="d-flex align-items-center gap-2 text-white mb-4">
          <Route size={22} className="text-warning" />
          Trilhas de Especialização
        </h4>
        <div className="row g-4">
          {trilhas.map(trilha => (
            <div key={trilha.id} className="col-12 col-md-6 col-lg-4">
              <Link to={`/aluno/trilhas/${trilha.id}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm border-0 bg-dark hover-lift transition-all" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-2 rounded bg-warning bg-opacity-25 text-warning">
                        <Star size={24} />
                      </div>
                      <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25">{trilha.categoria}</span>
                    </div>
                    <h5 className="text-white fw-bold mb-2">{trilha.titulo}</h5>
                    <p className="text-muted small mb-0 text-truncate">{trilha.descricao}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {trilhas.length === 0 && (
            <div className="col-12 text-center text-muted py-4">Nenhuma trilha disponível.</div>
          )}
        </div>
      </div>

    </div>
  );
}
