import { useState } from 'react';
import { Book, Trash2, Eye } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import { Link } from 'react-router-dom';

export default function Cursos() {
  const { cursos, addCurso, removeCurso } = useEstudosStore();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [instrutor, setInstrutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nivel, setNivel] = useState('Iniciante');
  const [dataPublicacao, setDataPublicacao] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !instrutor || !categoria) return;
    
    addCurso({
      titulo,
      descricao,
      instrutor,
      categoria,
      nivel,
      dataPublicacao
    });
    
    setTitulo('');
    setDescricao('');
    setInstrutor('');
    setCategoria('');
    setNivel('Iniciante');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Book size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gestão de Cursos</h2>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Novo Curso</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input type="text" className="form-control" value={titulo} onChange={e => setTitulo(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea className="form-control" value={descricao} onChange={e => setDescricao(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Instrutor</label>
                <input type="text" className="form-control" value={instrutor} onChange={e => setInstrutor(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Categoria</label>
                <input type="text" className="form-control" value={categoria} onChange={e => setCategoria(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Nível</label>
                <select className="form-select" value={nivel} onChange={e => setNivel(e.target.value)}>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Data de Publicação</label>
                <input type="date" className="form-control" value={dataPublicacao} onChange={e => setDataPublicacao(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Adicionar Curso</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h4>Cursos Cadastrados</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Instrutor</th>
                    <th>Categoria</th>
                    <th>Nível</th>
                    <th>Métricas</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">Nenhum curso cadastrado.</td>
                    </tr>
                  ) : (
                    cursos.map(curso => (
                      <tr key={curso.id}>
                        <td className="fw-bold">{curso.titulo}</td>
                        <td>{curso.instrutor}</td>
                        <td>{curso.categoria}</td>
                        <td><span className="badge bg-secondary">{curso.nivel}</span></td>
                        <td>
                          <div className="small text-muted">
                            <div>Aulas: <strong>{curso.totalAulas}</strong></div>
                            <div>Carga: <strong>{curso.totalHoras}h</strong></div>
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="btn-group">
                            <Link to={`/cursos/${curso.id}`} className="btn btn-sm btn-outline-primary">
                              <Eye size={16} />
                            </Link>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeCurso(curso.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
