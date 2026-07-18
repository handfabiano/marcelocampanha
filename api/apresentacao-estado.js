// Estado da apresentação — armazenamento em memória (sem banco de dados)
// O apresentador manda qual slide está ativo (com o eyebrow/título já
// extraídos do próprio DOM da apresentação, não uma cópia reescrita à mão);
// o celular do participante (quiz.html) só lê esse estado pra acompanhar
// a apresentação inteira, não só o quiz.
//
// quizArea: true quando o slide atual já tem sua própria lógica em
// quiz.html (painel de quiz, resumo final, nuvem de palavras) — nesse
// caso o celular ignora eyebrow/titulo e usa o fluxo de quiz normal.

const store = (globalThis.__APRESENTACAO_ESTADO__ = globalThis.__APRESENTACAO_ESTADO__ || {});

function padrao() {
  return { slide: 0, total: 0, quizArea: false, eyebrow: '', titulo: '' };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { sala = 'treino', slide, total, quizArea, eyebrow, titulo } = req.body || {};
    const cur = store[sala] || padrao();
    if (Number.isInteger(slide)) cur.slide = Math.max(0, slide);
    if (Number.isInteger(total)) cur.total = Math.max(0, total);
    if (typeof quizArea === 'boolean') cur.quizArea = quizArea;
    if (typeof eyebrow === 'string') cur.eyebrow = eyebrow.slice(0, 120);
    if (typeof titulo === 'string') cur.titulo = titulo.slice(0, 200);
    store[sala] = cur;
    return res.status(200).json({ ok: true, estado: cur });
  }

  const sala = (req.query && req.query.sala) || 'treino';
  return res.status(200).json({ ok: true, sala, estado: store[sala] || padrao() });
}
