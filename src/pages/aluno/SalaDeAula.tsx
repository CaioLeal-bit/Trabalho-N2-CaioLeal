import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEstudosStore } from '../../store/useEstudosStore';
import { PlayCircle, CheckCircle, Circle, ArrowLeft, ListVideo, Star } from 'lucide-react';

export default function SalaDeAula() {
  const { id } = useParams(); // ID do curso
  const navigate = useNavigate();
  const { cursos, modulos, aulas, progressos, atualizarProgresso, usuarioLogadoId, assinaturas, avaliacoes, addAvaliacao, addToast } = useEstudosStore();

  const [aulaAtualId, setAulaAtualId] = useState<string | null>(null);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');

  const curso = cursos.find(c => c.id === id);
  const modulosCurso = modulos.filter(m => m.cursoId === id).sort((a, b) => a.ordem - b.ordem);

  const temAssinatura = assinaturas.some(a => a.usuarioId === usuarioLogadoId && new Date(a.dataFim) > new Date());

  useEffect(() => {
    // Redireciona se não tiver assinatura ativa
    if (!temAssinatura && assinaturas.length > 0) { // garante que terminou de carregar a store
      navigate('/aluno/assinaturas');
    }
  }, [temAssinatura, navigate, assinaturas.length]);

  useEffect(() => {
    // Auto-selecionar primeira aula se nenhuma estiver selecionada
    if (!aulaAtualId && modulosCurso.length > 0) {
      const primeiroModulo = modulosCurso[0];
      const aulasPrimeiro = aulas.filter(a => a.moduloId === primeiroModulo.id).sort((a, b) => a.ordem - b.ordem);
      if (aulasPrimeiro.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAulaAtualId(aulasPrimeiro[0].id);
      }
    }
  }, [aulaAtualId, modulosCurso, aulas]);

  if (!curso || !temAssinatura) {
    return <div className="text-white text-center py-5">Carregando sala de aula...</div>;
  }

  const aulaAtual = aulas.find(a => a.id === aulaAtualId);
  const progressoAulaAtual = progressos.find(p => p.usuarioId === usuarioLogadoId && p.aulaId === aulaAtualId);
  const isConcluida = progressoAulaAtual?.status === 'Concluido';

  const toggleConcluido = () => {
    if (!aulaAtualId) return;
    const novoStatus = isConcluida ? 'Nao Iniciado' : 'Concluido';
    atualizarProgresso(aulaAtualId, novoStatus);
  };

  const jaAvaliou = avaliacoes.some(a => a.usuarioId === usuarioLogadoId && a.cursoId === id);

  const handleAvaliar = () => {
    if (!usuarioLogadoId || !id) return;
    addAvaliacao({ usuarioId: usuarioLogadoId, cursoId: id, nota, comentario });
    addToast('Avaliação enviada com sucesso!', 'success');
    setShowAvaliacaoModal(false);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    // Transformar youtube watch url to embed url
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0`;
    }
    return null;
  };

  const embedUrl = aulaAtual ? getEmbedUrl(aulaAtual.url) : null;

  return (
    <div className="container-fluid py-0 px-0 h-100 d-flex flex-column" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Topbar da Sala */}
      <div className="d-flex align-items-center justify-content-between p-3 bg-dark border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
        <div className="d-flex align-items-center gap-3">
          <Link to="/aluno/dashboard" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
            <ArrowLeft size={16} /> Voltar
          </Link>
          <div className="d-none d-md-block">
            <h5 className="text-white mb-0 fw-bold">{curso.titulo}</h5>
            <span className="text-muted small">Sala de Aula</span>
          </div>
        </div>
        <div>
          {!jaAvaliou ? (
            <button className="btn btn-warning btn-sm fw-bold shadow-sm d-flex align-items-center gap-2" onClick={() => setShowAvaliacaoModal(true)}>
              <Star size={16} fill="currentColor" /> Avaliar Curso
            </button>
          ) : (
            <span className="badge bg-warning text-dark d-flex align-items-center gap-1 p-2">
              <Star size={14} fill="currentColor" /> Curso Avaliado
            </span>
          )}
        </div>
      </div>

      <div className="row g-0 flex-grow-1">
        {/* PLAYER E DETALHES */}
        <div className="col-12 col-lg-8 d-flex flex-column" style={{ background: '#000' }}>
          {/* PLAYER (ASPECT RATIO 16:9) */}
          <div className="w-100 position-relative" style={{ paddingTop: '56.25%', background: '#111' }}>
            {aulaAtual ? (
              embedUrl ? (
                <iframe
                  className="position-absolute top-0 start-0 w-100 h-100 border-0"
                  src={embedUrl}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <PlayCircle size={64} className="text-muted mb-3 opacity-50" />
                  <h4 className="text-white fw-bold">{aulaAtual.titulo}</h4>
                  <p className="text-muted">O link fornecido ({aulaAtual.url}) não é um link válido do YouTube para incorporação automática.</p>
                  <a href={aulaAtual.url} target="_blank" rel="noreferrer" className="btn btn-primary mt-3">Abrir Link Externo</a>
                </div>
              )
            ) : (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                Selecione uma aula no menu ao lado
              </div>
            )}
          </div>

          {/* RODAPÉ DO PLAYER (TÍTULO E AÇÕES) */}
          {aulaAtual && (
            <div className="p-4 bg-dark flex-grow-1 border-end" style={{ borderColor: 'var(--border-subtle) !important' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h3 className="text-white fw-bold mb-1">{aulaAtual.titulo}</h3>
                  <p className="text-muted mb-0">Módulo associado • {aulaAtual.duracaoMinutos} min</p>
                </div>
                
                <button 
                  onClick={toggleConcluido}
                  className={`btn btn-lg d-flex align-items-center gap-2 fw-bold shadow-sm transition-all ${isConcluida ? 'btn-success text-white' : 'btn-outline-secondary text-white'}`}
                >
                  {isConcluida ? <CheckCircle size={22} /> : <Circle size={22} />}
                  {isConcluida ? 'Aula Concluída' : 'Marcar como Concluída'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR DE MÓDULOS (PLAYLIST) */}
        <div className="col-12 col-lg-4 bg-dark border-start h-100 d-flex flex-column" style={{ borderColor: 'var(--border-subtle) !important' }}>
          <div className="p-4 border-bottom d-flex align-items-center gap-3 text-white fw-bold fs-5" style={{ borderColor: 'var(--border-subtle) !important', background: 'var(--surface)' }}>
            <ListVideo size={24} className="text-primary"/> Conteúdo do Curso
          </div>
          
          <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <div className="accordion accordion-flush d-flex flex-column gap-3" id="accordionModulosPlayer">
              {modulosCurso.map((modulo, idx) => {
                const aulasModulo = aulas.filter(a => a.moduloId === modulo.id).sort((a, b) => a.ordem - b.ordem);
                const isModuloAtivo = aulasModulo.some(a => a.id === aulaAtualId);
                const isFirst = idx === 0;
                // Abre o módulo se for o primeiro ou se contém a aula atual
                const isOpen = isModuloAtivo || (!aulaAtualId && isFirst);

                return (
                  <div key={modulo.id} className="accordion-item bg-dark border border-secondary shadow-sm rounded overflow-hidden" style={{ borderColor: 'var(--border-subtle) !important' }}>
                    <h2 className="accordion-header">
                      <button 
                        className={`accordion-button ${!isOpen ? 'collapsed' : ''} bg-dark text-white fw-bold p-4`} 
                        style={{ boxShadow: 'none' }}
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#player-collapse-${modulo.id}`}
                      >
                        <div className="d-flex flex-column text-start w-100 me-2">
                          <span className="small text-muted mb-1 fw-normal">Módulo {modulo.ordem}</span>
                          <span className="text-truncate">{modulo.titulo}</span>
                        </div>
                      </button>
                    </h2>
                    <div id={`player-collapse-${modulo.id}`} className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                      <div className="accordion-body p-0">
                        <div className="list-group list-group-flush rounded-0">
                          {aulasModulo.map(aula => {
                            const prog = progressos.find(p => p.usuarioId === usuarioLogadoId && p.aulaId === aula.id);
                            const isVisto = prog?.status === 'Concluido';
                            const isActive = aula.id === aulaAtualId;

                            return (
                              <button 
                                key={aula.id} 
                                onClick={() => setAulaAtualId(aula.id)}
                                className={`list-group-item list-group-item-action border-0 border-top border-secondary d-flex align-items-center gap-3 py-4 transition-all ${isActive ? 'bg-primary bg-opacity-25' : 'bg-transparent text-white hover-bg'}`}
                                style={{ borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent' }}
                              >
                                {/* Checkbox Indicador (Apenas visual na lista) */}
                                <div className={`${isVisto ? 'text-success' : 'text-muted opacity-50'}`}>
                                  {isVisto ? <CheckCircle size={18} /> : <Circle size={18} />}
                                </div>
                                
                                <div className="d-flex flex-column text-start flex-grow-1 overflow-hidden">
                                  <span className={`text-truncate small ${isActive ? 'text-white fw-bold' : 'text-white'}`}>{aula.ordem}. {aula.titulo}</span>
                                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>{aula.duracaoMinutos} min</span>
                                </div>
                                
                                {isActive && <PlayCircle size={16} className="text-primary flex-shrink-0" />}
                              </button>
                            );
                          })}
                          {aulasModulo.length === 0 && (
                            <div className="p-3 text-muted small text-center">Sem aulas neste módulo</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL DE AVALIAÇÃO */}
      {showAvaliacaoModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 9999 }}>
          <div className="bg-dark border border-secondary rounded-4 p-4 text-center shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
            <h4 className="text-white fw-bold mb-3">Avaliar Curso</h4>
            <div className="d-flex justify-content-center gap-2 mb-4">
              {[1,2,3,4,5].map(num => (
                <Star 
                  key={num} 
                  size={36} 
                  className="transition-all hover-lift"
                  fill={num <= nota ? '#ffc107' : 'transparent'}
                  color={num <= nota ? '#ffc107' : '#6c757d'}
                  onClick={() => setNota(num)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <textarea 
              className="form-control bg-dark border-secondary text-white mb-4" 
              rows={3} 
              placeholder="O que achou do curso? (opcional)"
              value={comentario}
              onChange={e => setComentario(e.target.value)}
            ></textarea>
            <div className="d-flex gap-2">
               <button className="btn btn-outline-secondary w-50 fw-bold" onClick={() => setShowAvaliacaoModal(false)}>Cancelar</button>
               <button className="btn btn-warning text-dark w-50 fw-bold shadow" onClick={handleAvaliar}>Enviar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
