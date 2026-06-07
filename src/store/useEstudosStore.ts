import { create } from 'zustand';

import { v4 as uuidv4 } from 'uuid';
import { addMonths } from 'date-fns';

export type Usuario = { id: string; nome: string; email: string; perfil: 'ADMIN' | 'ALUNO'; senha?: string; dataCadastro?: string };
export type Categoria = { id: string; nome: string; descricao: string };
export type Plano = { id: string; nome: string; descricao: string; preco: number; duracaoMeses: number };
export type Curso = { id: string; titulo: string; descricao: string; instrutor: string; categoria: string; nivel: string; dataPublicacao: string; totalAulas: number; totalHoras: number };
export type Modulo = { id: string; cursoId: string; titulo: string; ordem: number };
export type Aula = { id: string; moduloId: string; titulo: string; tipo: 'Video'; url: string; duracaoMinutos: number; ordem: number };
export type Trilha = { id: string; titulo: string; descricao: string; categoria: string };

export type TrilhaCurso = { id: string; trilhaId: string; cursoId: string; ordem: number };
export type Assinatura = { id: string; usuarioId: string; planoId: string; dataInicio: string; dataFim: string };
export type Pagamento = { id: string; assinaturaId: string; valorPago: number; dataPagamento: string; metodo: 'Cartao' | 'Pix' | 'Boleto'; idTransacao: string };
export type Matricula = { id: string; usuarioId: string; cursoId: string; dataMatricula: string; dataConclusao?: string };
export type ProgressoAula = { id: string; usuarioId: string; aulaId: string; dataConclusao?: string; status: 'Nao Iniciado' | 'Em Andamento' | 'Concluido' };
export type Avaliacao = { id: string; usuarioId: string; cursoId: string; nota: number; comentario?: string; dataAvaliacao: string };
export type Certificado = { id: string; usuarioId: string; cursoId?: string; trilhaId?: string; codigoValidacao: string; dataEmissao: string };
export type ToastMessage = { id: string; message: string; type: 'success' | 'error' | 'info' };

const API_URL = 'http://localhost:3001';

