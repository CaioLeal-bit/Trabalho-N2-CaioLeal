import { useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function Assinaturas() {
  const { usuarios, planos, assinaturas, pagamentos, simularAssinatura } = useEstudosStore();
  
  const [usuarioId, setUsuarioId] = useState('');
  const [planoId, setPlanoId] = useState('');
  const [metodo, setMetodo] = useState<'Cartao' | 'Pix' | 'Boleto'>('Cartao');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || !planoId || !metodo) return;
    simularAssinatura(usuarioId, planoId, metodo);
    setUsuarioId('');
    setPlanoId('');
    setMetodo('Cartao');
    alert('Simulação de assinatura concluída com sucesso!');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <CreditCard size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Assinaturas & Pagamentos (Simulador)</h2>
      </div>
      
      <div className="row">
        <div className="col-md-5">
          <div className="card shadow-sm p-3 mb-4 border-primary">
            <h4>Simular Checkout</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Selecionar Aluno</label>
                <select className="form-select" value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
                  <option value="">-- Escolha --</option>
                  {usuarios.filter(u => u.perfil === 'ALUNO').map(u => (
                    <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Escolher Plano</label>
                <select className="form-select" value={planoId} onChange={e => setPlanoId(e.target.value)} required>
                  <option value="">-- Escolha --</option>
                  {planos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco.toFixed(2)} ({p.duracaoMeses} meses)</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Método de Pagamento</label>
                <select className="form-select" value={metodo} onChange={e => setMetodo(e.target.value as any)} required>
                  <option value="Cartao">Cartão de Crédito</option>
                  <option value="Pix">PIX</option>
                  <option value="Boleto">Boleto Bancário</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2">
                <CheckCircle size={20} /> Processar Assinatura Simulado
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Assinaturas Ativas</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Plano</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assinaturas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">Nenhuma assinatura ativa.</td>
                    </tr>
                  ) : (
                    assinaturas.map(ass => {
                      const aluno = usuarios.find(u => u.id === ass.usuarioId);
                      const plano = planos.find(p => p.id === ass.planoId);
                      const isAtiva = new Date(ass.dataFim) >= new Date();
                      return (
                        <tr key={ass.id}>
                          <td className="fw-bold">{aluno?.nome || 'Excluído'}</td>
                          <td>{plano?.nome || 'Excluído'}</td>
                          <td>{new Date(ass.dataInicio).toLocaleDateString()}</td>
                          <td>{new Date(ass.dataFim).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${isAtiva ? 'bg-success' : 'bg-danger'}`}>
                              {isAtiva ? 'Ativa' : 'Expirada'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card shadow-sm p-3 mb-4">
            <h4>Histórico de Pagamentos (Transações)</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle table-sm">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>ID Transação</th>
                    <th>Método</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">Nenhum pagamento registrado.</td>
                    </tr>
                  ) : (
                    pagamentos.map(pag => (
                      <tr key={pag.id}>
                        <td>{new Date(pag.dataPagamento).toLocaleDateString()}</td>
                        <td className="font-monospace text-muted">{pag.idTransacao}</td>
                        <td>{pag.metodo}</td>
                        <td className="fw-bold text-success">R$ {pag.valorPago.toFixed(2)}</td>
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
