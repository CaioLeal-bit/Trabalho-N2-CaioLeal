import fs from 'fs';
let code = fs.readFileSync('src/store/useEstudosStore.ts', 'utf-8');

const collections = [
  { name: 'Usuario', col: 'usuarios' },
  { name: 'Plano', col: 'planos' },
  { name: 'Curso', col: 'cursos' },
  { name: 'Trilha', col: 'trilhas' },
  { name: 'Categoria', col: 'categorias' }
];

collections.forEach(c => {
  // Update
  code = code.replace(
    new RegExp(`update${c.name}: \\(id, ([a-zA-Z0-9_]+)\\) => set\\(\\(state\\) => \\(\\{ ${c.col}: state\\.${c.col}\\.map\\(([^\\s]+) => \\2\\.id === id \\? \\{ \\.\\.\\.([^,]+), \\.\\.\\.\\1 \\} : ([^\\s]+)\\) \\}\\)\\)`),
    `update${c.name}: async (id, $1) => { await apiPatch('${c.col}', id, $1); set(state => ({ ${c.col}: state.${c.col}.map($2 => $2.id === id ? { ...$3, ...$1 } : $4) })); }`
  );

  // Remove
  code = code.replace(
    new RegExp(`remove${c.name}: \\(id\\) => set\\(\\(state\\) => \\(\\{ ${c.col}: state\\.${c.col}\\.filter\\(([^\\s]+) => \\1\\.id !== id\\) \\}\\)\\)`),
    `remove${c.name}: async (id) => { await apiDelete('${c.col}', id); set(state => ({ ${c.col}: state.${c.col}.filter($1 => $1.id !== id) })); }`
  );
});

// Fix apiDelete implicit any by just casting or making sure it's used.
code = code.replace('const apiDelete = async (ep: string, id: string) =>', 'export const apiDelete = async (ep: string, id: string) =>');
code = code.replace('const apiPatch = async (ep: string, id: string, data: any) =>', 'export const apiPatch = async (ep: string, id: string, data: any) =>');
code = code.replace('const apiPut = async (ep: string, id: string, data: any) =>', 'export const apiPut = async (ep: string, id: string, data: any) =>');
code = code.replace('const apiPost = async (ep: string, data: any) =>', 'export const apiPost = async (ep: string, data: any) =>');

fs.writeFileSync('src/store/useEstudosStore.ts', code);
