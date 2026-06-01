import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { addMonths } from 'date-fns';

export type Usuario = { id: string; nome: string; email: string; perfil: 'ADMIN' | 'ALUNO' };
export type Plano = { id: string; nome: string; descricao: string; preco: number; duracaoMeses: number };
export type Curso = { id: string; titulo: string; descricao: string; instrutor: string; categoria: string; nivel: string; dataPublicacao: string; totalAulas: number; totalHoras: number };
export type Modulo = { id: string; cursoId: string; titulo: string; ordem: number };
export type Aula = { id: string; moduloId: string; titulo: string; tipo: 'Video'; url: string; duracaoMinutos: number; ordem: number };
export type Trilha = { id: string; titulo: string; descricao: string; categoria: string };

export type TrilhaCurso = { id: string; trilhaId: string; cursoId: string; ordem: number };
export type Assinatura = { id: string; usuarioId: string; planoId: string; dataInicio: string; dataFim: string };
export type Pagamento = { id: string; assinaturaId: string; valorPago: number; dataPagamento: string; metodo: 'Cartao' | 'Pix' | 'Boleto'; idTransacao: string };
export type Matricula = { id: string; usuarioId: string; cursoId: string; dataMatricula: string };
export type ProgressoAula = { id: string; usuarioId: string; aulaId: string; dataConclusao?: string; status: 'Nao Iniciado' | 'Em Andamento' | 'Concluido' };
export type Certificado = { id: string; usuarioId: string; cursoId?: string; trilhaId?: string; codigoValidacao: string; dataEmissao: string };

type EstudosState = {
  usuarios: Usuario[];
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

  // Actions Usuarios
  addUsuario: (u: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, u: Partial<Usuario>) => void;
  removeUsuario: (id: string) => void;

  // Actions Planos
  addPlano: (p: Omit<Plano, 'id'>) => void;
  updatePlano: (id: string, p: Partial<Plano>) => void;
  removePlano: (id: string) => void;

  // Actions Cursos
  addCurso: (c: Omit<Curso, 'id' | 'totalAulas' | 'totalHoras'>) => void;
  updateCurso: (id: string, c: Partial<Curso>) => void;
  removeCurso: (id: string) => void;
  
  // Actions Modulos
  addModulo: (m: Omit<Modulo, 'id'>) => void;
  updateModulo: (id: string, m: Partial<Modulo>) => void;
  removeModulo: (id: string) => void;

  // Actions Aulas
  addAula: (a: Omit<Aula, 'id'>) => void;
  updateAula: (id: string, a: Partial<Aula>) => void;
  removeAula: (id: string) => void;

  // Actions Trilhas
  addTrilha: (t: Omit<Trilha, 'id'>) => void;
  updateTrilha: (id: string, t: Partial<Trilha>) => void;
  removeTrilha: (id: string) => void;
  
  // TrilhaCurso (Associativa)
  addTrilhaCurso: (tc: Omit<TrilhaCurso, 'id'>) => void;
  removeTrilhaCurso: (id: string) => void;

  // Assinaturas e Pagamentos
  simularAssinatura: (usuarioId: string, planoId: string, metodo: 'Cartao' | 'Pix' | 'Boleto') => void;

  // Matriculas
  matricular: (usuarioId: string, cursoId: string) => void;
  
  // Certificados
  emitirCertificado: (usuarioId: string, cursoId?: string, trilhaId?: string) => void;
};

const recalcularCurso = (cursoId: string, state: EstudosState) => {
  const modulosDoCurso = state.modulos.filter(m => m.cursoId === cursoId);
  const aulasDoCurso = state.aulas.filter(a => modulosDoCurso.some(m => m.id === a.moduloId));
  
  const totalAulas = aulasDoCurso.length;
  const totalHoras = Math.ceil(aulasDoCurso.reduce((acc, aula) => acc + aula.duracaoMinutos, 0) / 60);

  return { totalAulas, totalHoras };
};

