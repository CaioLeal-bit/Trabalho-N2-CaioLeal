import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstudosStore } from '../store/useEstudosStore';
import { BookOpen, User, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function SelecaoPerfil() {
  const { usuarios, login, addUsuario, addToast } = useEstudosStore();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [nomeForm, setNomeForm] = useState('');
  const [emailForm, setEmailForm] = useState('');
  const [senhaForm, setSenhaForm] = useState('');

  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');

  const handleLoginAluno = (id: string) => {
    login(id);
    navigate('/aluno/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeForm || !emailForm || !senhaForm) return;

    // Verificar se email ja existe
    if (usuarios.some(u => u.email === emailForm)) {
      addToast('Já existe um usuário com esse email.', 'error');
      return;
    }

    await addUsuario({ nome: nomeForm, email: emailForm, perfil: 'ALUNO', senha: senhaForm });
    
    // Pegar o ID do usuário recém-criado na store e já logar
    const usuariosAtualizados = useEstudosStore.getState().usuarios;
    const novoUser = usuariosAtualizados.find(u => u.email === emailForm);
    if (novoUser) {
      handleLoginAluno(novoUser.id);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailLogin || !senhaLogin) return;

    const user = usuarios.find(u => u.email === emailLogin && u.perfil === 'ALUNO');
    
    if (!user) {
      addToast('Usuário não encontrado.', 'error');
      return;
    }

    // Como usuários antigos podem não ter senha, vamos logar se a senha bater ou se ele não tiver senha ainda (para facilitar o teste)
    if (user.senha && user.senha !== senhaLogin) {
      addToast('Senha incorreta.', 'error');
      return;
    }

    handleLoginAluno(user.id);
  };

  const handleAdmin = () => {
    navigate('/admin/cursos');
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100" style={{ background: 'var(--bg-color)' }}>
      <div className="text-center mb-5">
        <BookOpen size={64} className="text-primary mb-3" />
        <h1 className="fw-bold text-white mb-2">Bem-vindo ao EstudaAê</h1>
        <p className="text-muted fs-5">Selecione como deseja acessar a plataforma</p>
      </div>

      <div className="row w-100 max-w-4xl justify-content-center align-items-stretch gap-4 px-3" style={{ maxWidth: '1000px' }}>
        
        {/* Card Aluno */}
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card h-100 shadow-lg border border-secondary border-opacity-50 transition-all hover-lift" style={{ background: 'var(--surface)', borderRadius: '16px' }}>
            <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center">
              <div className="rounded-circle bg-info bg-opacity-25 d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                <User size={40} className="text-info" />
              </div>
              <h3 className="text-white fw-bold mb-3">Área do Aluno</h3>
              <p className="text-muted mb-4">Acesse seus cursos, assista aulas, acompanhe seu progresso e emita certificados.</p>
              
              <div className="w-100 mt-3">
                {isRegistering ? (
                  <form onSubmit={handleRegister} className="text-start">
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Nome Completo</label>
                      <input 
                        type="text" 
                        className="form-control bg-dark border-secondary text-white" 
                        placeholder="Seu nome"
                        value={nomeForm}
                        onChange={e => setNomeForm(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-muted small mb-1">E-mail</label>
                      <input 
                        type="email" 
                        className="form-control bg-dark border-secondary text-white" 
                        placeholder="seu@email.com"
                        value={emailForm}
                        onChange={e => setEmailForm(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-muted small mb-1">Senha</label>
                      <input 
                        type="password" 
                        className="form-control bg-dark border-secondary text-white" 
                        placeholder="Sua senha"
                        value={senhaForm}
                        onChange={e => setSenhaForm(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <button type="submit" className="btn btn-info fw-bold w-100 py-2">Criar Conta e Entrar</button>
                      <button type="button" onClick={() => setIsRegistering(false)} className="btn btn-link text-muted text-decoration-none d-flex justify-content-center align-items-center gap-2">
                        <ArrowLeft size={16}/> Voltar para Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="text-start">
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">E-mail</label>
                      <input 
                        type="email" 
                        className="form-control bg-dark border-secondary text-white" 
                        placeholder="seu@email.com"
                        value={emailLogin}
                        onChange={e => setEmailLogin(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-muted small mb-1">Senha</label>
                      <input 
                        type="password" 
                        className="form-control bg-dark border-secondary text-white" 
                        placeholder="Sua senha"
                        value={senhaLogin}
                        onChange={e => setSenhaLogin(e.target.value)}
                        required
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-info w-100 py-3 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
                      <User size={18} /> Entrar como Aluno
                    </button>
                    
                    <div className="text-center mt-4">
                      <span className="text-muted small">Ainda não tem conta?</span>
                      <button type="button" onClick={() => setIsRegistering(true)} className="btn btn-link text-info fw-bold text-decoration-none p-0 ms-2">
                        Criar Conta
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Admin */}
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card h-100 shadow-lg border border-secondary border-opacity-50 transition-all hover-lift" style={{ background: 'var(--surface)', borderRadius: '16px' }}>
            <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center">
              <div className="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                <ShieldCheck size={40} className="text-primary" />
              </div>
              <h3 className="text-white fw-bold mb-3">Painel Administrativo</h3>
              <p className="text-muted mb-4">Gerencie cursos, módulos, trilhas, assinaturas, certificados e contas de usuários.</p>
              
              <button onClick={handleAdmin} className="btn btn-primary w-100 py-3 fw-bold mt-3">
                Acessar Administração
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
