import { useParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function DetalhesCurso() {
  const { id } = useParams()

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <BookOpen size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Detalhes do Curso {id ? `#${id}` : ''}</h2>
      </div>
      <p>Informações detalhadas sobre o curso selecionado (em construção).</p>
    </div>
  )
}
