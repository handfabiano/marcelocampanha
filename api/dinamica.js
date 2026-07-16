// API da Dinâmica dos 20 — armazenamento em memória (sem banco de dados)
// Os dados vivem na memória da função enquanto a sessão está ativa.
// Os celulares reenviam a lista completa a cada alteração e a cada 10s,
// então mesmo após um cold start o telão se reconstrói sozinho.

const store = (globalThis.__DINAMICA20__ = globalThis.__DINAMICA20__ || {});

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { sala = 'treino', lider = '', nomes = [] } = req.body || {};
    const key = String(lider).trim();
    if (!key) return res.status(400).json({ ok: false, erro: 'lider obrigatório' });
    if (!store[sala]) store[sala] = {};
    store[sala][key] = {
      nomes: (Array.isArray(nomes) ? nomes : []).map(n => String(n).trim()).filter(Boolean).slice(0, 20),
      at: Date.now(),
    };
    return res.status(200).json({ ok: true });
  }

  // GET — telão consulta a sala
  const sala = (req.query && req.query.sala) || 'treino';
  return res.status(200).json({ ok: true, sala, listas: store[sala] || {} });
}
