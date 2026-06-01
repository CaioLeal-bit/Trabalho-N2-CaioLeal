import { useState } from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function Modulos() {
  const { cursos, modulos, addModulo, removeModulo } = useEstudosStore();
  
  const [cursoId, setCursoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [ordem, setOrdem] = useState('');

  const modulosFiltrados = cursoId ? modulos.filter(m => m.cursoId === cursoId).sort((a, b) => a.ordem - b.ordem) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoId || !titulo || !ordem) return;
    
    addModulo({
      cursoId,
      titulo,
      ordem: Number(ordem)
    });
    
    setTitulo('');
    setOrdem('');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Layers size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gestão de Módulos</h2>
      </div>
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm p-3">
            <label className="form-label fw-bold">Selecione um Curso para gerenciar seus Módulos:</label>
            <select className="form-select" value={cursoId} onChange={e => setCursoId(e.target.value)}>
              <option value="">-- Selecione --</option>
              {cursos.map(c => (
                <option key={c.id} value={c.id}>{c.titulo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {cursoId && (
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm p-3 mb-4">
              <h4>Novo Módulo</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Título do Módulo</label>
                  <input type="text" className="form-control" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ordem (Posição)</label>
                  <input type="number" className="form-control" value={ordem} onChange={e => setOrdem(e.target.value)} min="1" required />
                  <small className="text-muted">A ordem não pode se repetir neste curso.</small>
                </div>
                <button type="submit" className="btn btn-primary w-100">Adicionar Módulo</button>
              </form>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-sm p-3">
              <h4>Módulos do Curso</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Ordem</th>
                      <th>Título</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modulosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">Nenhum módulo cadastrado neste curso.</td>
                      </tr>
                    ) : (
                      modulosFiltrados.map(mod => (
                        <tr key={mod.id}>
                          <td><span className="badge bg-secondary">Módulo {mod.ordem}</span></td>
                          <td className="fw-bold">{mod.titulo}</td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeModulo(mod.id)}
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
          </div>
        </div>
      )}
    </div>
  );
}
