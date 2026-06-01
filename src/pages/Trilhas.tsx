import { useState } from 'react';
import { Route, Trash2, Plus } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function Trilhas() {
  const { trilhas, cursos, trilhasCursos, addTrilha, removeTrilha, addTrilhaCurso, removeTrilhaCurso } = useEstudosStore();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');

  const [selectedTrilhaId, setSelectedTrilhaId] = useState<string | null>(null);
  const [cursoToAdd, setCursoToAdd] = useState('');
  const [ordemCurso, setOrdemCurso] = useState('');

  const handleAddTrilha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descricao || !categoria) return;
    addTrilha({ titulo, descricao, categoria });
    setTitulo('');
    setDescricao('');
    setCategoria('');
  };

  const handleAddCursoToTrilha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrilhaId || !cursoToAdd || !ordemCurso) return;
    addTrilhaCurso({
      trilhaId: selectedTrilhaId,
      cursoId: cursoToAdd,
      ordem: Number(ordemCurso)
    });
    setCursoToAdd('');
    setOrdemCurso('');
  };

  const selectedTrilha = trilhas.find(t => t.id === selectedTrilhaId);
  const cursosDaTrilha = selectedTrilhaId 
    ? trilhasCursos.filter(tc => tc.trilhaId === selectedTrilhaId).sort((a, b) => a.ordem - b.ordem).map(tc => {
        const curso = cursos.find(c => c.id === tc.cursoId);
        return { ...tc, cursoNome: curso ? curso.titulo : 'Desconhecido' };
      })
    : [];

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Route size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gestão de Trilhas de Aprendizagem</h2>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Nova Trilha</h4>
            <form onSubmit={handleAddTrilha}>
              <div className="mb-3">
                <label className="form-label">Título da Trilha</label>
                <input type="text" className="form-control" value={titulo} onChange={e => setTitulo(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea className="form-control" value={descricao} onChange={e => setDescricao(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Categoria</label>
                <input type="text" className="form-control" value={categoria} onChange={e => setCategoria(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Criar Trilha</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Trilhas Cadastradas</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {trilhas.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">Nenhuma trilha cadastrada.</td>
                    </tr>
                  ) : (
                    trilhas.map(trilha => (
                      <tr key={trilha.id} className={selectedTrilhaId === trilha.id ? 'table-active' : ''}>
                        <td className="fw-bold">{trilha.titulo}</td>
                        <td>{trilha.categoria}</td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setSelectedTrilhaId(trilha.id)}
                          >
                            Gerenciar Cursos
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeTrilha(trilha.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedTrilha && (
            <div className="card shadow-sm p-3 border-primary border-2">
              <h4>Cursos da Trilha: {selectedTrilha.titulo}</h4>
              
              <form onSubmit={handleAddCursoToTrilha} className="d-flex gap-2 mb-3 align-items-end">
                <div className="flex-grow-1">
                  <label className="form-label">Selecione o Curso</label>
                  <select className="form-select" value={cursoToAdd} onChange={e => setCursoToAdd(e.target.value)} required>
                    <option value="">-- Escolha um curso --</option>
                    {cursos.map(c => (
                      <option key={c.id} value={c.id}>{c.titulo}</option>
                    ))}
                  </select>
                </div>
                <div style={{ width: '120px' }}>
                  <label className="form-label">Ordem</label>
                  <input type="number" className="form-control" value={ordemCurso} onChange={e => setOrdemCurso(e.target.value)} min="1" required />
                </div>
                <div>
                  <button type="submit" className="btn btn-success d-flex align-items-center gap-1">
                    <Plus size={18} /> Adicionar
                  </button>
                </div>
              </form>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Ordem</th>
                    <th>Curso</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cursosDaTrilha.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">Nenhum curso associado a esta trilha.</td>
                    </tr>
                  ) : (
                    cursosDaTrilha.map(tc => (
                      <tr key={tc.id}>
                        <td><span className="badge bg-secondary">{tc.ordem}</span></td>
                        <td>{tc.cursoNome}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeTrilhaCurso(tc.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
