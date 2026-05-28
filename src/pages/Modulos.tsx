import { Layers } from 'lucide-react'

export default function Modulos() {
  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Layers size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gerenciamento de Módulos</h2>
      </div>
      <p>Visualize e organize a estrutura dos seus cursos em módulos detalhados.</p>
    </div>
  )
}
