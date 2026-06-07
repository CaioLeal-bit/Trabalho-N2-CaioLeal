import { useState } from 'react';
import { Layers, Trash, PlusCircle, Book, ArrowRight, ChevronDown, Pencil, X } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Modulo } from '../store/useEstudosStore';

export default function Modulos() {
  const { cursos, modulos, addModulo, updateModulo, removeModulo, addToast } = useEstudosStore();
  
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [cursoDropdownOpen, setCursoDropdownOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [ordem, setOrdem] = useState('');
  const [moduloEditando, setModuloEditando] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoSelecionado || !titulo || !ordem) return;
    
    if (moduloEditando) {
      updateModulo(moduloEditando, {
        cursoId: cursoSelecionado,
        titulo,
        ordem: Number(ordem)
      });
      setModuloEditando(null);
    } else {
      // Validar se a ordem já existe no curso
      const existeOrdem = modulos.some(m => m.cursoId === cursoSelecionado && m.ordem === Number(ordem));
      if (existeOrdem) {
        addToast('Já existe um módulo com essa ordem neste curso.', 'error');
        return;
      }

      addModulo({
        cursoId: cursoSelecionado,
        titulo,
        ordem: Number(ordem)
      });
    }
    
    setTitulo('');
    setOrdem('');
  };

  const handleEdit = (modulo: Modulo) => {
    setModuloEditando(modulo.id);
    setTitulo(modulo.titulo);
    setOrdem(modulo.ordem.toString());
  };

  const handleCancelEdit = () => {
    setModuloEditando(null);
    setTitulo('');
    setOrdem('');
  };

  const modulosFiltrados = modulos
    .filter(m => m.cursoId === cursoSelecionado)
    .sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <Layers size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Gestão de Módulos</h2>
          <p className="m-0 text-muted mt-1">Estruture o conteúdo dos cursos em módulos sequenciais.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Formulário e Steps */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body p-4">
              
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2 fw-bold text-white mb-3">
                  <span className="badge bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>1</span>
                  Selecione o Curso Base
                </label>
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
                        {cursoSelecionado ? cursos.find(c => c.id === cursoSelecionado)?.titulo : '-- Escolha um curso --'}
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
                          onClick={() => { setCursoSelecionado(''); setCursoDropdownOpen(false); }}
                        >
                          -- Escolha um curso --
                        </div>
                        {cursos.map(c => (
                          <div 
                            key={c.id}
                            className={`px-3 py-2 cursor-pointer ${cursoSelecionado === c.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => { setCursoSelecionado(c.id); setCursoDropdownOpen(false); }}
                          >
                            {c.titulo}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {cursoSelecionado && (
                <div className="mt-5 animation-fade-in">
                  <label className="form-label d-flex align-items-center gap-2 fw-bold text-white mb-4">
                    <span className="badge bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>2</span>
                    {moduloEditando ? 'Editar Módulo' : 'Adicionar Novo Módulo'}
                  </label>
                  
                  <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div className="row g-3">
                      <div className="col-4">
                        <label className="form-label text-muted small">Ordem (Nº)</label>
                        <input type="number" min="1" className="form-control text-center" placeholder="1" value={ordem} onChange={e => setOrdem(e.target.value)} required />
                      </div>
                      <div className="col-8">
                        <label className="form-label text-muted small">Título do Módulo</label>
                        <input type="text" className="form-control" placeholder="Ex: Introdução" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2 mt-3">
                      <button type="submit" className={`btn ${moduloEditando ? 'btn-warning text-dark' : 'btn-primary'} flex-grow-1 py-2 fw-bold`}>
                        {moduloEditando ? 'Salvar Alterações' : <><PlusCircle size={18} className="me-2" /> Criar Módulo</>}
                      </button>
                      {moduloEditando && (
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
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body p-4">
              {!cursoSelecionado ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: '300px' }}>
                  <Layers size={64} opacity={0.1} className="mb-3" />
                  <h5>Nenhum Curso Selecionado</h5>
                  <p>Selecione um curso ao lado para visualizar e editar seus módulos.</p>
                </div>
              ) : (
                <>
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    Módulos do Curso <ArrowRight size={16} className="text-muted"/> 
                    <span className="text-primary fs-5">{cursos.find(c => c.id === cursoSelecionado)?.titulo}</span>
                  </h4>
                  
                  <div className="d-flex flex-column gap-3">
                    {modulosFiltrados.length === 0 ? (
                      <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                        Este curso ainda não possui módulos.
                      </div>
                    ) : (
                      modulosFiltrados.map(modulo => (
                        <div 
                          key={modulo.id} 
                          className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                          style={{ border: '1px solid var(--border-subtle)' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary" 
                              style={{ width: '48px', height: '48px', background: 'var(--secondary-light)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                              {modulo.ordem}
                            </div>
                            <div className="fw-bold fs-5 text-white">{modulo.titulo}</div>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <button 
                              className="btn btn-sm btn-outline-warning p-2"
                              title="Editar módulo"
                              onClick={() => handleEdit(modulo)}
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger p-2"
                              title="Remover módulo"
                              onClick={() => removeModulo(modulo.id)}
                            >
                              <Trash size={18} />
                            </button>
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
