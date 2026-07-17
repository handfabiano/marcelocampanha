# Rede Marcelo Nunes 2026 — Apresentação + Dinâmica dos 20

Material de treinamento da rede de líderes: uma apresentação interativa de 12 slides que termina com um convite direto para a **Dinâmica dos 20** — cada participante lista no celular as 20 pessoas mais próximas (sua **margem de segurança**), e o progresso de todos aparece **ao vivo no telão**.

## Como funciona

| Página | URL | Uso |
|---|---|---|
| Apresentação | `/apresentacao.html` | Slides para conduzir a reunião/treinamento; o último slide tem um botão que leva direto para a Dinâmica dos 20 |
| Participante | `/` | Cada líder abre no celular, digita o nome e preenche os 20 nomes |
| Telão | `/telao.html` | Projetada na TV/projetor — mostra os cards de cada líder com barra de progresso, contadores gerais e celebração ao completar 20/20 |
| API | `/api/dinamica` | Armazenamento em memória (sem banco de dados) |

## Sem banco de dados

Os dados vivem **na memória da função serverless** apenas durante a sessão:

- Cada celular reenvia sua lista completa a cada alteração e a cada 10 segundos.
- O telão acumula no navegador tudo o que já recebeu.
- Se a função reiniciar (cold start), os celulares repovoam os dados sozinhos em segundos.
- Nada fica armazenado permanentemente — o **registro oficial** é o botão "Enviar pelo WhatsApp", que manda a lista formatada para a coordenação.

Ideal para dinâmicas de sala (5–8 pessoas, sessões de até ~1h). Para persistência real, migrar depois para o sistema da campanha.

## Salas (turmas simultâneas)

Use o parâmetro `?sala=` para separar turmas:

- Participantes: `https://SEU-DOMINIO/?sala=turma1`
- Telão: `https://SEU-DOMINIO/telao.html?sala=turma1`

Sem o parâmetro, todos entram na sala `treino`.

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