export const useEstudosStore = create<EstudosState>()(
  persist(
    (set, get) => ({
      usuarios: [],
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

      // USUARIOS
      addUsuario: (u) => set((state) => ({ usuarios: [...state.usuarios, { ...u, id: uuidv4() }] })),
      updateUsuario: (id, u) => set((state) => ({ usuarios: state.usuarios.map(usr => usr.id === id ? { ...usr, ...u } : usr) })),
      removeUsuario: (id) => set((state) => ({ usuarios: state.usuarios.filter(usr => usr.id !== id) })),

      // PLANOS
      addPlano: (p) => set((state) => ({ planos: [...state.planos, { ...p, id: uuidv4() }] })),
      updatePlano: (id, p) => set((state) => ({ planos: state.planos.map(pl => pl.id === id ? { ...pl, ...p } : pl) })),
      removePlano: (id) => set((state) => ({ planos: state.planos.filter(pl => pl.id !== id) })),

      // CURSOS
      addCurso: (c) => set((state) => ({ cursos: [...state.cursos, { ...c, id: uuidv4(), totalAulas: 0, totalHoras: 0 }] })),
      updateCurso: (id, c) => set((state) => ({ cursos: state.cursos.map(cr => cr.id === id ? { ...cr, ...c } : cr) })),
      removeCurso: (id) => set((state) => ({ cursos: state.cursos.filter(cr => cr.id !== id) })),

      // MÓDULOS
      addModulo: (m) => set((state) => {
        const existeOrdem = state.modulos.some(mod => mod.cursoId === m.cursoId && mod.ordem === m.ordem);
        if (existeOrdem) {
          alert('Já existe um módulo com esta ordem neste curso!');
          return state;
        }
        return { modulos: [...state.modulos, { ...m, id: uuidv4() }] };
      }),
      updateModulo: (id, m) => set((state) => {
        const moduloAtual = state.modulos.find(mod => mod.id === id);
        if (m.ordem !== undefined && moduloAtual && m.ordem !== moduloAtual.ordem) {
           const existeOrdem = state.modulos.some(mod => mod.cursoId === (m.cursoId || moduloAtual.cursoId) && mod.ordem === m.ordem && mod.id !== id);
           if (existeOrdem) {
             alert('Já existe um módulo com esta ordem neste curso!');
             return state;
           }
        }
        return { modulos: state.modulos.map(mod => mod.id === id ? { ...mod, ...m } : mod) };
      }),
      removeModulo: (id) => set((state) => ({ modulos: state.modulos.filter(mod => mod.id !== id) })),

      // AULAS
      addAula: (a) => set((state) => {
        const existeOrdem = state.aulas.some(aula => aula.moduloId === a.moduloId && aula.ordem === a.ordem);
        if (existeOrdem) {
          alert('Já existe uma aula com esta ordem neste módulo!');
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
             alert('Já existe uma aula com esta ordem neste módulo!');
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
      addTrilha: (t) => set((state) => ({ trilhas: [...state.trilhas, { ...t, id: uuidv4() }] })),
      updateTrilha: (id, t) => set((state) => ({ trilhas: state.trilhas.map(tr => tr.id === id ? { ...tr, ...t } : tr) })),
      removeTrilha: (id) => set((state) => ({ trilhas: state.trilhas.filter(tr => tr.id !== id) })),
      
      addTrilhaCurso: (tc) => set((state) => {
         const exists = state.trilhasCursos.some(t => t.trilhaId === tc.trilhaId && t.cursoId === tc.cursoId);
         if (exists) {
            alert('Curso já está nesta trilha!');
            return state;
         }
         return { trilhasCursos: [...state.trilhasCursos, { ...tc, id: uuidv4() }] };
      }),
      removeTrilhaCurso: (id) => set((state) => ({ trilhasCursos: state.trilhasCursos.filter(t => t.id !== id) })),

      // SIMULAR ASSINATURA
      simularAssinatura: (usuarioId, planoId, metodo) => set((state) => {
         const plano = state.planos.find(p => p.id === planoId);
         if (!plano) return state;

         const hoje = new Date();
         const dataFim = addMonths(hoje, plano.duracaoMeses).toISOString();
         const assinaturaId = uuidv4();
         
         const novaAssinatura: Assinatura = {
            id: assinaturaId,
            usuarioId,
            planoId,
            dataInicio: hoje.toISOString(),
            dataFim
         };

         const novoPagamento: Pagamento = {
             id: uuidv4(),
             assinaturaId,
             valorPago: plano.preco,
             dataPagamento: hoje.toISOString(),
             metodo,
             idTransacao: `TXN-${hoje.getFullYear()}${(hoje.getMonth()+1).toString().padStart(2, '0')}${hoje.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
         };

         return {
             assinaturas: [...state.assinaturas, novaAssinatura],
             pagamentos: [...state.pagamentos, novoPagamento]
         };
      }),

      // MATRICULAR
      matricular: (usuarioId, cursoId) => set((state) => {
         const existe = state.matriculas.some(m => m.usuarioId === usuarioId && m.cursoId === cursoId);
         if (existe) {
             alert('Usuário já matriculado neste curso!');
             return state;
         }
         return {
             matriculas: [...state.matriculas, { id: uuidv4(), usuarioId, cursoId, dataMatricula: new Date().toISOString() }]
         };
      }),

      // EMITIR CERTIFICADO
      emitirCertificado: (usuarioId, cursoId, trilhaId) => set((state) => {
         const codigo = `EST-${new Date().getFullYear()}-${uuidv4().substring(0,8).toUpperCase()}`;
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
      })
    }),
    {
      name: 'estudaae-storage',
    }
  )
);
