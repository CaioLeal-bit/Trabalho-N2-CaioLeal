import { useState } from 'react';
import { Award } from 'lucide-react';
import { useEstudosStore } from '../store/useEstudosStore';

export default function Certificados() {
  const { usuarios, cursos, trilhas, certificados, emitirCertificado } = useEstudosStore();
  
  const [usuarioId, setUsuarioId] = useState('');
  const [tipoConclusao, setTipoConclusao] = useState<'Curso' | 'Trilha'>('Curso');
  const [referenciaId, setReferenciaId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || !referenciaId) return;
    
    if (tipoConclusao === 'Curso') {
      emitirCertificado(usuarioId, referenciaId, undefined);
    } else {
      emitirCertificado(usuarioId, undefined, referenciaId);
    }
    
    setUsuarioId('');
    setReferenciaId('');
    alert('Certificado gerado com sucesso!');
  };

  const alunos = usuarios.filter(u => u.perfil === 'ALUNO');

  return (
    <div className="page-container container-fluid">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Award size={32} style={{ color: 'var(--primary)' }} />
        <h2 className="m-0 border-0">Gestão de Certificados</h2>
      </div>
      
      <div className="row">
        <div className="col-md-5">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Simular Emissão de Certificado</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Selecionar Aluno</label>
                <select className="form-select" value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
                  <option value="">-- Escolha --</option>
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Tipo de Conclusão</label>
                <select className="form-select" value={tipoConclusao} onChange={e => { setTipoConclusao(e.target.value as 'Curso' | 'Trilha'); setReferenciaId(''); }}>
                  <option value="Curso">Conclusão de Curso</option>
                  <option value="Trilha">Conclusão de Trilha</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">{tipoConclusao === 'Curso' ? 'Selecione o Curso' : 'Selecione a Trilha'}</label>
                <select className="form-select" value={referenciaId} onChange={e => setReferenciaId(e.target.value)} required>
                  <option value="">-- Escolha --</option>
                  {tipoConclusao === 'Curso' 
                    ? cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)
                    : trilhas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)
                  }
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">Emitir Certificado</button>
            </form>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card shadow-sm p-3 mb-4">
            <h4>Certificados Emitidos</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Referência</th>
                    <th>Código de Validação</th>
                    <th>Data de Emissão</th>
                  </tr>
                </thead>
                <tbody>
                  {certificados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">Nenhum certificado emitido.</td>
                    </tr>
                  ) : (
                    certificados.map(cert => {
                      const aluno = usuarios.find(u => u.id === cert.usuarioId);
                      const curso = cert.cursoId ? cursos.find(c => c.id === cert.cursoId) : null;
                      const trilha = cert.trilhaId ? trilhas.find(t => t.id === cert.trilhaId) : null;
                      
                      return (
                        <tr key={cert.id}>
                          <td className="fw-bold">{aluno?.nome || 'Desconhecido'}</td>
                          <td>
                            {curso && <span className="badge bg-primary">Curso: {curso.titulo}</span>}
                            {trilha && <span className="badge bg-info text-dark">Trilha: {trilha.titulo}</span>}
                          </td>
                          <td className="font-monospace text-muted small">{cert.codigoValidacao}</td>
                          <td>{new Date(cert.dataEmissao).toLocaleDateString()}</td>
                        </tr>
                      )
                    })
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
