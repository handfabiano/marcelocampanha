// API do Quiz Rápido — armazenamento em memória (sem banco de dados)
// Mesmo padrão de api/dinamica.js: os dados vivem na memória da função
// enquanto a sessão está ativa; os celulares reenviam as respostas a
// cada alteração e a cada 10s, então o telão se reconstrói sozinho.

const store = (globalThis.__QUIZ20__ = globalThis.__QUIZ20__ || {});

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { sala = 'treino', lider = '', respostas = [] } = req.body || {};
    const key = String(lider).trim();
    if (!key) return res.status(400).json({ ok: false, erro: 'lider obrigatório' });
    if (!store[sala]) store[sala] = {};
    store[sala][key] = {
      respostas: (Array.isArray(respostas) ? respostas : [])
        .slice(0, 5)
        .map(r => (Number.isInteger(r) ? r : null)),
      at: Date.now(),
    };
    return res.status(200).json({ ok: true });
  }

  // GET — telão/apresentação consulta a sala
  const sala = (req.query && req.query.sala) || 'treino';
  return res.status(200).json({ ok: true, sala, listas: store[sala] || {} });
}
