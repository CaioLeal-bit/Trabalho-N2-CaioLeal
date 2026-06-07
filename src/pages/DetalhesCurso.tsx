import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, Layers, ArrowLeft, UserPlus, PlayCircle, MonitorPlay, Users, ChevronDown } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import { useState } from 'react';

export default function DetalhesCurso() {
  const { id } = useParams();
  const { cursos, modulos, aulas, usuarios, matriculas, matricular, addToast } = useEstudosStore();
  
  const curso = cursos.find(c => c.id === id);
  const modulosDoCurso = modulos.filter(m => m.cursoId === id).sort((a, b) => a.ordem - b.ordem);
  
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [usuarioDropdownOpen, setUsuarioDropdownOpen] = useState(false);

  if (!curso) {
    return (
      <div className="page-container container-fluid d-flex flex-column align-items-center justify-content-center text-center mt-5">
        <MonitorPlay size={64} opacity={0.2} className="mb-4" />
        <h2>Curso não encontrado.</h2>
        <p className="text-muted mb-4">O link que você acessou pode estar quebrado ou o curso foi removido.</p>
        <Link to="/cursos" className="btn btn-primary px-4 py-2">Voltar para o Catálogo</Link>
      </div>
    );
  }

  const handleMatricular = () => {
    if (!usuarioSelecionado) {
      addToast('Selecione um aluno primeiro.', 'error');
      return;
    }
    matricular(usuarioSelecionado, curso.id);
    addToast('Matrícula simulada com sucesso!', 'success');
    setUsuarioSelecionado('');
  };

  const matriculadosNesteCurso = matriculas.filter(m => m.cursoId === curso.id);

  return (
    <div className="page-container container-fluid p-0 pb-5">
      {/* Botão Voltar */}
      <div className="px-5 pt-4">
        <Link to="/cursos" className="btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-4 p-0 text-muted hover-white transition-colors">
          <ArrowLeft size={20} /> Voltar para Cursos
        </Link>
      </div>

      {/* Hero Section */}
      <div className="position-relative overflow-hidden mb-5" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(30, 41, 59, 0) 100%)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="px-5 pb-5 pt-2">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-8">
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary px-3 py-2 fs-6 rounded-pill shadow-sm">{curso.categoria}</span>
                <span className="badge bg-secondary px-3 py-2 fs-6 rounded-pill border border-secondary border-opacity-25 bg-opacity-25">{curso.nivel}</span>
              </div>
              <h1 className="display-5 fw-bold text-white mb-3" style={{ letterSpacing: '-1px' }}>{curso.titulo}</h1>
              <p className="lead text-muted mb-4" style={{ maxWidth: '800px', lineHeight: '1.6' }}>{curso.descricao}</p>
              
              <div className="d-flex flex-wrap gap-4 mt-3 text-white bg-dark bg-opacity-25 d-inline-flex p-3 rounded-4 border border-light border-opacity-10 backdrop-blur">
                <span className="d-flex align-items-center gap-2"><BookOpen size={18} className="text-primary"/> <strong>Instrutor:</strong> <span className="text-muted">{curso.instrutor}</span></span>
                <span className="d-flex align-items-center gap-2"><Layers size={18} className="text-info"/> <strong>{curso.totalAulas}</strong> <span className="text-muted">Aulas</span></span>
                <span className="d-flex align-items-center gap-2"><Clock size={18} className="text-warning"/> <strong>{curso.totalHoras}h</strong> <span className="text-muted">Duração</span></span>
              </div>
            </div>
            
            <div className="col-lg-3 mt-4 mt-lg-0">
              {/* Card de Simulação de Matrícula */}
              <div className="card shadow-lg border-primary border-opacity-25" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                <div className="card-body p-4 text-center">
                  <h5 className="card-title d-flex align-items-center justify-content-center gap-2 mb-4 text-white">
                    <UserPlus size={20} className="text-primary"/> Simular Matrícula
                  </h5>
                  <div className="position-relative mb-3 text-start">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--primary)' }}>
                        <Users size={18} />
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => setUsuarioDropdownOpen(!usuarioDropdownOpen)}
                      >
                        <span className="text-white">
                          {usuarioSelecionado ? usuarios.find(u => u.id === usuarioSelecionado)?.nome : 'Selecione um Aluno...'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: usuarioDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {usuarioDropdownOpen && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setUsuarioDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          <div 
                            className="px-3 py-2 text-muted hover-bg cursor-pointer"
                            style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                            onClick={() => { setUsuarioSelecionado(''); setUsuarioDropdownOpen(false); }}
                          >
                            Selecione um Aluno...
                          </div>
                          {usuarios.filter(u => u.perfil === 'ALUNO').map(u => (
                            <div 
                              key={u.id}
                              className={`px-3 py-2 cursor-pointer ${usuarioSelecionado === u.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => { setUsuarioSelecionado(u.id); setUsuarioDropdownOpen(false); }}
                            >
                              {u.nome}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <button className="btn btn-primary w-100 fw-bold py-2 shadow-sm" onClick={handleMatricular}>Inscrever Aluno</button>
                  <div className="mt-3 text-center small text-muted d-flex justify-content-center align-items-center gap-1">
                    <Users size={14}/> {matriculadosNesteCurso.length} alunos inscritos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <h3 className="mb-4 fw-bold text-white d-flex align-items-center gap-2">
          Conteúdo do Curso <span className="badge bg-secondary rounded-pill fs-6 fw-normal ms-2">{modulosDoCurso.length} Módulos</span>
        </h3>
        
        {modulosDoCurso.length === 0 ? (
          <div className="text-center p-5 border rounded" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface)' }}>
            <Layers size={48} opacity={0.2} className="mb-3 text-muted" />
            <h5 className="text-muted">Estrutura curricular vazia</h5>
            <p className="text-muted small">Este curso ainda não possui módulos ou aulas cadastradas.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {modulosDoCurso.map((modulo) => {
              const aulasDoModulo = aulas.filter(a => a.moduloId === modulo.id).sort((a, b) => a.ordem - b.ordem);
              
              return (
                <div className="card border-0 shadow-sm overflow-hidden" key={modulo.id}>
                  <div className="card-header bg-transparent p-4 border-bottom border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-primary small fw-bold text-uppercase tracking-wider mb-1">Módulo {modulo.ordem}</div>
                      <h5 className="m-0 text-white fw-bold">{modulo.titulo}</h5>
                    </div>
                    <span className="badge bg-dark border border-secondary border-opacity-25 px-3 py-2 rounded-pill text-muted">
                      {aulasDoModulo.length} aulas
                    </span>
                  </div>
                  
                  <div className="card-body p-0" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <ul className="list-group list-group-flush">
                      {aulasDoModulo.length === 0 ? (
                        <li className="list-group-item bg-transparent text-muted p-4 text-center border-0">
                          Nenhuma aula cadastrada neste módulo.
                        </li>
                      ) : (
                        aulasDoModulo.map(aula => (
                          <li key={aula.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-center p-4 border-secondary border-opacity-10 transition-colors hover-bg-dark">
                            <div className="d-flex align-items-center gap-3">
                              <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                <PlayCircle size={18} />
                              </div>
                              <div>
                                <div className="text-white fw-medium">
                                  <span className="text-muted me-2">{aula.ordem}.</span>
                                  {aula.titulo}
                                </div>
                                <a href={aula.url} target="_blank" rel="noreferrer" className="small text-primary text-decoration-none mt-1 d-inline-block hover-underline">Assistir Aula</a>
                              </div>
                            </div>
                            <span className="badge bg-dark border border-secondary border-opacity-25 text-muted px-2 py-1 d-flex align-items-center gap-1">
                              <Clock size={12} className="text-info"/> {aula.duracaoMinutos}m
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