type EstudosState = {
  fetchInitialData: () => Promise<void>;
  usuarioLogadoId: string | null;
  usuarios: Usuario[];
  categorias: Categoria[];
  planos: Plano[];
  cursos: Curso[];
  modulos: Modulo[];
  aulas: Aula[];
  trilhas: Trilha[];
  trilhasCursos: TrilhaCurso[];
  assinaturas: Assinatura[];
  pagamentos: Pagamento[];
  matriculas: Matricula[];
  progressos: ProgressoAula[];
  certificados: Certificado[];
  avaliacoes: Avaliacao[];
  toasts: ToastMessage[];

  // Actions Toast
  addToast: (message: string, type?: 'success' | 'error' | 'info') => Promise<void> | void;
  removeToast: (id: string) => Promise<void> | void;

  // Actions Auth / Session
  login: (id: string) => Promise<void> | void;
  logout: () => Promise<void> | void;

  // Actions Usuarios
  addUsuario: (u: Omit<Usuario, 'id'>) => Promise<void> | void;
  updateUsuario: (id: string, u: Partial<Usuario>) => Promise<void> | void;
  removeUsuario: (id: string) => Promise<void> | void;

  // Actions Planos
  addPlano: (p: Omit<Plano, 'id'>) => Promise<void> | void;
  updatePlano: (id: string, p: Partial<Plano>) => Promise<void> | void;
  removePlano: (id: string) => Promise<void> | void;

  // Actions Cursos
  addCurso: (c: Omit<Curso, 'id' | 'totalAulas' | 'totalHoras'>) => Promise<void> | void;
  updateCurso: (id: string, c: Partial<Curso>) => Promise<void> | void;
  removeCurso: (id: string) => Promise<void> | void;

  // Actions Modulos
  addModulo: (m: Omit<Modulo, 'id'>) => Promise<void> | void;
  updateModulo: (id: string, m: Partial<Modulo>) => Promise<void> | void;
  removeModulo: (id: string) => Promise<void> | void;

  // Actions Aulas
  addAula: (a: Omit<Aula, 'id'>) => Promise<void> | void;
  updateAula: (id: string, a: Partial<Aula>) => Promise<void> | void;
  removeAula: (id: string) => Promise<void> | void;

  // Actions Trilhas
  addTrilha: (t: Omit<Trilha, 'id'>) => Promise<void> | void;
  updateTrilha: (id: string, t: Partial<Trilha>) => Promise<void> | void;
  removeTrilha: (id: string) => Promise<void> | void;

  // TrilhaCurso (Associativa)
  addTrilhaCurso: (tc: Omit<TrilhaCurso, 'id'>) => Promise<void> | void;
  updateTrilhaCurso: (id: string, tc: Partial<TrilhaCurso>) => Promise<void> | void;
  removeTrilhaCurso: (id: string) => Promise<void> | void;

  // Assinaturas e Pagamentos
  simularAssinatura: (usuarioId: string, planoId: string, metodoPagamento: 'Cartao' | 'Boleto' | 'Pix') => Promise<void> | void;
  updateAssinatura: (id: string, a: Partial<Assinatura>) => Promise<void> | void;
  removeAssinatura: (id: string) => Promise<void> | void;

  // Categoria Actions
  addCategoria: (cat: Omit<Categoria, 'id'>) => Promise<void> | void;
  updateCategoria: (id: string, cat: Partial<Categoria>) => Promise<void> | void;
  removeCategoria: (id: string) => Promise<void> | void;

  // Avaliacoes Actions
  addAvaliacao: (av: Omit<Avaliacao, 'id' | 'dataAvaliacao'>) => Promise<void> | void;

  // Matriculas
  matricular: (usuarioId: string, cursoId: string) => Promise<void> | void;

  // Certificados
  emitirCertificado: (usuarioId: string, cursoId?: string, trilhaId?: string) => Promise<void> | void;
  updateCertificado: (id: string, c: Partial<Certificado>) => Promise<void> | void;
  removeCertificado: (id: string) => Promise<void> | void;
  // Actions Progressos
  atualizarProgresso: (aulaId: string, status: 'Nao Iniciado' | 'Em Andamento' | 'Concluido') => Promise<void> | void;
};


