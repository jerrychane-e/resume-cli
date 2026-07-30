// 模块级内存缓存 — 跨路由导航保持状态
// File 对象无法序列化到 localStorage，但模块级变量在 SPA 生命周期内持久存在

let cachedFile: File | null = null;
let cachedMode: 'extract' | 'score' = 'extract';
let cachedName: string | null = null;

export const fileCache = {
  getFile: (): File | null => cachedFile,
  setFile: (f: File | null) => { cachedFile = f; },
  getFileName: (): string | null => cachedFile?.name ?? null,
  getMode: (): 'extract' | 'score' => cachedMode,
  setMode: (m: 'extract' | 'score') => { cachedMode = m; },
  getName: (): string | null => cachedName,
  setName: (n: string | null) => { cachedName = n; },
};
