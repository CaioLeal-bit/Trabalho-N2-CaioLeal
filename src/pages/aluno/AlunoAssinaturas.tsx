import { useState, useEffect } from 'react';
import { useEstudosStore } from '../../store/useEstudosStore';
import { CreditCard, CheckCircle, ShieldCheck, Tag, Lock, DollarSign } from 'lucide-react';

export default function AlunoAssinaturas() {
  const { planos, usuarioLogadoId, simularAssinatura, assinaturas } = useEstudosStore();
  
  const [planoSelecionado, setPlanoSelecionado] = useState<string>('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Se o usuário já tiver assinatura ativa, vamos avisar (mas ele pode assinar outro plano se quiser, ou estender)
  const assinaturaAtiva = assinaturas.find(a => a.usuarioId === usuarioLogadoId && new Date(a.dataFim) > new Date());

  useEffect(() => {
    if (planos.length > 0 && !planoSelecionado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlanoSelecionado(planos[0].id);
    }
  }, [planos, planoSelecionado]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    if (val.length > 19) val = val.substring(0, 19);
    setNumeroCartao(val);
  };

  const handleValidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 3) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setValidade(val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    setCvv(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planoSelecionado || !usuarioLogadoId) return;

    // Simular carregamento e aprovação
    simularAssinatura(usuarioLogadoId, planoSelecionado, 'Cartao');
    
    setShowSuccessPopup(true);
  };

  const planoObj = planos.find(p => p.id === planoSelecionado);

  return (
    <div className="container-fluid py-4 max-w-5xl mx-auto" style={{ maxWidth: '1000px' }}>

      <div className="text-center mb-5">
        <h2 className="text-white fw-bold display-6">Escolha seu Plano</h2>
        <p className="text-muted fs-5">Tenha acesso ilimitado a todos os cursos e trilhas da plataforma.</p>
        
        {assinaturaAtiva && (
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-success bg-opacity-25 border border-success border-opacity-50 text-success mt-2">
            <CheckCircle size={16} /> Você já possui uma assinatura ativa até {new Date(assinaturaAtiva.dataFim).toLocaleDateString()}.
          </div>
        )}
      </div>

      <div className="row g-5">
        {/* SELEÇÃO DE PLANOS */}
        <div className="col-12 col-lg-6">
          <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
            <Tag className="text-primary" /> Planos Disponíveis
          </h5>
          <div className="d-flex flex-column gap-3">
            {planos.map(plano => (
              <div 
                key={plano.id}
                onClick={() => setPlanoSelecionado(plano.id)}
                className={`card border-2 cursor-pointer transition-all ${planoSelecionado === plano.id ? 'border-primary bg-primary bg-opacity-10' : 'border-dark bg-dark hover-lift'}`}
                style={{ borderRadius: '12px', cursor: 'pointer' }}
              >
                <div className="card-body p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="text-white fw-bold mb-1">{plano.nome}</h5>
                    <p className="text-muted small mb-0">{plano.descricao}</p>
                    <span className="badge bg-secondary bg-opacity-25 text-white mt-2">
                      Acesso por {plano.duracaoMeses} {plano.duracaoMeses === 1 ? 'mês' : 'meses'}
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fs-3 fw-bold text-white d-flex align-items-center justify-content-end gap-1">
                      <span className="fs-6 text-muted fw-normal">R$</span>
                      {plano.preco.toFixed(2)}
                    </div>
                    {planoSelecionado === plano.id && (
                      <div className="text-primary small fw-bold d-flex align-items-center gap-1 justify-content-end mt-1">
                        <CheckCircle size={14} /> Selecionado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {planos.length === 0 && (
              <div className="text-muted text-center py-4 bg-dark rounded border" style={{ borderColor: 'var(--border-subtle)' }}>Nenhum plano cadastrado no sistema.</div>
            )}
          </div>
        </div>

        {/* CHECKOUT */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 bg-dark shadow-lg h-100" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4 p-md-5">
              <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <ShieldCheck className="text-success" /> Pagamento Seguro
              </h5>

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                
                {/* DADOS DO CARTÃO (SIMULADO) */}
                <div className="p-4 rounded border" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="text-white fw-bold">Cartão de Crédito</span>
                    <div className="d-flex gap-2 text-muted">
                      <CreditCard size={24} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small">Número do Cartão</label>
                    <input 
                      type="text" 
                      className="form-control bg-dark border-secondary text-white" 
                      placeholder="0000 0000 0000 0000"
                      value={numeroCartao}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small">Nome no Cartão</label>
                    <input 
                      type="text" 
                      className="form-control bg-dark border-secondary text-white" 
                      placeholder="NOME IMPRESSO"
                      value={nomeCartao}
                      onChange={e => setNomeCartao(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-muted small">Validade</label>
                      <input 
                        type="text" 
                        className="form-control bg-dark border-secondary text-white" 
                        placeholder="MM/AA"
                        value={validade}
                        onChange={handleValidadeChange}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">CVV</label>
                      <input 
                        type="text" 
                        className="form-control bg-dark border-secondary text-white" 
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* RESUMO */}
                <div className="d-flex justify-content-between align-items-center p-3 rounded bg-primary bg-opacity-10 border border-primary border-opacity-25 mt-2">
                  <span className="text-white">Total a pagar:</span>
                  <span className="fs-3 fw-bold text-white d-flex align-items-center gap-1">
                    <DollarSign size={24} className="text-primary"/>
                    {planoObj ? planoObj.preco.toFixed(2) : '0.00'}
                  </span>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-3 mt-2 shadow" disabled={!planoObj}>
                  Concluir Assinatura
                </button>
                
                <p className="text-center text-muted small mb-0 mt-2">
                  <Lock size={12} className="me-1"/> Isso é apenas uma simulação. Nenhum valor real será cobrado.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SUCESSO */}
      {showSuccessPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 9999 }}>
          <div className="bg-dark border border-success rounded-4 p-5 text-center shadow-lg" style={{ maxWidth: '450px' }}>
            <CheckCircle size={80} className="text-success mb-4" />
            <h2 className="text-white fw-bold mb-3">Pagamento Aprovado!</h2>
            <p className="text-muted fs-5 mb-4">Sua assinatura foi ativada com sucesso. Agora você já tem acesso a todos os cursos do plano.</p>
            <button className="btn btn-success fw-bold px-5 py-3 w-100 rounded-3" onClick={() => setShowSuccessPopup(false)}>
              Continuar na Página
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
