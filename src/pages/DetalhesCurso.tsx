import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, Layers, ArrowLeft, UserPlus } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import { useState } from 'react';

export default function DetalhesCurso() {
  const { id } = useParams();
  const { cursos, modulos, aulas, usuarios, matricular, matriculas } = useEstudosStore();
  
  const curso = cursos.find(c => c.id === id);
  const modulosDoCurso = modulos.filter(m => m.cursoId === id).sort((a, b) => a.ordem - b.ordem);
  
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');

  if (!curso) {
    return (
      <div className="page-container container-fluid text-center mt-5">
        <h2>Curso não encontrado.</h2>
        <Link to="/cursos" className="btn btn-primary mt-3">Voltar para Cursos</Link>
      </div>
    );
  }

  const handleMatricular = () => {
    if (!usuarioSelecionado) return alert('Selecione um aluno primeiro.');
    matricular(usuarioSelecionado, curso.id);
    alert('Matrícula simulada com sucesso!');
    setUsuarioSelecionado('');
  };

  const matriculadosNesteCurso = matriculas.filter(m => m.cursoId === curso.id);

  return (
    <div className="page-container container-fluid">
      <Link to="/cursos" className="btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-4 p-0">
        <ArrowLeft size={20} /> Voltar para o Catálogo
      </Link>

      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-4 bg-light rounded">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <span className="badge bg-primary mb-2">{curso.categoria}</span>
              <span className="badge bg-secondary ms-2 mb-2">{curso.nivel}</span>
              <h1 className="display-6 fw-bold text-dark">{curso.titulo}</h1>
              <p className="lead text-muted">{curso.descricao}</p>
              <div className="d-flex gap-4 mt-3 text-muted">
                <span className="d-flex align-items-center gap-1"><BookOpen size={18}/> Instrutor: {curso.instrutor}</span>
                <span className="d-flex align-items-center gap-1"><Layers size={18}/> {curso.totalAulas} Aulas</span>
                <span className="d-flex align-items-center gap-1"><Clock size={18}/> {curso.totalHoras}h Carga Horária</span>
              </div>
            </div>
            
            <div className="card shadow-sm border-primary" style={{ width: '300px' }}>
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center gap-2"><UserPlus size={20}/> Simular Matrícula</h5>
                <select className="form-select mb-3" value={usuarioSelecionado} onChange={e => setUsuarioSelecionado(e.target.value)}>
                  <option value="">Selecione um Aluno...</option>
                  {usuarios.filter(u => u.perfil === 'ALUNO').map(u => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                  ))}
                </select>
                <button className="btn btn-primary w-100" onClick={handleMatricular}>Matricular Aluno</button>
                <div className="mt-3 text-center small text-muted">
                  Total de matriculados: {matriculadosNesteCurso.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-4 fw-bold">Conteúdo do Curso</h3>
      
      {modulosDoCurso.length === 0 ? (
        <p className="text-muted">Nenhum módulo cadastrado para este curso ainda.</p>
      ) : (
        <div className="accordion shadow-sm" id="accordionModulos">
          {modulosDoCurso.map((modulo, index) => {
            const aulasDoModulo = aulas.filter(a => a.moduloId === modulo.id).sort((a, b) => a.ordem - b.ordem);
            const isFirst = index === 0;
            
            return (
              <div className="accordion-item" key={modulo.id}>
                <h2 className="accordion-header">
                  <button className={`accordion-button ${isFirst ? '' : 'collapsed'} fw-bold`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${modulo.id}`}>
                    Módulo {modulo.ordem}: {modulo.titulo}
                    <span className="badge bg-secondary ms-auto me-3">{aulasDoModulo.length} aulas</span>
                  </button>
                </h2>
                <div id={`collapse${modulo.id}`} className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`} data-bs-parent="#accordionModulos">
                  <div className="accordion-body p-0">
                    <ul className="list-group list-group-flush">
                      {aulasDoModulo.length === 0 ? (
                        <li className="list-group-item text-muted">Nenhuma aula neste módulo.</li>
                      ) : (
                        aulasDoModulo.map(aula => (
                          <li key={aula.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                            <div>
                              <span className="fw-bold me-2">{aula.ordem}.</span>
                              {aula.titulo}
                              <a href={aula.url} target="_blank" rel="noreferrer" className="ms-3 small text-decoration-none">Assistir Vídeo</a>
                            </div>
                            <span className="badge bg-light text-dark border"><Clock size={12} className="me-1"/>{aula.duracaoMinutos}m</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
