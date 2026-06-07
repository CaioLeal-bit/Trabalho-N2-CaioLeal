import { useState } from 'react';
import { ShoppingCart, CheckCircle, CreditCard as CardIcon, Calendar, User, Tag, ShieldCheck, DollarSign, ChevronDown, Pencil, X, Trash } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Assinatura, Pagamento } from '../store/useEstudosStore';

export default function Assinaturas() {
  const { planos, usuarios, assinaturas, pagamentos, simularAssinatura, updateAssinatura, removeAssinatura, addToast } = useEstudosStore();
  
  const [usuarioId, setUsuarioId] = useState('');
  const [planoId, setPlanoId] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'Cartão' | 'Boleto' | 'Pix'>('Cartão');
  const [assinaturaEditando, setAssinaturaEditando] = useState<string | null>(null);

  const [alunoDropdownOpen, setAlunoDropdownOpen] = useState(false);
  const [planoDropdownOpen, setPlanoDropdownOpen] = useState(false);
  const [pagamentoDropdownOpen, setPagamentoDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || !planoId) return;
    
    if (assinaturaEditando) {
      updateAssinatura(assinaturaEditando, {
        usuarioId,
        planoId
      });
      // Nota: Alterar a forma de pagamento não atualizará a transação histórica por simplicidade
      addToast('Assinatura atualizada com sucesso!', 'success');
      setAssinaturaEditando(null);
    } else {
      simularAssinatura(usuarioId, planoId, formaPagamento as 'Cartao' | 'Boleto' | 'Pix');
      addToast('Assinatura e Pagamento processados com sucesso!', 'success');
    }

    setUsuarioId('');
    setPlanoId('');
  };

  const handleEdit = (assinatura: Assinatura, pagamento: Pagamento) => {
    setAssinaturaEditando(assinatura.id);
    setUsuarioId(assinatura.usuarioId);
    setPlanoId(assinatura.planoId);
    setFormaPagamento(pagamento.metodo === 'Cartao' ? 'Cartão' : pagamento.metodo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setAssinaturaEditando(null);
    setUsuarioId('');
    setPlanoId('');
    setFormaPagamento('Cartão');
  };

  const alunos = usuarios.filter(u => u.perfil === 'ALUNO');
  const planoSelecionadoObj = planos.find(p => p.id === planoId);

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <ShoppingCart size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Simulador de Assinaturas</h2>
          <p className="m-0 text-muted mt-1">Simule o checkout financeiro vinculando alunos aos planos do sistema.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Painel de Checkout */}
        <div className="col-lg-5">
          <div className="card h-100 shadow-sm" style={{ borderTop: '4px solid var(--primary)' }}>
            <div className="card-body p-4">
              <h4 className="d-flex align-items-center gap-2 mb-4 text-white">
                {assinaturaEditando ? <Pencil size={24} className="text-warning" /> : <ShieldCheck size={24} className="text-primary" />}
                {assinaturaEditando ? 'Editar Assinatura' : 'Checkout de Assinatura'}
              </h4>
              
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                
                {/* Seleção de Aluno */}
                <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <label className="form-label d-flex align-items-center gap-2 fw-bold text-white mb-3">
                    <User size={18} className="text-info"/> Selecionar Aluno
                  </label>
                  <div className="position-relative mt-1">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--info)' }}>
                        <User size={18} />
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => setAlunoDropdownOpen(!alunoDropdownOpen)}
                      >
                        <span className="text-white">
                          {usuarioId ? `${alunos.find(a => a.id === usuarioId)?.nome} (${alunos.find(a => a.id === usuarioId)?.email})` : '-- Escolha um aluno --'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: alunoDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {alunoDropdownOpen && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setAlunoDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          <div 
                            className="px-3 py-2 text-muted hover-bg cursor-pointer"
                            style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                            onClick={() => { setUsuarioId(''); setAlunoDropdownOpen(false); }}
                          >
                            -- Escolha um aluno --
                          </div>
                          {alunos.map(a => (
                            <div 
                              key={a.id}
                              className={`px-3 py-2 cursor-pointer ${usuarioId === a.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => { setUsuarioId(a.id); setAlunoDropdownOpen(false); }}
                            >
                              {a.nome} ({a.email})
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Seleção de Plano */}
                <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <label className="form-label d-flex align-items-center gap-2 fw-bold text-white mb-3">
                    <Tag size={18} className="text-warning"/> Escolher Plano
                  </label>
                  <div className="position-relative mt-1 mb-3">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--warning)' }}>
                        <Tag size={18} />
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => setPlanoDropdownOpen(!planoDropdownOpen)}
                      >
                        <span className="text-white">
                          {planoId ? `${planos.find(p => p.id === planoId)?.nome} - R$ ${planos.find(p => p.id === planoId)?.preco.toFixed(2)}` : '-- Escolha um plano --'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: planoDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {planoDropdownOpen && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setPlanoDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          <div 
                            className="px-3 py-2 text-muted hover-bg cursor-pointer"
                            style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                            onClick={() => { setPlanoId(''); setPlanoDropdownOpen(false); }}
                          >
                            -- Escolha um plano --
                          </div>
                          {planos.map(p => (
                            <div 
                              key={p.id}
                              className={`px-3 py-2 cursor-pointer ${planoId === p.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => { setPlanoId(p.id); setPlanoDropdownOpen(false); }}
                            >
                              {p.nome} - R$ {p.preco.toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {planoSelecionadoObj && (
                    <div className="alert alert-primary mb-0 bg-transparent border border-primary border-opacity-25 d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-primary">Valor a cobrar:</span>
                        <span className="fw-bold fs-5 text-white">R$ {planoSelecionadoObj.preco.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-primary">Validade:</span>
                        <span className="text-white">{planoSelecionadoObj.duracaoMeses} meses</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Forma de Pagamento */}
                {!assinaturaEditando && (
                  <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                    <label className="form-label d-flex align-items-center gap-2 fw-bold text-white mb-3">
                      <CardIcon size={18} className="text-success"/> Forma de Pagamento
                    </label>
                    <div className="position-relative mt-1">
                      <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                        <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--success)' }}>
                          <CardIcon size={18} />
                        </div>
                        <div 
                          className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                          style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                          onClick={() => setPagamentoDropdownOpen(!pagamentoDropdownOpen)}
                        >
                          <span className="text-white">
                            {formaPagamento === 'Cartão' ? 'Cartão de Crédito' : formaPagamento === 'Boleto' ? 'Boleto Bancário' : 'Pix'}
                          </span>
                          <ChevronDown size={18} className="text-muted" style={{ transform: pagamentoDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                        </div>
                      </div>
                      
                      {pagamentoDropdownOpen && (
                        <>
                          <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setPagamentoDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                          <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                            {[
                              { value: 'Cartão', label: 'Cartão de Crédito' },
                              { value: 'Boleto', label: 'Boleto Bancário' },
                              { value: 'Pix', label: 'Pix' }
                            ].map(opt => (
                              <div 
                                key={opt.value}
                                className={`px-3 py-2 cursor-pointer ${formaPagamento === opt.value ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                                onClick={() => { setFormaPagamento(opt.value as 'Cartão' | 'Boleto' | 'Pix'); setPagamentoDropdownOpen(false); }}
                              >
                                {opt.label}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className={`btn ${assinaturaEditando ? 'btn-warning text-dark' : 'btn-primary'} btn-lg flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2 py-3`}>
                    {assinaturaEditando ? <Pencil size={20} /> : <CheckCircle size={20} />}
                    {assinaturaEditando ? 'Salvar Alterações' : 'Processar Assinatura'}
                  </button>
                  {assinaturaEditando && (
                    <button type="button" className="btn btn-outline-secondary py-3 px-4" onClick={handleCancelEdit} title="Cancelar edição">
                      <X size={24} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Histórico de Transações */}
        <div className="col-lg-7">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-4 d-flex align-items-center gap-2">
                <DollarSign size={20} className="text-success"/> Histórico de Transações Recentes
              </h4>
              
              <div className="d-flex flex-column gap-3">
                {pagamentos.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                    <CardIcon size={48} opacity={0.2} className="mb-3"/>
                    <p className="m-0">Nenhum pagamento processado até o momento.</p>
                  </div>
                ) : (
                  pagamentos.slice().reverse().map(pg => {
                    const assinatura = assinaturas.find(a => a.id === pg.assinaturaId);
                    const aluno = usuarios.find(u => u.id === assinatura?.usuarioId);
                    
                    return (
                      <div 
                        key={pg.id} 
                        className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                        style={{ border: '1px solid var(--border-subtle)' }}
                      >
                        {/* Transaction & User Info */}
                        <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-success bg-success bg-opacity-25" 
                            style={{ width: '48px', height: '48px', border: '1px solid var(--success)' }}
                          >
                            <DollarSign size={20} />
                          </div>
                          <div>
                            <div className="fw-bold fs-5 text-white mb-1">
                              {aluno?.nome || 'Desconhecido'}
                            </div>
                            <div className="text-muted small d-flex align-items-center gap-2">
                              <span className="font-monospace text-primary">
                                #{pg.idTransacao}
                              </span>
                              <span>•</span>
                              <span className="d-flex align-items-center gap-1">
                                <Calendar size={12}/> {new Date(pg.dataPagamento).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="d-flex align-items-center gap-4">
                          <div className="d-flex flex-column align-items-end">
                            <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              Método
                            </span>
                            <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 mt-1">
                              {pg.metodo}
                            </span>
                          </div>
                          
                          <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>
                          
                          <div className="d-flex flex-column align-items-end" style={{ minWidth: '100px' }}>
                            <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              Valor Pago
                            </span>
                            <span className="fw-bold text-success fs-5 mt-1">
                              R$ {pg.valorPago.toFixed(2)}
                            </span>
                          </div>

                          <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>

                          <div className="d-flex align-items-center gap-2">
                            <button 
                              className="btn btn-sm btn-outline-warning p-2"
                              title="Editar assinatura"
                              onClick={() => { if(assinatura) handleEdit(assinatura, pg); }}
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger p-2"
                              title="Remover assinatura"
                              onClick={() => removeAssinatura(assinatura!.id)}
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
