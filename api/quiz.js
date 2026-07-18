// API do Quiz Rápido — armazenamento em memória (sem banco de dados)
// Mesmo padrão de api/dinamica.js: os dados vivem na memória da função
// enquanto a sessão está ativa; os celulares reenviam as respostas a
// cada alteração e a cada 10s, então o telão se reconstrói sozinho.
//
// "tempos" guarda, por pergunta, o instante (server-side) em que a
// resposta chegou pela primeira vez — é o que permite montar o ranking
// de quem respondeu mais rápido, sem confiar no relógio do celular.

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
    const anterior = store[sala][key] || {};
    const respostasAnteriores = anterior.respostas || [];
    const temposAnteriores = anterior.tempos || [];
    const novasRespostas = (Array.isArray(respostas) ? respostas : [])
      .slice(0, 5)
      .map(r => (Number.isInteger(r) ? r : null));
    const agora = Date.now();
    const novosTempos = novasRespostas.map((v, i) =>
      v !== null && respostasAnteriores[i] == null ? agora : temposAnteriores[i] || null
    );
    store[sala][key] = { respostas: novasRespostas, tempos: novosTempos, at: agora };
    return res.status(200).json({ ok: true });
  }

  // GET — telão/apresentação consulta a sala
  const sala = (req.query && req.query.sala) || 'treino';
  return res.status(200).json({ ok: true, sala, listas: store[sala] || {} });
}
