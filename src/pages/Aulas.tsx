import { useState } from 'react';
import { PlayCircle, Trash2 } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function Aulas() {
  const { cursos, modulos, aulas, addAula, removeAula } = useEstudosStore();
  
  const [cursoId, setCursoId] = useState('');
  const [moduloId, setModuloId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState('');
  const [ordem, setOrdem] = useState('');

  const modulosDoCurso = cursoId ? modulos.filter(m => m.cursoId === cursoId).sort((a, b) => a.ordem - b.ordem) : [];
  const aulasDoModulo = moduloId ? aulas.filter(a => a.moduloId === moduloId).sort((a, b) => a.ordem - b.ordem) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduloId || !titulo || !url || !duracaoMinutos || !ordem) return;
    
    addAula({
      moduloId,
      titulo,
      tipo: 'Video',
      url,
      duracaoMinutos: Number(duracaoMinutos),
      ordem: Number(ordem)
    });
    
    setTitulo('');
    setUrl('');
    setDuracaoMinutos('');
    setOrdem('');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <PlayCircle size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gestão de Aulas</h2>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <label className="form-label fw-bold">1. Selecione o Curso:</label>
            <select className="form-select" value={cursoId} onChange={e => { setCursoId(e.target.value); setModuloId(''); }}>
              <option value="">-- Selecione --</option>
              {cursos.map(c => (
                <option key={c.id} value={c.id}>{c.titulo}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <label className="form-label fw-bold">2. Selecione o Módulo:</label>
            <select className="form-select" value={moduloId} onChange={e => setModuloId(e.target.value)} disabled={!cursoId}>
              <option value="">-- Selecione --</option>
              {modulosDoCurso.map(m => (
                <option key={m.id} value={m.id}>Módulo {m.ordem} - {m.titulo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {moduloId && (
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm p-3 mb-4">
              <h4>Nova Aula</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Título da Aula</label>
                  <input type="text" className="form-control" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL do Vídeo</label>
                  <input type="url" className="form-control" value={url} onChange={e => setUrl(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Duração (Minutos)</label>
                  <input type="number" className="form-control" value={duracaoMinutos} onChange={e => setDuracaoMinutos(e.target.value)} min="1" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ordem (Posição)</label>
                  <input type="number" className="form-control" value={ordem} onChange={e => setOrdem(e.target.value)} min="1" required />
                  <small className="text-muted">A ordem não pode se repetir neste módulo.</small>
                </div>
                <button type="submit" className="btn btn-primary w-100">Adicionar Aula</button>
              </form>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-sm p-3">
              <h4>Aulas do Módulo</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Ordem</th>
                      <th>Título</th>
                      <th>Duração</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aulasDoModulo.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">Nenhuma aula cadastrada neste módulo.</td>
                      </tr>
                    ) : (
                      aulasDoModulo.map(aula => (
                        <tr key={aula.id}>
                          <td><span className="badge bg-secondary">Aula {aula.ordem}</span></td>
                          <td className="fw-bold">{aula.titulo} <br/><small className="text-muted"><a href={aula.url} target="_blank" rel="noreferrer">Ver Vídeo</a></small></td>
                          <td>{aula.duracaoMinutos} min</td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeAula(aula.id)}
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
