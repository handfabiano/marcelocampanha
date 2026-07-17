# Rede Marcelo Nunes 2026 — Apresentação + Quiz + Dinâmica dos 20

Material de treinamento da rede de líderes: uma apresentação interativa de 13 slides que, no final, chama a plateia para um **quiz de 5 perguntas** (respondido pelo celular via QR Code, com resultado ao vivo na tela) e depois para a **Dinâmica dos 20** — cada participante lista no celular as 20 pessoas mais próximas (sua **margem de segurança**), com progresso **ao vivo no telão**.

## Como funciona

| Página | URL | Uso |
|---|---|---|
| Apresentação | `/apresentacao.html` | Slides para conduzir a reunião/treinamento. Perto do fim: QR Code do quiz, QR Code da Dinâmica dos 20, e a tela final vira o placar de respostas ao vivo |
| Quiz | `/quiz.html` | Cada participante escaneia o QR do slide, digita o nome e responde 5 perguntas de múltipla escolha com feedback certo/errado na hora |
| Participante (Dinâmica) | `/` | Cada líder abre no celular, digita o nome e preenche os 20 nomes |
| Telão | `/telao.html` | Projetada na TV/projetor — mostra os cards de cada líder com barra de progresso, contadores gerais e celebração ao completar 20/20 |
| API do quiz | `/api/quiz` | Armazenamento em memória das respostas do quiz (sem banco de dados) |
| API da dinâmica | `/api/dinamica` | Armazenamento em memória das listas dos 20 (sem banco de dados) |

As 5 perguntas do quiz ficam no topo do `<script>` de `quiz.html` (array `QUESTIONS`) e são espelhadas em `apresentacao.html` (array `QUIZ_QUESTIONS`) para rotular os resultados — para trocar as perguntas, edite os dois arquivos juntos, na mesma ordem.

## Sem banco de dados

Os dados vivem **na memória da função serverless** apenas durante a sessão:

- Cada celular reenvia sua lista completa a cada alteração e a cada 10 segundos.
- O telão acumula no navegador tudo o que já recebeu.
- Se a função reiniciar (cold start), os celulares repovoam os dados sozinhos em segundos.
- Nada fica armazenado permanentemente — o **registro oficial** é o botão "Enviar pelo WhatsApp", que manda a lista formatada para a coordenação.

Ideal para dinâmicas de sala (5–8 pessoas, sessões de até ~1h). Para persistência real, migrar depois para o sistema da campanha.

## Salas (turmas simultâneas)

Use o parâmetro `?sala=` para separar turmas:

- Apresentação: `https://SEU-DOMINIO/apresentacao.html?sala=turma1`
- Quiz: `https://SEU-DOMINIO/quiz.html?sala=turma1`
- Participantes (Dinâmica): `https://SEU-DOMINIO/?sala=turma1`
- Telão: `https://SEU-DOMINIO/telao.html?sala=turma1`

Sem o parâmetro, todos entram na sala `treino`. Ao abrir a apresentação com `?sala=turma1`, os QR Codes do quiz e da dinâmica já saem apontando para essa mesma sala automaticamente.

> Os QR Codes só aparecem corretos depois do deploy (eles usam o endereço real da página, `location.origin`, para montar o link). Abrindo o arquivo `apresentacao.html` direto do computador (`file://`), o QR não tem para onde apontar.

## WhatsApp direto para a coordenação

Acrescente `&para=5595XXXXXXXX` na URL do participante para que o botão "Enviar pelo WhatsApp" abra direto na conversa da coordenação:

```
https://SEU-DOMINIO/?sala=turma1&para=5595XXXXXXXX
```

Sem o parâmetro, o WhatsApp abre o seletor de contatos.

## Deploy (Vercel)

```bash
git init
git add .
git commit -m "Dinâmica dos 20 — treinamento da rede"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/dinamica-dos-20.git
git push -u origin main
```

Depois, no Vercel: **Add New → Project → Import** do repositório. Nenhuma configuração extra: os HTML são servidos como estáticos e `api/dinamica.js` vira função serverless automaticamente.
