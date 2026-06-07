import { useState } from 'react';
import { Route, Trash, PlusCircle, Book, Link as LinkIcon, AlignLeft, Tag, ArrowRight, ChevronDown, Pencil, X } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Trilha } from '../store/useEstudosStore';

export default function Trilhas() {
  const { cursos, trilhas, trilhasCursos, addTrilha, updateTrilha, removeTrilha, addTrilhaCurso, updateTrilhaCurso, removeTrilhaCurso, addToast } = useEstudosStore();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [trilhaEditando, setTrilhaEditando] = useState<string | null>(null);
  
  const [trilhaSelecionada, setTrilhaSelecionada] = useState('');
  const [cursoParaVincular, setCursoParaVincular] = useState('');
  const [cursoDropdownOpen, setCursoDropdownOpen] = useState(false);
  const [ordemCurso, setOrdemCurso] = useState('');
  const [trilhaCursoEditando, setTrilhaCursoEditando] = useState<string | null>(null);

  const handleCriarTrilha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descricao) return;
    
    if (trilhaEditando) {
      updateTrilha(trilhaEditando, { titulo, descricao });
      setTrilhaEditando(null);
    } else {
      addTrilha({ titulo, descricao, categoria: 'Geral' });
    }
    setTitulo('');
    setDescricao('');
  };

  const handleEditTrilha = (trilha: Trilha) => {
    setTrilhaEditando(trilha.id);
    setTitulo(trilha.titulo);
    setDescricao(trilha.descricao);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditTrilha = () => {
    setTrilhaEditando(null);
    setTitulo('');
    setDescricao('');
  };

  const handleVincularCurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trilhaSelecionada || !cursoParaVincular || !ordemCurso) return;
    
    if (trilhaCursoEditando) {
      updateTrilhaCurso(trilhaCursoEditando, {
        cursoId: cursoParaVincular,
        ordem: Number(ordemCurso)
      });
      setTrilhaCursoEditando(null);
    } else {
      // Verificar se já existe essa ordem
      const exists = trilhasCursos.some(tc => tc.trilhaId === trilhaSelecionada && tc.ordem === Number(ordemCurso));
      if (exists) {
        addToast("Já existe um curso com esta ordem na trilha.", "error");
        return;
      }

      addTrilhaCurso({
        trilhaId: trilhaSelecionada,
        cursoId: cursoParaVincular,
        ordem: Number(ordemCurso)
      });
    }
    
    setCursoParaVincular('');
    setOrdemCurso('');
  };

  const handleEditTrilhaCurso = (tc: { trilhaCursoId: string; id?: string; ordem: number }) => {
    setTrilhaCursoEditando(tc.trilhaCursoId);
    setCursoParaVincular(tc.id || '');
    setOrdemCurso(tc.ordem.toString());
  };

  const handleCancelEditTrilhaCurso = () => {
    setTrilhaCursoEditando(null);
    setCursoParaVincular('');
    setOrdemCurso('');
  };

  const getCursosDaTrilha = (trilhaId: string) => {
    return trilhasCursos
      .filter(tc => tc.trilhaId === trilhaId)
      .map(tc => {
        const curso = cursos.find(c => c.id === tc.cursoId);
        return { ...curso, ordem: tc.ordem, trilhaCursoId: tc.id };
      })
      .filter(c => c.id !== undefined)
      .sort((a, b) => a.ordem - b.ordem);
  };

  const cursosAtuais = trilhaSelecionada ? getCursosDaTrilha(trilhaSelecionada) : [];

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <Route size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Gestão de Trilhas</h2>
          <p className="m-0 text-muted mt-1">Crie caminhos de aprendizado conectando múltiplos cursos em ordem lógica.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Formulário Trilhas */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body p-4">
              <h4 className="d-flex align-items-center gap-2 mb-4">
                {trilhaEditando ? <Pencil size={20} className="text-warning" /> : <PlusCircle size={20} className="text-primary" />}
                {trilhaEditando ? 'Editar Trilha' : 'Nova Trilha'}
              </h4>
              <form onSubmit={handleCriarTrilha} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <Tag size={16} /> Título da Trilha
                  </label>
                  <input type="text" className="form-control" placeholder="Ex: Desenvolvedor Fullstack" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <AlignLeft size={16} /> Descrição
                  </label>
                  <textarea className="form-control" rows={3} placeholder="Objetivo desta trilha..." value={descricao} onChange={e => setDescricao(e.target.value)} required />
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className={`btn ${trilhaEditando ? 'btn-warning text-dark' : 'btn-primary'} flex-grow-1 py-2 fw-bold`}>
                    {trilhaEditando ? 'Salvar Alterações' : 'Criar Trilha'}
                  </button>
                  {trilhaEditando && (
                    <button type="button" className="btn btn-outline-secondary py-2 px-3" onClick={handleCancelEditTrilha} title="Cancelar edição">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="card h-100" style={{ minHeight: '300px' }}>
            <div className="card-body p-4">
              <h4 className="mb-4">Trilhas Disponíveis <span className="badge bg-primary ms-2 rounded-pill">{trilhas.length}</span></h4>
              
              <div className="d-flex flex-column gap-3">
                {trilhas.length === 0 ? (
                  <div className="text-center py-4 text-muted border rounded" style={{ borderColor: 'var(--border-subtle)' }}>
                    Nenhuma trilha criada.
                  </div>
                ) : (
                  trilhas.map(trilha => {
                    const qtdCursos = trilhasCursos.filter(tc => tc.trilhaId === trilha.id).length;
                    return (
                      <div 
                        key={trilha.id} 
                        className={`p-3 rounded transition-all d-flex justify-content-between align-items-center ${trilhaSelecionada === trilha.id ? 'bg-primary bg-opacity-25' : 'bg-dark bg-opacity-50'}`}
                        style={{ border: `1px solid ${trilhaSelecionada === trilha.id ? 'var(--primary)' : 'var(--border-subtle)'}`, cursor: 'pointer' }}
                        onClick={() => setTrilhaSelecionada(trilha.id)}
                      >
                        <div>
                          <div className="fw-bold text-white mb-1">{trilha.titulo}</div>
                          <div className="text-muted small">{qtdCursos} cursos vinculados</div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button 
                            className="btn btn-sm btn-outline-warning p-2"
                            onClick={(e) => { e.stopPropagation(); handleEditTrilha(trilha); }}
                            title="Editar trilha"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger p-2"
                            onClick={(e) => { e.stopPropagation(); removeTrilha(trilha.id); if(trilhaSelecionada === trilha.id) setTrilhaSelecionada(''); }}
                            title="Remover trilha"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cursos da Trilha */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body p-4">
              {!trilhaSelecionada ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: '400px' }}>
                  <Route size={64} opacity={0.1} className="mb-3" />
                  <h5>Aguardando Seleção</h5>
                  <p>Selecione uma trilha ao lado para gerenciar seus cursos.</p>
                </div>
              ) : (
                <div className="animation-fade-in">
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    Cursos da Trilha <ArrowRight size={16} className="text-muted"/> 
                    <span className="text-primary fs-5">{trilhas.find(t => t.id === trilhaSelecionada)?.titulo}</span>
                  </h4>

                  <div className="p-3 rounded mb-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                    <form onSubmit={handleVincularCurso} className="row g-3 align-items-end">
                      <div className="col-md-5">
                        <label className="form-label text-muted small">{trilhaCursoEditando ? 'Editar Curso Vinculado' : 'Adicionar Curso à Trilha'}</label>
                        <div className="position-relative">
                          <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                            <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--primary)' }}>
                              <Book size={18} />
                            </div>
                            <div 
                              className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                              style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                              onClick={() => setCursoDropdownOpen(!cursoDropdownOpen)}
                            >
                              <span className="text-white">
                                {cursoParaVincular ? cursos.find(c => c.id === cursoParaVincular)?.titulo : '-- Escolha um curso --'}
                              </span>
                              <ChevronDown size={18} className="text-muted" style={{ transform: cursoDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                            </div>
                          </div>
                          
                          {cursoDropdownOpen && (
                            <>
                              <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setCursoDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                              <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                                <div 
                                  className="px-3 py-2 text-muted hover-bg cursor-pointer"
                                  style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                                  onClick={() => { setCursoParaVincular(''); setCursoDropdownOpen(false); }}
                                >
                                  -- Escolha um curso --
                                </div>
                                {cursos.map(c => (
                                  <div 
                                    key={c.id}
                                    className={`px-3 py-2 cursor-pointer ${cursoParaVincular === c.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => { setCursoParaVincular(c.id); setCursoDropdownOpen(false); }}
                                  >
                                    {c.titulo}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label text-muted small">Ordem (Passo)</label>
                        <input type="number" className="form-control text-center" value={ordemCurso} onChange={e => setOrdemCurso(e.target.value)} min="1" placeholder="Ex: 1" required />
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex gap-2">
                          <button type="submit" className={`btn ${trilhaCursoEditando ? 'btn-outline-warning' : 'btn-outline-primary'} flex-grow-1 d-flex align-items-center justify-content-center gap-2`}>
                            {trilhaCursoEditando ? <Pencil size={18} /> : <LinkIcon size={18} />}
                            {trilhaCursoEditando ? 'Salvar' : 'Vincular'}
                          </button>
                          {trilhaCursoEditando && (
                            <button type="button" className="btn btn-outline-secondary px-3" onClick={handleCancelEditTrilhaCurso} title="Cancelar edição">
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                  
                  <div className="d-flex flex-column gap-3">
                    {cursosAtuais.length === 0 ? (
                      <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                        Ainda não há cursos vinculados a esta trilha.
                      </div>
                    ) : (
                      cursosAtuais.map(tc => (
                        <div 
                          key={tc.trilhaCursoId} 
                          className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                          style={{ border: '1px solid var(--border-subtle)' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary bg-primary bg-opacity-25" 
                              style={{ width: '48px', height: '48px', border: '1px solid var(--primary)' }}
                            >
                              {tc.ordem}
                            </div>
                            <div>
                              <div className="fw-bold fs-5 text-white mb-1">{tc.titulo}</div>
                              <div className="text-muted small">
                                {tc.categoria} • {tc.nivel}
                              </div>
                            </div>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <button 
                              className="btn btn-sm btn-outline-warning p-2"
                              onClick={() => handleEditTrilhaCurso(tc)}
                              title="Editar vinculação"
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger p-2"
                              onClick={() => removeTrilhaCurso(tc.trilhaCursoId!)}
                              title="Desvincular curso"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
