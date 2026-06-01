import { useState } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function Usuarios() {
  const { usuarios, addUsuario, removeUsuario } = useEstudosStore();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState<'ADMIN' | 'ALUNO'>('ALUNO');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;
    
    addUsuario({ nome, email, perfil });
    
    setNome('');
    setEmail('');
    setPerfil('ALUNO');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Users size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gestão de Usuários</h2>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Novo Usuário</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome Completo</label>
                <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Perfil</label>
                <select className="form-select" value={perfil} onChange={e => setPerfil(e.target.value as 'ADMIN' | 'ALUNO')}>
                  <option value="ALUNO">Aluno</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">Adicionar Usuário</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h4>Usuários Cadastrados</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Perfil</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">Nenhum usuário cadastrado.</td>
                    </tr>
                  ) : (
                    usuarios.map(usr => (
                      <tr key={usr.id}>
                        <td className="fw-bold">{usr.nome}</td>
                        <td>{usr.email}</td>
                        <td>
                          <span className={`badge ${usr.perfil === 'ADMIN' ? 'bg-danger' : 'bg-success'}`}>
                            {usr.perfil}
                          </span>
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeUsuario(usr.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