export const apiPost = async (ep: string, data: any) => fetch(`${API_URL}/${ep}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(console.error);
export const apiPut = async (ep: string, id: string, data: any) => fetch(`${API_URL}/${ep}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(console.error);
export const apiPatch = async (ep: string, id: string, data: any) => fetch(`${API_URL}/${ep}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(console.error);
export const apiDelete = async (ep: string, id: string) => fetch(`${API_URL}/${ep}/${id}`, { method: 'DELETE' }).catch(console.error);

export const useEstudosStore = create<EstudosState>()(
  (set, get) => ({
    usuarioLogadoId: null,
    usuarios: [],
    categorias: [],
    planos: [],
    cursos: [],
    modulos: [],
    aulas: [],
    trilhas: [],
    trilhasCursos: [],
    assinaturas: [],
    pagamentos: [],
    matriculas: [],
    progressos: [],
    certificados: [],
    avaliacoes: [],
    toasts: [],
    fetchInitialData: async () => {
      try {
        const endpoints = ['usuarios', 'categorias', 'planos', 'cursos', 'modulos', 'aulas', 'trilhas', 'trilhasCursos', 'assinaturas', 'pagamentos', 'matriculas', 'progressos', 'certificados', 'avaliacoes'];
        const results = await Promise.all(endpoints.map(ep => fetch(`${API_URL}/${ep}`).then(res => res.json())));
        set({
          usuarios: results[0] || [],
          categorias: results[1] || [],
          planos: results[2] || [],
          cursos: results[3] || [],
          modulos: results[4] || [],
          aulas: results[5] || [],
          trilhas: results[6] || [],
          trilhasCursos: results[7] || [],
          assinaturas: results[8] || [],
          pagamentos: results[9] || [],
          matriculas: results[10] || [],
          progressos: results[11] || [],
          certificados: results[12] || [],
          avaliacoes: results[13] || []
        });
      } catch (e) {
        console.error('Erro ao conectar com JSON Server:', e);
      }
    },


    // TOASTS
    addToast: (message, type = 'info') => set((state) => ({ toasts: [...state.toasts, { id: uuidv4(), message, type }] })),
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),

    // AUTH
    login: (id) => set({ usuarioLogadoId: id }),
    logout: () => set({ usuarioLogadoId: null }),

    // USUARIOS
    addUsuario: async (u) => { const novo = { ...u, id: uuidv4(), dataCadastro: new Date().toISOString() }; await apiPost('usuarios', novo); set(state => ({ usuarios: [...state.usuarios, novo] })); },
    updateUsuario: (id, u) => set((state) => ({ usuarios: state.usuarios.map((user) => (user.id === id ? { ...user, ...u } : user)) })),
    removeUsuario: async (id) => { await apiDelete('usuarios', id); set(state => ({ usuarios: state.usuarios.filter(usr => usr.id !== id) })); },

    // PLANOS
    addPlano: async (p) => { const novo = { ...p, id: uuidv4() }; await apiPost('planos', novo); set(state => ({ planos: [...state.planos, novo] })); },
    updatePlano: async (id, p) => { await apiPatch('planos', id, p); set(state => ({ planos: state.planos.map(pl => pl.id === id ? { ...pl, ...p } : pl) })); },
    removePlano: async (id) => { await apiDelete('planos', id); set(state => ({ planos: state.planos.filter(pl => pl.id !== id) })); },

    // CURSOS
    addCurso: async (c) => { const novo = { ...c, id: uuidv4(), totalAulas: 0, totalHoras: 0 }; await apiPost('cursos', novo); set(state => ({ cursos: [...state.cursos, novo] })); },
    updateCurso: async (id, c) => { await apiPatch('cursos', id, c); set(state => ({ cursos: state.cursos.map(cr => cr.id === id ? { ...cr, ...c } : cr) })); },
    removeCurso: async (id) => { await apiDelete('cursos', id); set(state => ({ cursos: state.cursos.filter(cr => cr.id !== id) })); },

    // MÓDULOS
    addModulo: (m) => set((state) => {
      const existeOrdem = state.modulos.some(mod => mod.cursoId === m.cursoId && mod.ordem === m.ordem);
      if (existeOrdem) {
        get().addToast('Já existe um módulo com esta ordem neste curso!', 'error');
        return state;
      }
      return { modulos: [...state.modulos, { ...m, id: uuidv4() }] };
    }),
    updateModulo: (id, m) => set((state) => {
      const moduloAtual = state.modulos.find(mod => mod.id === id);
      if (m.ordem !== undefined && moduloAtual && m.ordem !== moduloAtual.ordem) {
        const existeOrdem = state.modulos.some(mod => mod.cursoId === (m.cursoId || moduloAtual.cursoId) && mod.ordem === m.ordem && mod.id !== id);
        if (existeOrdem) {
          get().addToast('Já existe um módulo com esta ordem neste curso!', 'error');
          return state;
        }
      }
      return { modulos: state.modulos.map(mod => mod.id === id ? { ...mod, ...m } : mod) };
    }),
    removeModulo: (id) => set((state) => {
      const moduloAtual = state.modulos.find(mod => mod.id === id);
      if (moduloAtual) {
        const temAulas = state.aulas.some(aula => aula.moduloId === id);
        if (temAulas) {
          get().addToast('Não é possível remover este módulo pois ele contém aulas.', 'error');
          return state;
        }
      }
      return { modulos: state.modulos.filter(mod => mod.id !== id) };
    }),

    // AULAS
    addAula: (a) => set((state) => {
      const existeOrdem = state.aulas.some(aula => aula.moduloId === a.moduloId && aula.ordem === a.ordem);
      if (existeOrdem) {
        get().addToast('Já existe uma aula com esta ordem neste módulo!', 'error');
        return state;
      }
      const novaAula = { ...a, id: uuidv4() };
      const newAulas = [...state.aulas, novaAula];

      // Recalcular métricas do curso
      const modulo = state.modulos.find(m => m.id === a.moduloId);
      if (modulo) {
        const modulosDoCurso = state.modulos.filter(m => m.cursoId === modulo.cursoId);
        const aulasDoCurso = newAulas.filter(al => modulosDoCurso.some(m => m.id === al.moduloId));
        const totalAulas = aulasDoCurso.length;
        const totalHoras = Math.ceil(aulasDoCurso.reduce((acc, aula) => acc + (aula.duracaoMinutos || 0), 0) / 60);

        const newCursos = state.cursos.map(c => c.id === modulo.cursoId ? { ...c, totalAulas, totalHoras } : c);
        return { aulas: newAulas, cursos: newCursos };
      }
      return { aulas: newAulas };
    }),
    updateAula: (id, a) => set((state) => {
      const aulaAtual = state.aulas.find(aula => aula.id === id);
      if (a.ordem !== undefined && aulaAtual && a.ordem !== aulaAtual.ordem) {
        const existeOrdem = state.aulas.some(aula => aula.moduloId === (a.moduloId || aulaAtual.moduloId) && aula.ordem === a.ordem && aula.id !== id);
        if (existeOrdem) {
          get().addToast('Já existe uma aula com esta ordem neste módulo!', 'error');
          return state;
        }
      }

      const newAulas = state.aulas.map(aula => aula.id === id ? { ...aula, ...a } : aula);

      // Recalcular
      if (aulaAtual) {
        const modulo = state.modulos.find(m => m.id === aulaAtual.moduloId);
        if (modulo) {
          const modulosDoCurso = state.modulos.filter(m => m.cursoId === modulo.cursoId);
          const aulasDoCurso = newAulas.filter(al => modulosDoCurso.some(m => m.id === al.moduloId));
          const totalAulas = aulasDoCurso.length;
          const totalHoras = Math.ceil(aulasDoCurso.reduce((acc, aula) => acc + (aula.duracaoMinutos || 0), 0) / 60);
          const newCursos = state.cursos.map(c => c.id === modulo.cursoId ? { ...c, totalAulas, totalHoras } : c);
          return { aulas: newAulas, cursos: newCursos };
        }
      }
      return { aulas: newAulas };
    }),
    removeAula: (id) => set((state) => {
      const aulaAtual = state.aulas.find(aula => aula.id === id);
      const newAulas = state.aulas.filter(aula => aula.id !== id);

      if (aulaAtual) {
        const modulo = state.modulos.find(m => m.id === aulaAtual.moduloId);
        if (modulo) {
          const modulosDoCurso = state.modulos.filter(m => m.cursoId === modulo.cursoId);
          const aulasDoCurso = newAulas.filter(al => modulosDoCurso.some(m => m.id === al.moduloId));
          const totalAulas = aulasDoCurso.length;
          const totalHoras = Math.ceil(aulasDoCurso.reduce((acc, aula) => acc + (aula.duracaoMinutos || 0), 0) / 60);
          const newCursos = state.cursos.map(c => c.id === modulo.cursoId ? { ...c, totalAulas, totalHoras } : c);
          return { aulas: newAulas, cursos: newCursos };
        }
      }
      return { aulas: newAulas };
    }),

    // TRILHAS
    addTrilha: async (t) => { const novo = { ...t, id: uuidv4() }; await apiPost('trilhas', novo); set(state => ({ trilhas: [...state.trilhas, novo] })); },
    updateTrilha: async (id, t) => { await apiPatch('trilhas', id, t); set(state => ({ trilhas: state.trilhas.map(tr => tr.id === id ? { ...tr, ...t } : tr) })); },
    removeTrilha: async (id) => { await apiDelete('trilhas', id); set(state => ({ trilhas: state.trilhas.filter(tr => tr.id !== id) })); },

    addTrilhaCurso: (tc) => set((state) => {
      const exists = state.trilhasCursos.some(t => t.trilhaId === tc.trilhaId && t.cursoId === tc.cursoId);
      if (exists) {
        get().addToast('Curso já está nesta trilha!', 'error');
        return state;
      }
      return { trilhasCursos: [...state.trilhasCursos, { ...tc, id: uuidv4() }] };
    }),
    updateTrilhaCurso: (id, tc) => set((state) => ({ trilhasCursos: state.trilhasCursos.map(t => t.id === id ? { ...t, ...tc } : t) })),
    removeTrilhaCurso: (id) => set((state) => ({ trilhasCursos: state.trilhasCursos.filter(t => t.id !== id) })),

    // SIMULAR ASSINATURA
    simularAssinatura: (usuarioId, planoId, metodoPagamento) => set((state) => {
      const plano = state.planos.find(p => p.id === planoId);
      if (!plano) return state;

      const hoje = new Date();
      const dataFim = addMonths(hoje, plano.duracaoMeses).toISOString();

      const novaAssinatura: Assinatura = {
        id: uuidv4(),
        usuarioId,
        planoId,
        dataInicio: hoje.toISOString(),
        dataFim
      };

      const novoPagamento: Pagamento = {
        id: uuidv4(),
        assinaturaId: novaAssinatura.id,
        valorPago: plano.preco,
        dataPagamento: hoje.toISOString(),
        metodo: metodoPagamento,
        idTransacao: uuidv4()
      };

      return {
        assinaturas: [...state.assinaturas, novaAssinatura],
        pagamentos: [...state.pagamentos, novoPagamento]
      };
    }),
    updateAssinatura: (id, a) => set((state) => ({ assinaturas: state.assinaturas.map(ass => ass.id === id ? { ...ass, ...a } : ass) })),
    removeAssinatura: (id) => set((state) => ({
      assinaturas: state.assinaturas.filter(ass => ass.id !== id),
      pagamentos: state.pagamentos.filter(pg => pg.assinaturaId !== id)
    })),

    // CATEGORIAS
    addCategoria: async (cat) => { const novo = { ...cat, id: uuidv4() }; await apiPost('categorias', novo); set(state => ({ categorias: [...state.categorias, novo] })); },
    updateCategoria: async (id, cat) => { await apiPatch('categorias', id, cat); set(state => ({ categorias: state.categorias.map(c => c.id === id ? { ...c, ...cat } : c) })); },
    removeCategoria: async (id) => { await apiDelete('categorias', id); set(state => ({ categorias: state.categorias.filter(c => c.id !== id) })); },

    // AVALIAÇÕES
    addAvaliacao: async (av) => { const novo = { ...av, id: uuidv4(), dataAvaliacao: new Date().toISOString() }; await apiPost('avaliacoes', novo); set(state => ({ avaliacoes: [...state.avaliacoes, novo] })); },

    // MATRICULAR
    matricular: (usuarioId, cursoId) => set((state) => {
      const existe = state.matriculas.some(m => m.usuarioId === usuarioId && m.cursoId === cursoId);
      if (existe) {
        get().addToast('Usuário já matriculado neste curso!', 'error');
        return state;
      }
      return {
        matriculas: [...state.matriculas, { id: uuidv4(), usuarioId, cursoId, dataMatricula: new Date().toISOString() }]
      };
    }),

    // EMITIR CERTIFICADO
    emitirCertificado: (usuarioId, cursoId, trilhaId) => set((state) => {
      const codigo = `EST-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;
      return {
        certificados: [...state.certificados, {
          id: uuidv4(),
          usuarioId,
          cursoId,
          trilhaId,
          codigoValidacao: codigo,
          dataEmissao: new Date().toISOString()
        }]
      }
    }),
    updateCertificado: (id, c) => set((state) => ({ certificados: state.certificados.map(cert => cert.id === id ? { ...cert, ...c } : cert) })),
    removeCertificado: (id) => set((state) => ({ certificados: state.certificados.filter(cert => cert.id !== id) })),

    // PROGRESSOS
    atualizarProgresso: (aulaId, status) => set((state) => {
      const { usuarioLogadoId, progressos, aulas, modulos, trilhasCursos, certificados } = state;
      if (!usuarioLogadoId) return state;

      const existenteIdx = progressos.findIndex(p => p.usuarioId === usuarioLogadoId && p.aulaId === aulaId);
      const newProgressos = [...progressos];

      if (existenteIdx >= 0) {
        newProgressos[existenteIdx] = {
          ...newProgressos[existenteIdx],
          status,
          dataConclusao: status === 'Concluido' ? new Date().toISOString() : undefined
        };
      } else {
        newProgressos.push({
          id: uuidv4(),
          usuarioId: usuarioLogadoId,
          aulaId,
          status,
          dataConclusao: status === 'Concluido' ? new Date().toISOString() : undefined
        });
      }

      // Se for concluído, checar se todas as aulas do curso foram concluídas
      if (status === 'Concluido') {
        const aula = aulas.find(a => a.id === aulaId);
        if (aula) {
          const modulo = modulos.find(m => m.id === aula.moduloId);
          if (modulo) {
            const cursoId = modulo.cursoId;

            // Todas as aulas do curso
            const modulosDoCurso = modulos.filter(m => m.cursoId === cursoId);
            const aulasDoCurso = aulas.filter(a => modulosDoCurso.some(m => m.id === a.moduloId));

            const todasConcluidas = aulasDoCurso.every(a => {
              const prog = newProgressos.find(p => p.usuarioId === usuarioLogadoId && p.aulaId === a.id);
              return prog && prog.status === 'Concluido';
            });

            if (todasConcluidas) {
              // Verifica se já tem certificado para esse curso
              const jaTem = certificados.some(c => c.usuarioId === usuarioLogadoId && c.cursoId === cursoId);
              if (!jaTem) {
                const codigo = `EST-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;
                // Atualiza dataConclusao da Matricula
                state.matriculas = state.matriculas.map(m => {
                  if (m.usuarioId === usuarioLogadoId && m.cursoId === cursoId) {
                    return { ...m, dataConclusao: new Date().toISOString() };
                  }
                  return m;
                });

                state.certificados.push({
                  id: uuidv4(),
                  usuarioId: usuarioLogadoId,
                  cursoId: cursoId,
                  codigoValidacao: codigo,
                  dataEmissao: new Date().toISOString()
                });
                get().addToast('Parabéns! Certificado do curso emitido com sucesso!', 'success');
              }

              // Checar Trilhas que contêm este curso
              const trilhasComEsseCurso = trilhasCursos.filter(tc => tc.cursoId === cursoId);
              for (const tc of trilhasComEsseCurso) {
                const trilhaId = tc.trilhaId;
                const cursosDaTrilha = trilhasCursos.filter(t => t.trilhaId === trilhaId);

                // Checar se todos os cursos dessa trilha foram concluidos
                let todosCursosDaTrilhaConcluidos = true;
                for (const ct of cursosDaTrilha) {
                  const cId = ct.cursoId;
                  const mCurso = modulos.filter(m => m.cursoId === cId);
                  const aCurso = aulas.filter(a => mCurso.some(m => m.id === a.moduloId));

                  const cConcluido = aCurso.every(a => {
                    const p = newProgressos.find(prog => prog.usuarioId === usuarioLogadoId && prog.aulaId === a.id);
                    return p && p.status === 'Concluido';
                  });
                  if (!cConcluido || aCurso.length === 0) {
                    todosCursosDaTrilhaConcluidos = false;
                    break;
                  }
                }

                if (todosCursosDaTrilhaConcluidos) {
                  const jaTemTrilha = certificados.some(c => c.usuarioId === usuarioLogadoId && c.trilhaId === trilhaId);
                  if (!jaTemTrilha) {
                    const codigo = `EST-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;
                    state.certificados.push({
                      id: uuidv4(),
                      usuarioId: usuarioLogadoId,
                      trilhaId: trilhaId,
                      codigoValidacao: codigo,
                      dataEmissao: new Date().toISOString()
                    });
                    get().addToast('Parabéns! Você concluiu a trilha e um certificado foi emitido!', 'success');
                  }
                }
              }
            }
          }
        }
      }

      return { progressos: newProgressos, certificados: [...state.certificados] };
    })
  })
);
