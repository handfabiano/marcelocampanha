// Estado do Quiz ao vivo (estilo Kahoot) — armazenamento em memória
// Controla qual pergunta está liberada (atual) e se a resposta já foi
// revelada (revelado). O apresentador manda o estado avançar; os
// celulares dos participantes só leem esse estado para saber o que mostrar.
//
// atual: -1 = quiz não iniciado | 0..4 = índice da pergunta ativa | 5 = quiz encerrado
// desdePorPergunta: instante (server-side) em que CADA pergunta foi liberada
// pela primeira vez — junto com "tempos" de api/quiz.js, dá o tempo de
// resposta de cada pergunta, usado no ranking de quem respondeu mais rápido.

const store = (globalThis.__QUIZ20_ESTADO__ = globalThis.__QUIZ20_ESTADO__ || {});

function padrao() {
  return { atual: -1, revelado: false, atualDesde: null, desdePorPergunta: [null, null, null, null, null] };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { sala = 'treino', atual, revelado, reiniciar } = req.body || {};
    const cur = store[sala] || padrao();
    if (reiniciar) {
      store[sala] = padrao();
      return res.status(200).json({ ok: true, estado: store[sala] });
    }
    if (Number.isInteger(atual)) {
      const novo = Math.max(-1, Math.min(5, atual));
      if (novo !== cur.atual) {
        cur.atualDesde = Date.now();
        if (!cur.desdePorPergunta) cur.desdePorPergunta = [null, null, null, null, null];
        if (novo >= 0 && novo < 5 && cur.desdePorPergunta[novo] == null) {
          cur.desdePorPergunta[novo] = cur.atualDesde;
        }
      }
      cur.atual = novo;
    }
    if (typeof revelado === 'boolean') cur.revelado = revelado;
    store[sala] = cur;
    return res.status(200).json({ ok: true, estado: cur });
  }

  const sala = (req.query && req.query.sala) || 'treino';
  return res.status(200).json({ ok: true, sala, estado: store[sala] || padrao() });
}
