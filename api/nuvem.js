// API da Nuvem de Palavras — armazenamento em memória (sem banco de dados)
// Pergunta aberta e bônus ao final do quiz: cada participante manda uma
// palavra/frase curta, e a apresentação renderiza uma nuvem ao vivo com
// as mais repetidas em destaque.

const store = (globalThis.__NUVEM20__ = globalThis.__NUVEM20__ || {});

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { sala = 'treino', lider = '', palavra = '', reiniciar } = req.body || {};
    if (reiniciar) {
      store[sala] = {};
      return res.status(200).json({ ok: true });
    }
    const key = String(lider).trim();
    if (!key) return res.status(400).json({ ok: false, erro: 'lider obrigatório' });
    const texto = String(palavra).trim().slice(0, 24);
    if (!texto) return res.status(400).json({ ok: false, erro: 'palavra obrigatória' });
    if (!store[sala]) store[sala] = {};
    store[sala][key] = { palavra: texto, at: Date.now() };
    return res.status(200).json({ ok: true });
  }

  // GET — apresentação consulta a sala
  const sala = (req.query && req.query.sala) || 'treino';
  return res.status(200).json({ ok: true, sala, listas: store[sala] || {} });
}
