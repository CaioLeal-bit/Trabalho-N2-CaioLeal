import { useEstudosStore } from '../../store/useEstudosStore';
import { Award, Download, Calendar, ExternalLink } from 'lucide-react';

export default function AlunoCertificados() {
  const { certificados, cursos, trilhas, usuarioLogadoId, usuarios, addToast } = useEstudosStore();

  const usuario = usuarios.find(u => u.id === usuarioLogadoId);
  const meusCertificados = certificados.filter(c => c.usuarioId === usuarioLogadoId);

  return (
    <div className="container-fluid py-4 max-w-5xl mx-auto" style={{ maxWidth: '1000px' }}>
      
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-warning bg-opacity-25 mb-4">
          <Award size={48} className="text-warning" />
        </div>
        <h2 className="text-white fw-bold display-6">Minhas Conquistas</h2>
        <p className="text-muted fs-5">Todos os seus certificados de conclusão oficiais em um só lugar.</p>
      </div>

      {meusCertificados.length === 0 ? (
        <div className="card bg-dark border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-body p-5 text-center">
            <h5 className="text-white mb-3">Você ainda não possui certificados.</h5>
            <p className="text-muted">Conclua todos os módulos de um curso ou finalize uma trilha para receber seu certificado digital exclusivo.</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {meusCertificados.map(cert => {
            const isCurso = !!cert.cursoId;
            const referenciado = isCurso 
              ? cursos.find(c => c.id === cert.cursoId) 
              : trilhas.find(t => t.id === cert.trilhaId);

            const tipo = isCurso ? 'Curso' : 'Trilha';
            const titulo = referenciado?.titulo || 'Desconhecido';
            const dataStr = new Date(cert.dataEmissao).toLocaleDateString();

            return (
              <div key={cert.id} className="col-12 col-md-6">
                <div className="card bg-dark border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: '12px' }}>
                  
                  {/* Borda decorativa lateral */}
                  <div className={`position-absolute top-0 bottom-0 start-0 ${isCurso ? 'bg-primary' : 'bg-warning'}`} style={{ width: '6px' }}></div>
                  
                  <div className="card-body p-4 ps-5">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge ${isCurso ? 'bg-primary bg-opacity-25 text-primary border border-primary' : 'bg-warning bg-opacity-25 text-warning border border-warning'} border-opacity-25`}>
                        {tipo} Concluído
                      </span>
                      <span className="text-muted small d-flex align-items-center gap-1">
                        <Calendar size={14} /> {dataStr}
                      </span>
                    </div>

                    <h5 className="text-white fw-bold mb-1">{titulo}</h5>
                    <p className="text-muted small mb-4">Emitido para {usuario?.nome}</p>

                    <div className="d-flex align-items-center gap-2 p-2 rounded bg-secondary bg-opacity-25 mb-4" style={{ border: '1px dashed var(--border-subtle)' }}>
                      <span className="text-muted small ms-2">Validação:</span>
                      <code className="text-white bg-transparent p-0 fs-6">{cert.codigoValidacao}</code>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-primary d-flex align-items-center gap-2 flex-grow-1 justify-content-center" onClick={() => addToast('Simulação: Download PDF Iniciado', 'info')}>
                        <Download size={18} /> Baixar PDF
                      </button>
                      <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3" title="Copiar Link" onClick={() => addToast('Simulação: Link copiado', 'info')}>
                        <ExternalLink size={18} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
