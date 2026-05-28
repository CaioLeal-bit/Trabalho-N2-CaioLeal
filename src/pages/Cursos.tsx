import { Book } from 'lucide-react'

export default function Cursos() {
  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Book size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Catálogo de Cursos</h2>
      </div>
      <p>Navegue por todos os cursos disponíveis na plataforma e comece a estudar agora mesmo.</p>
    </div>
  )
}
