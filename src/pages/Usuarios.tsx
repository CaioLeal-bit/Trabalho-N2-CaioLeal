import { useState } from 'react';
import { Users, Trash, Shield, User, Mail, PlusCircle, Pencil, ChevronDown } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Usuario } from '../store/useEstudosStore';

export default function Usuarios() {
  const { usuarios, addUsuario, updateUsuario, removeUsuario } = useEstudosStore();
  
  const [usuarioEditando, setUsuarioEditando] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState<'ADMIN' | 'ALUNO'>('ALUNO');
  const [perfilDropdownOpen, setPerfilDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;
    
    if (usuarioEditando) {
      updateUsuario(usuarioEditando, { nome, email, perfil });
      setUsuarioEditando(null);
    } else {
      addUsuario({ nome, email, perfil });
    }
    
    setNome('');
    setEmail('');
    setPerfil('ALUNO');
  };

  const handleEdit = (usr: Usuario) => {
    setUsuarioEditando(usr.id);
    setNome(usr.nome);
    setEmail(usr.email);
    setPerfil(usr.perfil);
  };

  const cancelarEdicao = () => {
    setUsuarioEditando(null);
    setNome('');
    setEmail('');
    setPerfil('ALUNO');
  };

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <Users size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Gestão de Usuários</h2>
          <p className="m-0 text-muted mt-1">Administre acessos, alunos e professores cadastrados na plataforma.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Formulário */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="d-flex align-items-center gap-2 mb-4">
                {usuarioEditando ? <Pencil size={20} className="text-primary" /> : <PlusCircle size={20} className="text-primary" />}
                {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
              </h4>
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <User size={16} /> Nome Completo
                  </label>
                  <input type="text" className="form-control" placeholder="Ex: João da Silva" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label d-flex align-items-center gap-2">
                    <Mail size={16} /> E-mail
                  </label>
                  <input type="email" className="form-control" placeholder="joao@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <div className="position-relative mt-1">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--primary)' }}>
                        <Shield size={18} />
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--primary)', cursor: 'pointer' }}
                        onClick={() => setPerfilDropdownOpen(!perfilDropdownOpen)}
                      >
                        <span className="text-white">
                          {perfil === 'ALUNO' ? 'Aluno (Acesso Padrão)' : 'Administrador (Controle Total)'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: perfilDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {perfilDropdownOpen && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setPerfilDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          <div 
                            className={`px-3 py-2 cursor-pointer ${perfil === 'ALUNO' ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                            onClick={() => { setPerfil('ALUNO'); setPerfilDropdownOpen(false); }}
                          >
                            Aluno (Acesso Padrão)
                          </div>
                          <div 
                            className={`px-3 py-2 cursor-pointer ${perfil === 'ADMIN' ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                            onClick={() => { setPerfil('ADMIN'); setPerfilDropdownOpen(false); }}
                          >
                            Administrador (Controle Total)
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <button type="submit" className="btn btn-primary w-100 py-2">
                    {usuarioEditando ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                  </button>
                  
                  {usuarioEditando && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100 py-2 mt-2"
                      onClick={cancelarEdicao}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body p-4">
              <h4 className="mb-4">Usuários Cadastrados <span className="badge bg-primary ms-2 rounded-pill">{usuarios.length}</span></h4>
              <div className="d-flex flex-column gap-3">
                {usuarios.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex flex-column align-items-center gap-2">
                      <Users size={48} opacity={0.2} />
                      <p className="m-0 mt-2">A base de usuários está vazia.</p>
                    </div>
                  </div>
                ) : (
                  usuarios.map(usr => (
                    <div 
                      key={usr.id} 
                      className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      {/* User Info */}
                      <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" 
                          style={{ width: '48px', height: '48px', background: 'var(--primary-light)' }}
                        >
                          {usr.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold fs-5 text-white mb-1">{usr.nome}</div>
                          <div className="text-muted small d-flex align-items-center gap-1">
                            <Mail size={14} /> {usr.email}
                          </div>
                        </div>
                      </div>

                      {/* Actions & Badges */}
                      <div className="d-flex align-items-center gap-4">
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Nível de Acesso
                          </span>
                          <span className={`badge mt-1 d-inline-flex align-items-center gap-1 ${
                            usr.perfil === 'ADMIN' 
                              ? 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50' 
                              : 'bg-success bg-opacity-25 text-success border border-success border-opacity-50'
                          }`}>
                            {usr.perfil === 'ADMIN' ? <Shield size={12}/> : <User size={12}/>}
                            {usr.perfil}
                          </span>
                        </div>
                        
                        <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>
                        
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary p-2"
                            title="Editar usuário"
                            onClick={() => handleEdit(usr)}
                          >
                            <Pencil size={18} />
                          </button>
                          
                          <button 
                            className="btn btn-sm btn-outline-danger p-2"
                            title="Remover usuário"
                            onClick={() => removeUsuario(usr.id)}
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
