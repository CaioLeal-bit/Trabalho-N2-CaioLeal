import { useState } from 'react';
import { Award, CheckCircle, FileText, Download, User, Check, Bookmark, Route, ChevronDown, Pencil, X, Trash } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';
import type { Certificado } from '../store/useEstudosStore';

export default function Certificados() {
  const { usuarios, cursos, trilhas, certificados, emitirCertificado, updateCertificado, removeCertificado, addToast } = useEstudosStore();
  
  const [usuarioId, setUsuarioId] = useState('');
  const [tipoConclusao, setTipoConclusao] = useState<'Curso' | 'Trilha'>('Curso');
  const [referenciaId, setReferenciaId] = useState('');
  const [certificadoEditando, setCertificadoEditando] = useState<string | null>(null);

  const [alunoDropdownOpen, setAlunoDropdownOpen] = useState(false);
  const [tipoDropdownOpen, setTipoDropdownOpen] = useState(false);
  const [referenciaDropdownOpen, setReferenciaDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || !referenciaId) return;
    
    if (certificadoEditando) {
      updateCertificado(certificadoEditando, {
        usuarioId,
        cursoId: tipoConclusao === 'Curso' ? referenciaId : undefined,
        trilhaId: tipoConclusao === 'Trilha' ? referenciaId : undefined
      });
      setCertificadoEditando(null);
      addToast('Certificado atualizado com sucesso!', 'success');
    } else {
      if (tipoConclusao === 'Curso') {
        emitirCertificado(usuarioId, referenciaId, undefined);
      } else {
        emitirCertificado(usuarioId, undefined, referenciaId);
      }
      addToast('Certificado emitido e registrado no sistema!', 'success');
    }
    
    setUsuarioId('');
    setReferenciaId('');
  };

  const handleEdit = (cert: Certificado) => {
    setCertificadoEditando(cert.id);
    setUsuarioId(cert.usuarioId);
    setTipoConclusao(cert.cursoId ? 'Curso' : 'Trilha');
    setReferenciaId(cert.cursoId || cert.trilhaId || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setCertificadoEditando(null);
    setUsuarioId('');
    setReferenciaId('');
    setTipoConclusao('Curso');
  };

  const alunos = usuarios.filter(u => u.perfil === 'ALUNO');

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="p-3 rounded-circle" style={{ background: 'var(--primary-light)' }}>
          <Award size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 className="m-0 border-0 pb-0">Registro de Certificados</h2>
          <p className="m-0 text-muted mt-1">Emita e valide diplomas oficiais de conclusão de cursos e trilhas.</p>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Painel de Emissão */}
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm" style={{ borderTop: '4px solid var(--primary)' }}>
            <div className="card-body p-4">
              <h4 className="d-flex align-items-center gap-2 mb-4 text-white">
                {certificadoEditando ? <Pencil size={20} className="text-warning" /> : <FileText size={20} className="text-primary" />}
                {certificadoEditando ? 'Editar Emissão' : 'Nova Emissão'}
              </h4>
              
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <label className="form-label d-flex align-items-center gap-2 text-white mb-2">
                    <User size={16} className="text-info"/> Selecionar Aluno
                  </label>
                  <div className="position-relative mt-1">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--info)' }}>
                        <User size={18} />
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => setAlunoDropdownOpen(!alunoDropdownOpen)}
                      >
                        <span className="text-white">
                          {usuarioId ? alunos.find(a => a.id === usuarioId)?.nome : '-- Buscar aluno --'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: alunoDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {alunoDropdownOpen && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setAlunoDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          <div 
                            className="px-3 py-2 text-muted hover-bg cursor-pointer"
                            style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                            onClick={() => { setUsuarioId(''); setAlunoDropdownOpen(false); }}
                          >
                            -- Buscar aluno --
                          </div>
                          {alunos.map(a => (
                            <div 
                              key={a.id}
                              className={`px-3 py-2 cursor-pointer ${usuarioId === a.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => { setUsuarioId(a.id); setAlunoDropdownOpen(false); }}
                            >
                              {a.nome}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <label className="form-label d-flex align-items-center gap-2 text-white mb-2">
                    <Check size={16} className="text-success"/> Tipo de Conclusão
                  </label>
                  <div className="position-relative mt-1 mb-3">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--success)' }}>
                        <Check size={18} />
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => setTipoDropdownOpen(!tipoDropdownOpen)}
                      >
                        <span className="text-white">
                          {tipoConclusao === 'Curso' ? 'Conclusão de Curso Específico' : 'Conclusão de Trilha Completa'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: tipoDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {tipoDropdownOpen && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setTipoDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          {[
                            { value: 'Curso', label: 'Conclusão de Curso Específico' },
                            { value: 'Trilha', label: 'Conclusão de Trilha Completa' }
                          ].map(opt => (
                            <div 
                              key={opt.value}
                              className={`px-3 py-2 cursor-pointer ${tipoConclusao === opt.value ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              onClick={() => { setTipoConclusao(opt.value as 'Curso' | 'Trilha'); setReferenciaId(''); setTipoDropdownOpen(false); }}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <label className="form-label d-flex align-items-center gap-2 text-white mb-2">
                    {tipoConclusao === 'Curso' ? <Bookmark size={16} className="text-warning"/> : <Route size={16} className="text-warning"/>} 
                    {tipoConclusao === 'Curso' ? 'Qual Curso?' : 'Qual Trilha?'}
                  </label>
                  <div className="position-relative mt-1">
                    <div className="d-flex align-items-stretch" style={{ height: '48px' }}>
                      <div className="d-flex align-items-center justify-content-center px-3 rounded-start border border-end-0" style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--warning)' }}>
                        {tipoConclusao === 'Curso' ? <Bookmark size={18} /> : <Route size={18} />}
                      </div>
                      <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-between px-3 border rounded-end cursor-pointer"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                        onClick={() => setReferenciaDropdownOpen(!referenciaDropdownOpen)}
                      >
                        <span className="text-white">
                          {referenciaId ? (tipoConclusao === 'Curso' ? cursos.find(c => c.id === referenciaId)?.titulo : trilhas.find(t => t.id === referenciaId)?.titulo) : '-- Selecionar item --'}
                        </span>
                        <ChevronDown size={18} className="text-muted" style={{ transform: referenciaDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    
                    {referenciaDropdownOpen && (
                      <>
                        <div className="position-fixed top-0 bottom-0 start-0 end-0" onClick={() => setReferenciaDropdownOpen(false)} style={{ zIndex: 10 }}></div>
                        <div className="position-absolute w-100 mt-1 rounded border shadow-lg overflow-hidden" style={{ background: 'var(--bg-color)', borderColor: 'var(--border-subtle)', zIndex: 11 }}>
                          <div 
                            className="px-3 py-2 text-muted hover-bg cursor-pointer"
                            style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                            onClick={() => { setReferenciaId(''); setReferenciaDropdownOpen(false); }}
                          >
                            -- Selecionar item --
                          </div>
                          {(tipoConclusao === 'Curso' ? cursos : trilhas).map((item: { id: string; titulo: string }) => (
                            <div 
                              key={item.id}
                              className={`px-3 py-2 cursor-pointer ${referenciaId === item.id ? 'bg-primary text-white' : 'text-white hover-bg'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => { setReferenciaId(item.id); setReferenciaDropdownOpen(false); }}
                            >
                              {item.titulo}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className={`btn ${certificadoEditando ? 'btn-warning text-dark' : 'btn-primary'} flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2`}>
                    {certificadoEditando ? <Pencil size={18} /> : <CheckCircle size={18} />}
                    {certificadoEditando ? 'Salvar Alterações' : 'Emitir e Assinar Digitalmente'}
                  </button>
                  {certificadoEditando && (
                    <button type="button" className="btn btn-outline-secondary py-2 px-3" onClick={handleCancelEdit} title="Cancelar edição">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Listagem de Certificados */}
        <div className="col-lg-8">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-4 d-flex align-items-center gap-2">
                <Award size={20} className="text-primary"/> Livro de Registros <span className="badge bg-primary ms-2 rounded-pill">{certificados.length}</span>
              </h4>
              
              <div className="d-flex flex-column gap-3">
                {certificados.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-dark bg-opacity-25" style={{ borderColor: 'var(--border-subtle)' }}>
                    <Award size={48} opacity={0.2} className="mb-3"/>
                    <p className="m-0">Nenhum certificado emitido na plataforma.</p>
                  </div>
                ) : (
                  certificados.slice().reverse().map(cert => {
                    const aluno = usuarios.find(u => u.id === cert.usuarioId);
                    const curso = cert.cursoId ? cursos.find(c => c.id === cert.cursoId) : null;
                    const trilha = cert.trilhaId ? trilhas.find(t => t.id === cert.trilhaId) : null;
                    
                    return (
                      <div 
                        key={cert.id} 
                        className="p-3 rounded transition-all d-flex flex-wrap justify-content-between align-items-center bg-dark bg-opacity-50 hover-lift"
                        style={{ border: '1px solid var(--border-subtle)' }}
                      >
                        {/* Certificate & User Info */}
                        <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-warning bg-warning bg-opacity-25" 
                            style={{ width: '48px', height: '48px', border: '1px solid var(--warning)' }}
                          >
                            <Award size={20} />
                          </div>
                          <div>
                            <div className="fw-bold fs-5 text-white mb-1">
                              {aluno?.nome || 'Desconhecido'}
                            </div>
                            <div className="d-flex flex-column gap-1">
                              {curso && <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 px-2 py-1 text-truncate" style={{ maxWidth: '250px' }} title={curso.titulo}><Bookmark size={10} className="me-1"/> Curso: {curso.titulo}</span>}
                              {trilha && <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25 px-2 py-1 text-truncate" style={{ maxWidth: '250px' }} title={trilha.titulo}><Route size={10} className="me-1"/> Trilha: {trilha.titulo}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Certificate Details & Actions */}
                        <div className="d-flex align-items-center gap-4">
                          <div className="d-flex flex-column align-items-end">
                            <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              Código de Autenticidade
                            </span>
                            <span className="font-monospace small text-primary bg-primary bg-opacity-10 px-2 py-1 rounded border border-primary border-opacity-25 mt-1" style={{ fontSize: '0.75rem' }}>
                              {cert.codigoValidacao}
                            </span>
                          </div>
                          
                          <div className="d-flex flex-column align-items-end">
                            <span className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              Data
                            </span>
                            <span className="text-muted small mt-1">
                              {new Date(cert.dataEmissao).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary p-2"
                              title="Baixar PDF (Simulação)"
                            >
                              <Download size={18} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-warning p-2"
                              title="Editar certificado"
                              onClick={() => handleEdit(cert)}
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger p-2"
                              title="Remover certificado"
                              onClick={() => removeCertificado(cert.id)}
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
