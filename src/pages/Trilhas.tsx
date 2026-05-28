import { Map } from 'lucide-react'

export default function Trilhas() {
  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Map size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Trilhas de Aprendizado</h2>
      </div>
      <p>Explore os caminhos de conhecimento que preparamos para estruturar seu aprendizado.</p>
    </div>
  )
}
