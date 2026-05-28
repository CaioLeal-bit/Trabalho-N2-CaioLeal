import { Users } from 'lucide-react'

export default function Usuarios() {
  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Users size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Usuários</h2>
      </div>
      <p>Gerencie os perfis de alunos e professores cadastrados na plataforma.</p>
    </div>
  )
}
