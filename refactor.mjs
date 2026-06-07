import fs from 'fs';

let code = fs.readFileSync('src/store/useEstudosStore.ts', 'utf-8');

// Update Types to async
code = code.replace(/=> void/g, '=> Promise<void> | void');
code = code.replace('type EstudosState = {', "const API_URL = 'http://localhost:3001';\n\ntype EstudosState = {\n  fetchInitialData: () => Promise<void>;");

// Remove persist
code = code.replace("import { persist } from 'zustand/middleware';", "");
code = code.replace(/persist\s*\(\s*\(\s*set,\s*get\s*\)\s*=>\s*\(\{/, '(set, get) => ({');
code = code.replace(/\}\),\s*\{\s*name:\s*'estudaae-storage',?\s*\}\s*\)/, '})');

// Add fetchInitialData
const fetchImpl = `
      fetchInitialData: async () => {
        try {
          const endpoints = ['usuarios', 'categorias', 'planos', 'cursos', 'modulos', 'aulas', 'trilhas', 'trilhasCursos', 'assinaturas', 'pagamentos', 'matriculas', 'progressos', 'certificados', 'avaliacoes'];
          const results = await Promise.all(endpoints.map(ep => fetch(\`\${API_URL}/\${ep}\`).then(res => res.json())));
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
`;

code = code.replace('toasts: [],', 'toasts: [],' + fetchImpl);

const apiHelpers = `
const apiPost = async (ep, data) => fetch(\`\${API_URL}/\${ep}\`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).catch(console.error);
const apiPut = async (ep, id, data) => fetch(\`\${API_URL}/\${ep}/\${id}\`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).catch(console.error);
const apiPatch = async (ep, id, data) => fetch(\`\${API_URL}/\${ep}/\${id}\`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).catch(console.error);
const apiDelete = async (ep, id) => fetch(\`\${API_URL}/\${ep}/\${id}\`, { method: 'DELETE' }).catch(console.error);
`;

code = code.replace("export const useEstudosStore = create<EstudosState>()(", apiHelpers + "\nexport const useEstudosStore = create<EstudosState>()(");

// Simple actions rewrites:
const rewritePost = (actionName, collection, objName, extraFields) => {
  const regex = new RegExp(`${actionName}: \\(${objName}\\) => set\\(\\(state\\) => \\(\\{ ${collection}: \\[\\.\\.\\.state\\.${collection}, \\{ \\.\\.\\.${objName}, (.*?)\\}] \\}\\)\\)`);
  code = code.replace(regex, `${actionName}: async (${objName}) => { const novo = { ...${objName}, $1 }; await apiPost('${collection}', novo); set(state => ({ ${collection}: [...state.${collection}, novo] })); }`);
}

const rewriteDelete = (actionName, collection) => {
  const regex = new RegExp(`${actionName}: \\(id\\) => set\\(\\(state\\) => \\(\\{ ${collection}: state\\.${collection}\\.filter\\([^=]+!== id\\) \\}\\)\\)`);
  code = code.replace(regex, `${actionName}: async (id) => { await apiDelete('${collection}', id); set(state => ({ ${collection}: state.${collection}.filter(x => x.id !== id) })); }`);
}

const rewritePatch = (actionName, collection, objName) => {
  const regex = new RegExp(`${actionName}: \\(id, ${objName}\\) => set\\(\\(state\\) => \\(\\{ ${collection}: state\\.${collection}\\.map\\([^=]+=== id \\? \\{ \\.\\.\\.[^,]+, \\.\\.\\.${objName} \\} : [^)]+\\) \\}\\)\\)`);
  code = code.replace(regex, `${actionName}: async (id, ${objName}) => { await apiPatch('${collection}', id, ${objName}); set(state => ({ ${collection}: state.${collection}.map(x => x.id === id ? { ...x, ...${objName} } : x) })); }`);
}

rewritePost('addUsuario', 'usuarios', 'u');
rewritePatch('updateUsuario', 'usuarios', 'u');
rewriteDelete('removeUsuario', 'usuarios');

rewritePost('addPlano', 'planos', 'p');
rewritePatch('updatePlano', 'planos', 'p');
rewriteDelete('removePlano', 'planos');

rewritePost('addCurso', 'cursos', 'c');
rewritePatch('updateCurso', 'cursos', 'c');
rewriteDelete('removeCurso', 'cursos');

rewritePost('addTrilha', 'trilhas', 't');
rewritePatch('updateTrilha', 'trilhas', 't');
rewriteDelete('removeTrilha', 'trilhas');

rewritePost('addCategoria', 'categorias', 'cat');
rewritePatch('updateCategoria', 'categorias', 'cat');
rewriteDelete('removeCategoria', 'categorias');

rewritePost('addAvaliacao', 'avaliacoes', 'av');

// For manual complex actions like addModulo, updateModulo, removeModulo, addAula, simularAssinatura, matricular, etc.
// I will just use text replacements for the complex ones.

fs.writeFileSync('src/store/useEstudosStore.ts', code);
