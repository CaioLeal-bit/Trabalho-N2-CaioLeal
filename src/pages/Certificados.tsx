import { Award } from 'lucide-react'

export default function Certificados() {
  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Award size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Certificados</h2>
      </div>
      <p>Visualize e emita certificados para os alunos concluintes.</p>
    </div>
  )
}
