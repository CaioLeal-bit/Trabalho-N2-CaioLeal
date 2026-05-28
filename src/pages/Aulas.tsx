import { PlayCircle } from 'lucide-react'

export default function Aulas() {
  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <PlayCircle size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Aulas</h2>
      </div>
      <p>Acesse o conteúdo em vídeo, materiais de apoio e exercícios das aulas.</p>
    </div>
  )
}
