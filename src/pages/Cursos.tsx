import { useState } from 'react';
import { BookOpen, Trash, PlusCircle, Bookmark, User, Tag, ChevronDown, Pencil, X, Video, Clock, Eye } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Curso } from '../store/useEstudosStore';
import { Link } from 'react-router-dom';

export default function Cursos() {
  const { cursos, addCurso, updateCurso, removeCurso } = useEstudosStore();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [instrutor, setInstrutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nivel, setNivel] = useState('Iniciante');
  const [nivelDropdownOpen, setNivelDropdownOpen] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<string | null>(null);
  const [dataPublicacao, setDataPublicacao] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descricao || !instrutor || !categoria || !nivel) return;
    
    if (cursoEditando) {
      updateCurso(cursoEditando, {
        titulo,
        descricao,
        instrutor,
        categoria,
        nivel
      });
      setCursoEditando(null);
    } else {
      addCurso({
        titulo,
        descricao,
        instrutor,
        categoria,
        nivel,
        dataPublicacao: new Date().toISOString().split('T')[0]
      });
    }
    
    setTitulo('');
    setDescricao('');
    setInstrutor('');
    setCategoria('');
    setNivel('Iniciante');
  };

  const handleEdit = (curso: Curso) => {
    setCursoEditando(curso.id);
    setTitulo(curso.titulo);
    setDescricao(curso.descricao);
    setInstrutor(curso.instrutor);
    setCategoria(curso.categoria);
    setNivel(curso.nivel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setCursoEditando(null);
    setTitulo('');
    setDescricao('');
    setInstrutor('');
    setCategoria('');
    setNivel('Iniciante');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <BookOpen size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Gestão de Cursos</h2>
          <p className="m-0 text-muted mt-1">Crie cursos, adicione categorias e defina o catálogo principal.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Formulário */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="d-flex align-items-center gap-2 mb-4">
                {cursoEditando ? <Pencil size={20} className="text-warning" /> : <PlusCircle size={20} className="text-primary" />}
                {cursoEditando ? 'Editar Curso' : 'Novo Curso'}
              </h4>
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <Bookmark size={16} /> Título
                  </label>
                  <input type="text" className="form-control" placeholder="Ex: React Avançado" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <Bookmark size={16} /> Descrição
                  </label>
                  <textarea className="form-control" rows={3} placeholder="Sobre o que é este curso..." value={descricao} onChange={e => setDescricao(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <User size={16} /> Instrutor
                  </label>
                  <input type="text" className="form-control" placeholder="Nome do Professor" value={instrutor} onChange={e => setInstrutor(e.target.value)} required />
                </div>
                
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <Tag size={16} /> Categoria
                    </label>
                    <input type="text" className="form-control" placeholder="Ex: Frontend" value={categoria} onChange={e => setCategoria(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <Tag size={16} /> Nível
                    </label>
                    <div className="position-relative mt-1">
                      <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                        <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--primary)' }}>
                          <Tag size={18} />
                        </div>
                        <div 
                          className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                          style={{ background: 'var(--surface)', borderColor: 'var(--primary)', cursor: 'pointer' }}
                          onClick={() => setNivelDropdownOpen(!nivelDropdownOpen)}
                        >
                          <span className="text-white">{nivel}</span>
                          <ChevronDown size={18} className="text-muted" style={{ transform: nivelDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                        </div>
                      </div>
                      
                      {nivelDropdownOpen && (
                        <>
                          <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setNivelDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                          <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                            {['Iniciante', 'Intermediário', 'Avançado'].map(opt => (
                              <div 
                                key={opt}
                                className={`px-3 py-2 cursor-pointer ${nivel === opt ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                                onClick={() => { setNivel(opt); setNivelDropdownOpen(false); }}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!cursoEditando && (
                  <div>
                    <label className="form-label d-flex align-items-center gap-2 mt-2">
                      <Bookmark size={16} /> Data de Publicação
                    </label>
                    <input type="date" className="form-control" value={dataPublicacao} onChange={e => setDataPublicacao(e.target.value)} required />
                  </div>
                )}

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className={`btn ${cursoEditando ? 'btn-warning text-dark' : 'btn-primary'} flex-grow-1 py-2 fw-bold`}>
                    {cursoEditando ? 'Salvar Alterações' : 'Criar Curso'}
                  </button>
                  {cursoEditando && (
                    <button type="button" className="btn btn-outline-secondary py-2 px-3" onClick={handleCancelEdit} title="Cancelar edição">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="mb-4">Catálogo de Cursos <span className="badge bg-primary ms-2 rounded-pill">{cursos.length}</span></h4>
              <div className="d-flex flex-column gap-3">
                {cursos.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex flex-column align-items-center gap-2">
                      <BookOpen size={48} opacity={0.2} />
                      <p className="m-0 mt-2">Nenhum curso no catálogo ainda.</p>
                    </div>
                  </div>
                ) : (
                  cursos.map(curso => (
                    <div 
                      key={curso.id} 
                      className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      {/* Course Info */}
                      <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" 
                          style={{ width: '48px', height: '48px', background: 'var(--primary-light)' }}
                        >
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <div className="fw-bold fs-5 text-white mb-1">{curso.titulo}</div>
                          <div className="text-muted small d-flex align-items-center gap-2">
                            <span className="d-flex align-items-center gap-1"><User size={12}/> {curso.instrutor}</span>
                            <span>•</span>
                            <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25">{curso.categoria}</span>
                            <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25">{curso.nivel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics & Actions */}
                      <div className="d-flex align-items-center gap-4">
                        <div className="d-flex gap-3">
                          <div className="d-flex flex-column align-items-end">
                            <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Aulas</span>
                            <div className="d-flex align-items-center gap-1 mt-1 fw-bold text-white">
                              <Video size={14} className="text-primary"/> {curso.totalAulas || 0}
                            </div>
                          </div>
                          <div className="d-flex flex-column align-items-end">
                            <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Horas</span>
                            <div className="d-flex align-items-center gap-1 mt-1 fw-bold text-white">
                              <Clock size={14} className="text-info"/> {curso.totalHoras || 0}h
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>
                        
                        <div className="d-flex gap-2">
                          <Link to={`/cursos/${curso.id}`} className="btn btn-sm btn-outline-primary px-3 py-2 d-flex align-items-center gap-2">
                            <Eye size={16} /> Ver Detalhes
                          </Link>
                          <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-warning p-2"
                            title="Editar curso"
                            onClick={(e) => { e.preventDefault(); handleEdit(curso); }}
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger p-2"
                            title="Remover curso"
                            onClick={(e) => { e.preventDefault(); removeCurso(curso.id); }}
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
