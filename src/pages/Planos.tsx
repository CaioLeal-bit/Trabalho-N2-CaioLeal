import { useState } from 'react';
import { CreditCard, Trash, PlusCircle, Tag, AlignLeft, DollarSign, Calendar, Pencil, X } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Plano } from '../store/useEstudosStore';

export default function Planos() {
  const { planos, addPlano, updatePlano, removePlano } = useEstudosStore();
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracaoMeses, setDuracaoMeses] = useState('');
  const [planoEditando, setPlanoEditando] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !descricao || !preco || !duracaoMeses) return;
    
    if (planoEditando) {
      updatePlano(planoEditando, {
        nome,
        descricao,
        preco: Number(preco),
        duracaoMeses: Number(duracaoMeses)
      });
      setPlanoEditando(null);
    } else {
      addPlano({
        nome,
        descricao,
        preco: Number(preco),
        duracaoMeses: Number(duracaoMeses)
      });
    }
    
    setNome('');
    setDescricao('');
    setPreco('');
    setDuracaoMeses('');
  };

  const handleEdit = (plano: Plano) => {
    setPlanoEditando(plano.id);
    setNome(plano.nome);
    setDescricao(plano.descricao);
    setPreco(plano.preco.toString());
    setDuracaoMeses(plano.duracaoMeses.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setPlanoEditando(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setDuracaoMeses('');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <CreditCard size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Gestão de Planos</h2>
          <p className="m-0 text-muted mt-1">Crie e gerencie os planos de assinatura disponíveis para os alunos.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Form Column */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="d-flex align-items-center gap-2 mb-4">
                {planoEditando ? <Pencil size={20} className="text-warning" /> : <PlusCircle size={20} className="text-primary" />}
                {planoEditando ? 'Editar Plano' : 'Novo Plano'}
              </h4>
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <Tag size={16} /> Nome do Plano
                  </label>
                  <input type="text" className="form-control" placeholder="Ex: Plano Premium" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <AlignLeft size={16} /> Descrição
                  </label>
                  <textarea className="form-control" rows={3} placeholder="Benefícios do plano..." value={descricao} onChange={e => setDescricao(e.target.value)} required />
                </div>
                
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <DollarSign size={16} /> Preço (R$)
                    </label>
                    <input type="number" step="0.01" className="form-control" placeholder="0.00" value={preco} onChange={e => setPreco(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <Calendar size={16} /> Meses
                    </label>
                    <input type="number" className="form-control" placeholder="Ex: 12" value={duracaoMeses} onChange={e => setDuracaoMeses(e.target.value)} required />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className={`btn ${planoEditando ? 'btn-warning text-dark' : 'btn-primary'} flex-grow-1 py-2 fw-bold`}>
                    {planoEditando ? 'Salvar Alterações' : 'Criar Plano'}
                  </button>
                  {planoEditando && (
                    <button type="button" className="btn btn-outline-secondary py-2 px-3" onClick={handleCancelEdit} title="Cancelar edição">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="mb-4">Planos Ativos <span className="badge bg-primary ms-2 rounded-pill">{planos.length}</span></h4>
              
              <div className="d-flex flex-column gap-3">
                {planos.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex flex-column align-items-center gap-2">
                      <CreditCard size={48} opacity={0.2} />
                      <p className="m-0 mt-2">Nenhum plano configurado no sistema.</p>
                    </div>
                  </div>
                ) : (
                  planos.map(plano => (
                    <div 
                      key={plano.id} 
                      className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      {/* Plano Info */}
                      <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" 
                          style={{ width: '48px', height: '48px', background: 'var(--primary-light)' }}
                        >
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <div className="fw-bold fs-5 text-white mb-1">{plano.nome}</div>
                          <div className="text-muted small text-truncate" style={{ maxWidth: '250px' }} title={plano.descricao}>
                            {plano.descricao}
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="d-flex align-items-center gap-4">
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Mensalidade
                          </span>
                          <span className="fw-bold text-success mt-1 fs-6">
                            R$ {plano.preco.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Duração
                          </span>
                          <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 mt-1">
                            {plano.duracaoMeses} meses
                          </span>
                        </div>
                        
                        <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>
                        
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-warning p-2"
                            title="Editar plano"
                            onClick={() => handleEdit(plano)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger p-2"
                            title="Remover plano"
                            onClick={() => removePlano(plano.id)}
                          >
                            <Trash size={18} />
                          </button>
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
