import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEstudosStore } from '../../store/useEstudosStore';
import { PlayCircle, Clock, BookOpen, User, Lock, CheckCircle, ArrowLeft, Star, MessageSquare } from 'lucide-react';

export default function CatalogoCursoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cursos, modulos, aulas, assinaturas, usuarioLogadoId, categorias, avaliacoes, usuarios } = useEstudosStore();

  const curso = cursos.find(c => c.id === id);
  const modulosCurso = modulos.filter(m => m.cursoId === id).sort((a, b) => a.ordem - b.ordem);
  const avaliacoesDoCurso = avaliacoes.filter(a => a.cursoId === id);
  const mediaAvaliacao = avaliacoesDoCurso.length > 0 
    ? (avaliacoesDoCurso.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoesDoCurso.length).toFixed(1) 
    : 'Sem avaliações';

  if (!curso) {
    return <div className="text-white text-center py-5">Curso não encontrado.</div>;
  }

  const temAssinatura = assinaturas.some(a => a.usuarioId === usuarioLogadoId && new Date(a.dataFim) > new Date());

  const handleComecar = () => {
    if (temAssinatura) {
      navigate(`/aluno/sala-aula/${curso.id}`);
    } else {
      navigate('/aluno/assinaturas', { state: { message: 'Você precisa de uma assinatura para acessar este curso.' } });
    }
  };

  return (
    <div className="container-fluid py-2 max-w-5xl mx-auto" style={{ maxWidth: '1000px' }}>
      <Link to="/aluno/dashboard" className="btn btn-link text-muted text-decoration-none p-0 mb-4 d-flex align-items-center gap-2">
        <ArrowLeft size={16} /> Voltar ao Dashboard
      </Link>

      {/* HEADER DO CURSO */}
      <div className="card border-0 bg-dark shadow-lg mb-5 overflow-hidden" style={{ borderRadius: '16px' }}>
        <div className="p-5 d-flex flex-column justify-content-end position-relative" style={{ minHeight: '300px', background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), linear-gradient(45deg, var(--primary-dark), var(--primary))' }}>
          <div className="position-relative" style={{ zIndex: 2 }}>
            <div className="d-flex gap-2 mb-3">
              <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25">
                {categorias.find(c => c.id === curso.categoria)?.nome || curso.categoria}
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-white">{curso.nivel}</span>
            </div>
            <h1 className="text-white fw-bold mb-3 display-5">{curso.titulo}</h1>
            <p className="text-white opacity-75 mb-4 fs-5" style={{ maxWidth: '700px' }}>{curso.descricao}</p>
            
            <div className="d-flex flex-wrap align-items-center gap-4 text-white opacity-75 mb-4">
              <span className="d-flex align-items-center gap-2 text-warning fw-bold"><Star size={18} fill="currentColor"/> {mediaAvaliacao}</span>
              <span className="d-flex align-items-center gap-2"><User size={18}/> {curso.instrutor}</span>
              <span className="d-flex align-items-center gap-2"><Clock size={18}/> {curso.totalHoras} horas</span>
              <span className="d-flex align-items-center gap-2"><BookOpen size={18}/> {curso.totalAulas} aulas</span>
            </div>

            <button onClick={handleComecar} className="btn btn-primary btn-lg fw-bold d-flex align-items-center gap-2 px-5 py-3 shadow">
              {temAssinatura ? <PlayCircle size={22} /> : <Lock size={22} />}
              {temAssinatura ? 'Começar a Assistir' : 'Assinar para Acessar'}
            </button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO DO CURSO */}
      <div className="row g-5">
        <div className="col-12 col-lg-8">
          <h4 className="text-white fw-bold mb-4">Conteúdo do Curso</h4>
          <div className="accordion accordion-flush" id="accordionModulos">
            {modulosCurso.map((modulo, idx) => {
              const aulasModulo = aulas.filter(a => a.moduloId === modulo.id).sort((a, b) => a.ordem - b.ordem);
              const isFirst = idx === 0;

              return (
                <div key={modulo.id} className="accordion-item bg-transparent border-0 mb-3">
                  <h2 className="accordion-header">
                    <button 
                      className={`accordion-button ${!isFirst ? 'collapsed' : ''} bg-dark text-white fw-bold rounded shadow-sm`} 
                      style={{ border: '1px solid var(--border-subtle)' }}
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#collapse-${modulo.id}`}
                    >
                      Módulo {modulo.ordem}: {modulo.titulo}
                      <span className="badge bg-secondary bg-opacity-25 text-muted ms-auto me-3">{aulasModulo.length} aulas</span>
                    </button>
                  </h2>
                  <div id={`collapse-${modulo.id}`} className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`} data-bs-parent="#accordionModulos">
                    <div className="accordion-body px-0 pt-2 pb-0">
                      <div className="list-group rounded-0">
                        {aulasModulo.map(aula => (
                          <div key={aula.id} className="list-group-item bg-dark bg-opacity-50 text-white d-flex align-items-center justify-content-between py-3 border-0 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
                            <div className="d-flex align-items-center gap-3">
                              <PlayCircle size={18} className="text-muted" />
                              <span>{aula.ordem}. {aula.titulo}</span>
                            </div>
                            <span className="small text-muted d-flex align-items-center gap-1">
                              <Clock size={14} /> {aula.duracaoMinutos} min
                            </span>
                          </div>
                        ))}
                        {aulasModulo.length === 0 && (
                          <div className="text-muted small py-3 px-3">Nenhuma aula cadastrada neste módulo.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {modulosCurso.length === 0 && (
              <div className="text-muted p-4 border rounded text-center bg-dark" style={{ borderColor: 'var(--border-subtle)' }}>Nenhum módulo cadastrado.</div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 bg-dark shadow-sm" style={{ borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div className="card-body p-4">
              <h5 className="text-white fw-bold mb-4">O que você vai aprender</h5>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                <li className="d-flex gap-3 text-muted">
                  <CheckCircle size={20} className="text-success flex-shrink-0" />
                  <span>Conceitos avançados estruturados em módulos práticos.</span>
                </li>
                <li className="d-flex gap-3 text-muted">
                  <CheckCircle size={20} className="text-success flex-shrink-0" />
                  <span>Metodologia passo a passo direto ao ponto.</span>
                </li>
                <li className="d-flex gap-3 text-muted">
                  <CheckCircle size={20} className="text-success flex-shrink-0" />
                  <span>Certificado oficial de conclusão digital.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* AVALIAÇÕES */}
          <div className="card border-0 bg-dark shadow-sm mt-4" style={{ borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div className="card-body p-4">
              <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <MessageSquare size={20} className="text-primary"/> Avaliações
              </h5>
              
              <div className="d-flex flex-column gap-3">
                {avaliacoesDoCurso.map(av => (
                  <div key={av.id} className="p-3 bg-dark border rounded" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-white small">
                        {usuarios.find(u => u.id === av.usuarioId)?.nome || 'Aluno'}
                      </span>
                      <div className="d-flex text-warning">
                        {[1,2,3,4,5].map(n => <Star key={n} size={14} fill={n <= av.nota ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    {av.comentario && <p className="text-muted small mb-0 font-italic">"{av.comentario}"</p>}
                    <div className="text-muted mt-2" style={{ fontSize: '0.65rem' }}>{new Date(av.dataAvaliacao).toLocaleDateString()}</div>
                  </div>
                ))}
                {avaliacoesDoCurso.length === 0 && (
                  <div className="text-muted small text-center p-3 border border-secondary border-opacity-25 rounded bg-dark bg-opacity-50">
                    Nenhum aluno avaliou este curso ainda.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
