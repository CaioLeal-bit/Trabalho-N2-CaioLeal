import { CreditCard } from 'lucide-react'

export default function Assinaturas() {
  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <CreditCard size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Assinaturas</h2>
      </div>
      <p>Controle planos, pagamentos e o status de assinatura dos alunos.</p>
    </div>
  )
}
