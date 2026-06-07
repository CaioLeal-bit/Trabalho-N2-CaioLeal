import { useState } from 'react';
import { PlaySquare, Trash, PlusCircle, Book, Layers, ArrowRight, Video, Link as LinkIcon, Clock, ChevronDown, Pencil, X } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Aula } from '../store/useEstudosStore';

export default function Aulas() {
  const { cursos, modulos, aulas, addAula, updateAula, removeAula, addToast } = useEstudosStore();
  
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [moduloSelecionado, setModuloSelecionado] = useState('');
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState('');
  const [ordem, setOrdem] = useState('');
  const [aulaEditando, setAulaEditando] = useState<string | null>(null);

  const [cursoDropdownOpen, setCursoDropdownOpen] = useState(false);
  const [moduloDropdownOpen, setModuloDropdownOpen] = useState(false);

  const modulosDoCurso = modulos.filter(m => m.cursoId === cursoSelecionado).sort((a, b) => a.ordem - b.ordem);
  const aulasDoModulo = aulas.filter(a => a.moduloId === moduloSelecionado).sort((a, b) => a.ordem - b.ordem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduloSelecionado || !titulo || !url || !duracaoMinutos || !ordem) return;
    
    if (aulaEditando) {
      updateAula(aulaEditando, {
        moduloId: moduloSelecionado,
        titulo,
        tipo: 'Video',
        url,
        duracaoMinutos: Number(duracaoMinutos),
        ordem: Number(ordem)
      });
      setAulaEditando(null);
    } else {
      // Validar se a ordem já existe no módulo
      const ordemExiste = aulas.some(a => a.moduloId === moduloSelecionado && a.ordem === Number(ordem));
      if (ordemExiste) {
        addToast('Já existe uma aula com essa ordem neste módulo.', 'error');
        return;
      }

      addAula({
        moduloId: moduloSelecionado,
        titulo,
        tipo: 'Video',
        url,
        duracaoMinutos: Number(duracaoMinutos),
        ordem: Number(ordem)
      });
    }
    
    setTitulo('');
    setUrl('');
    setDuracaoMinutos('');
    setOrdem('');
  };

  const handleEdit = (aula: Aula) => {
    setAulaEditando(aula.id);
    setTitulo(aula.titulo);
    setUrl(aula.url);
    setDuracaoMinutos(aula.duracaoMinutos.toString());
    setOrdem(aula.ordem.toString());
  };

  const handleCancelEdit = () => {
    setAulaEditando(null);
    setTitulo('');
    setUrl('');
    setDuracaoMinutos('');
    setOrdem('');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <PlaySquare size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Gestão de Aulas</h2>
          <p className="m-0 text-muted mt-1">Insira os vídeos e o conteúdo de cada módulo formatado em aulas.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Formulário e Steps */}
        <div className="col-lg-5">
          <div className="card h-100">
            <div className="card-body p-4">
              
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2 fw-bold text-white mb-3">
                  <span className="badge bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>1</span>
                  Hierarquia do Conteúdo
                </label>
                
                <div className="d-flex flex-column gap-3 p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                  
                  {/* Custom Dropdown Curso */}
                  <div className="position-relative">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--primary)' }}>
                        <Book size={18} />
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--primary)', cursor: 'pointer' }}
                        onClick={() => { setCursoDropdownOpen(!cursoDropdownOpen); setModuloDropdownOpen(false); }}
                      >
                        <span className="text-white">
                          {cursoSelecionado ? cursos.find(c => c.id === cursoSelecionado)?.titulo : '-- Selecione o Curso --'}
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
                            onClick={() => { setCursoSelecionado(''); setModuloSelecionado(''); setCursoDropdownOpen(false); }}
                          >
                            -- Selecione o Curso --
                          </div>
                          {cursos.map(c => (
                            <div 
                              key={c.id}
                              className={`px-3 py-2 cursor-pointer ${cursoSelecionado === c.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => { setCursoSelecionado(c.id); setModuloSelecionado(''); setCursoDropdownOpen(false); }}
                            >
                              {c.titulo}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Custom Dropdown Módulo */}
                  <div className="position-relative">
                    <div className="d-flex align-items-stretch" style={{ height: '48px', opacity: !cursoSelecionado ? 0.5 : 1 }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--info)' }}>
                        <Layers size={18} />
                      </div>
                      <div 
                        className={`flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end ${cursoSelecionado ? 'cursor-pointer' : ''}`}
                        style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: cursoSelecionado ? 'pointer' : 'default' }}
                        onClick={() => { if(cursoSelecionado) { setModuloDropdownOpen(!moduloDropdownOpen); setCursoDropdownOpen(false); } }}
                      >
                        <span className="text-white">
                          {moduloSelecionado ? `Módulo ${modulosDoCurso.find(m => m.id === moduloSelecionado)?.ordem}: ${modulosDoCurso.find(m => m.id === moduloSelecionado)?.titulo}` : '-- Selecione o Módulo --'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: moduloDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {moduloDropdownOpen && cursoSelecionado && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setModuloDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          <div 
                            className="px-3 py-2 text-muted hover-bg cursor-pointer"
                            style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                            onClick={() => { setModuloSelecionado(''); setModuloDropdownOpen(false); }}
                          >
                            -- Selecione o Módulo --
                          </div>
                          {modulosDoCurso.map(m => (
                            <div 
                              key={m.id}
                              className={`px-3 py-2 cursor-pointer ${moduloSelecionado === m.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => { setModuloSelecionado(m.id); setModuloDropdownOpen(false); }}
                            >
                              Módulo {m.ordem}: {m.titulo}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                </div>
              </div>

              {moduloSelecionado && (
                <div className="mt-5 animation-fade-in">
                  <label className="form-label d-flex align-items-center gap-2 fw-bold text-white mb-4">
                    <span className="badge bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>2</span>
                    {aulaEditando ? 'Editar Aula' : 'Cadastrar Nova Aula'}
                  </label>
                  
                  <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div className="row g-3">
                      <div className="col-3">
                        <label className="form-label text-muted small">Aula (Nº)</label>
                        <input type="number" className="form-control text-center" min="1" value={ordem} onChange={e => setOrdem(e.target.value)} required />
                      </div>
                      <div className="col-9">
                        <label className="form-label text-muted small">Título da Aula</label>
                        <input type="text" className="form-control" placeholder="Ex: Configurando o ambiente" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label d-flex align-items-center gap-2 text-muted small">
                        <LinkIcon size={14}/> URL do Vídeo (Embed)
                      </label>
                      <input type="url" className="form-control" placeholder="https://youtube.com/..." value={url} onChange={e => setUrl(e.target.value)} required />
                    </div>

                    <div>
                      <label className="form-label d-flex align-items-center gap-2 text-muted small">
                        <Clock size={14}/> Duração (minutos)
                      </label>
                      <input type="number" className="form-control w-50" placeholder="Ex: 15" value={duracaoMinutos} onChange={e => setDuracaoMinutos(e.target.value)} required />
                    </div>
                    
                    <div className="d-flex gap-2 mt-3">
                      <button type="submit" className={`btn ${aulaEditando ? 'btn-warning text-dark' : 'btn-primary'} flex-grow-1 py-2 fw-bold`}>
                        {aulaEditando ? 'Salvar Alterações' : <><PlusCircle size={18} className="me-2" /> Adicionar Aula</>}
                      </button>
                      {aulaEditando && (
                        <button type="button" className="btn btn-outline-secondary py-2 px-3" onClick={handleCancelEdit} title="Cancelar edição">
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Listagem */}
        <div className="col-lg-7">
          <div className="card h-100">
            <div className="card-body p-4">
              {!moduloSelecionado ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: '300px' }}>
                  <Video size={64} opacity={0.1} className="mb-3" />
                  <h5>Aguardando Seleção</h5>
                  <p>Selecione um curso e um módulo para visualizar as aulas.</p>
                </div>
              ) : (
                <>
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    Aulas do Módulo <ArrowRight size={16} className="text-muted"/> 
                    <span className="text-primary fs-5">{modulos.find(m => m.id === moduloSelecionado)?.titulo}</span>
                  </h4>
                  
                  <div className="d-flex flex-column gap-3">
                    {aulasDoModulo.length === 0 ? (
                      <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                        Ainda não há aulas cadastradas neste módulo.
                      </div>
                    ) : (
                      aulasDoModulo.map(aula => (
                        <div 
                          key={aula.id} 
                          className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                          style={{ border: '1px solid var(--border-subtle)' }}
                        >
                          {/* Aula Info */}
                          <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary" 
                              style={{ width: '48px', height: '48px', background: 'var(--secondary-light)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                              {aula.ordem}
                            </div>
                            <div>
                              <div className="fw-bold fs-5 text-white mb-1">{aula.titulo}</div>
                              <div className="text-muted small d-flex align-items-center gap-1">
                                <LinkIcon size={12}/> 
                                <a href={aula.url} target="_blank" rel="noreferrer" className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                  {aula.url}
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          {/* Duration & Actions */}
                          <div className="d-flex align-items-center gap-4">
                            <div className="d-flex flex-column align-items-end">
                              <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Duração
                              </span>
                              <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 mt-1 d-inline-flex align-items-center gap-1">
                                <Clock size={12}/> {aula.duracaoMinutos} min
                              </span>
                            </div>
                            
                            <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>

                            <div className="d-flex align-items-center gap-2">
                              <button 
                                className="btn btn-sm btn-outline-warning p-2"
                                title="Editar aula"
                                onClick={() => handleEdit(aula)}
                              >
                                <Pencil size={18} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger p-2"
                                title="Remover aula"
                                onClick={() => removeAula(aula.id)}
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
