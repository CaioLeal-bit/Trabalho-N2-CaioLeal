import { useState } from 'react';
import { Tag, PlusCircle, Trash, Pencil, X } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Categoria } from '../store/useEstudosStore';

export default function Categorias() {
  const { categorias, addCategoria, updateCategoria, removeCategoria, addToast } = useEstudosStore();
  
  const [categoriaEditando, setCategoriaEditando] = useState<string | null>(null);
  const [categoriaParaRemover, setCategoriaParaRemover] = useState<string | null>(null);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setCategoriaEditando(null);
  };

  const handleEdit = (c: Categoria) => {
    setNome(c.nome);
    setDescricao(c.descricao);
    setCategoriaEditando(c.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

    if (categoriaEditando) {
      updateCategoria(categoriaEditando, { nome, descricao });
      addToast('Categoria atualizada com sucesso!', 'success');
    } else {
      addCategoria({ nome, descricao });
      addToast('Categoria cadastrada com sucesso!', 'success');
    }
    resetForm();
  };

  const handleRemoveClick = (id: string) => {
    setCategoriaParaRemover(id);
  };

  const confirmRemove = () => {
    if (categoriaParaRemover) {
      removeCategoria(categoriaParaRemover);
      addToast('Categoria removida com sucesso!', 'success');
      setCategoriaParaRemover(null);
    }
  };

  const cancelRemove = () => {
    setCategoriaParaRemover(null);
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <Tag size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Gestão de Categorias</h2>
          <p className="m-0 text-muted mt-1">Crie e gerencie categorias de cursos e trilhas na plataforma.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulário */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="d-flex align-items-center gap-2 mb-4">
                {categoriaEditando ? <Pencil size={20} className="text-warning" /> : <PlusCircle size={20} className="text-primary" />}
                {categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
              </h4>
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <Tag size={16} /> Nome da Categoria
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Desenvolvimento"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <Tag size={16} /> Descrição
                  </label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    placeholder="Sobre o que é essa categoria..." 
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                  />
                </div>
                
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className={`btn ${categoriaEditando ? 'btn-warning text-dark' : 'btn-primary'} flex-grow-1 py-2 fw-bold`}>
                    {categoriaEditando ? 'Salvar Alterações' : 'Criar Categoria'}
                  </button>
                  {categoriaEditando && (
                    <button type="button" className="btn btn-outline-secondary py-2 px-3" onClick={resetForm} title="Cancelar edição">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="mb-4">Categorias Cadastradas <span className="badge bg-primary ms-2 rounded-pill">{categorias.length}</span></h4>
              
              <div className="d-flex flex-column gap-3">
                {categorias.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex flex-column align-items-center gap-2">
                      <Tag size={48} opacity={0.2} />
                      <p className="m-0 mt-2">Nenhuma categoria cadastrada ainda.</p>
                    </div>
                  </div>
                ) : (
                  categorias.map((cat) => (
                    <div 
                      key={cat.id} 
                      className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" 
                          style={{ width: '48px', height: '48px', background: 'var(--primary-light)' }}
                        >
                          <Tag size={20} />
                        </div>
                        <div>
                          <div className="fw-bold fs-5 text-white mb-1">{cat.nome}</div>
                          <div className="text-muted small">
                            {cat.descricao || 'Sem descrição.'}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-warning p-2"
                          title="Editar categoria"
                          onClick={() => handleEdit(cat)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger p-2"
                          title="Remover categoria"
                          onClick={() => handleRemoveClick(cat.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {categoriaParaRemover && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.8)', zIndex: 9999 }}>
          <div className="bg-dark border border-secondary rounded-4 p-4 text-center shadow-lg slide-down" style={{ maxWidth: '400px', width: '100%' }}>
            <h4 className="text-white fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
              <Trash size={24} className="text-danger" />
              Remover Categoria?
            </h4>
            <p className="text-muted mb-4">Tem certeza que deseja remover esta categoria? Esta ação não poderá ser desfeita.</p>
            <div className="d-flex gap-2">
               <button className="btn btn-outline-secondary w-50 fw-bold" onClick={cancelRemove}>Cancelar</button>
               <button className="btn btn-danger w-50 fw-bold shadow" onClick={confirmRemove}>Sim, Remover</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
