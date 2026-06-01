import { useState } from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function Planos() {
  const { planos, addPlano, removePlano } = useEstudosStore();
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracaoMeses, setDuracaoMeses] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !descricao || !preco || !duracaoMeses) return;
    
    addPlano({
      nome,
      descricao,
      preco: Number(preco),
      duracaoMeses: Number(duracaoMeses)
    });
    
    setNome('');
    setDescricao('');
    setPreco('');
    setDuracaoMeses('');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <CreditCard size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gestão de Planos</h2>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Novo Plano</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome do Plano</label>
                <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea className="form-control" value={descricao} onChange={e => setDescricao(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Preço (R$)</label>
                <input type="number" step="0.01" className="form-control" value={preco} onChange={e => setPreco(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Duração (Meses)</label>
                <input type="number" className="form-control" value={duracaoMeses} onChange={e => setDuracaoMeses(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Adicionar Plano</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h4>Planos Cadastrados</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th>Duração</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {planos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">Nenhum plano cadastrado.</td>
                    </tr>
                  ) : (
                    planos.map(plano => (
                      <tr key={plano.id}>
                        <td className="fw-bold">{plano.nome}</td>
                        <td>{plano.descricao}</td>
                        <td>R$ {plano.preco.toFixed(2)}</td>
                        <td>{plano.duracaoMeses} meses</td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removePlano(plano.id)}
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
    </div>
  );
}
