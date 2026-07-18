# Rede Marcelo Nunes 2026 — Apresentação + Quiz + Dinâmica dos 20

Material de treinamento da rede de líderes: uma apresentação interativa de 13 slides que, perto do fim, vira um **quiz ao vivo de 5 perguntas estilo Kahoot** — o apresentador controla o ritmo, todo mundo responde a mesma pergunta ao mesmo tempo pelo celular, e o telão revela o resultado antes de liberar a próxima — e depois chama a plateia para a **Dinâmica dos 20**, onde cada participante lista as 20 pessoas mais próximas (sua **margem de segurança**), com progresso **ao vivo no telão**.

## Como funciona

| Página | URL | Uso |
|---|---|---|
| Apresentação | `/` | Página inicial. Slides para conduzir a reunião. Um deles é o painel de controle do quiz ao vivo (QR Code de entrada + botões "Iniciar", "Revelar resposta", "Próxima pergunta"); perto do fim tem o QR da Dinâmica dos 20; a última tela é o resumo final do quiz |
| Quiz | `/quiz.html` | Cada participante escaneia o QR, digita o nome e espera o apresentador liberar cada pergunta — responde, aguarda a revelação e vê se acertou, uma pergunta de cada vez |
| Participante (Dinâmica) | `/dinamica.html` | Cada líder abre no celular, digita o nome e preenche os 20 nomes |
| Telão | `/telao.html` | Projetada na TV/projetor — mostra os cards de cada líder com barra de progresso, contadores gerais e celebração ao completar 20/20 |
| API do quiz (respostas) | `/api/quiz` | Armazenamento em memória das respostas de cada participante, com o horário de cada resposta (pro ranking de velocidade) |
| API do quiz (estado) | `/api/quiz-estado` | Guarda qual pergunta está liberada, se a resposta já foi revelada e quando cada pergunta foi liberada — sincroniza o celular de todo mundo com o comando do apresentador |
| API da nuvem de palavras | `/api/nuvem` | Armazenamento em memória da palavra bônus de cada participante |
| API da dinâmica | `/api/dinamica` | Armazenamento em memória das listas dos 20 (sem banco de dados) |

A apresentação (`index.html`) é a página inicial pra ter um único link pra mandar pra todo mundo: abre nos slides, termina no quiz e na Dinâmica dos 20.

### Controlando o quiz ao vivo

No slide "Quiz ao vivo" da apresentação:

1. **▶️ Iniciar quiz** — libera a pergunta 1 para todo mundo que já escaneou o QR.
2. Os celulares mostram a pergunta e um contador de "quantos já responderam" aparece no telão.
3. **🔍 Revelar resposta** — trava novas respostas daquela pergunta e mostra as barras com o resultado (a certa em verde); cada celular também mostra se a pessoa acertou.
4. **➡️ Próxima pergunta** — libera a pergunta seguinte. Na 5ª pergunta o botão vira **🏁 Ver resultado final**, que encerra o quiz (celulares mostram "quiz encerrado" com um botão para ir direto à Dinâmica dos 20).

O link "↺ reiniciar quiz" no rodapé do slide zera o estado — útil pra ensaiar antes do evento.

As 5 perguntas ficam no topo do `<script>` de `quiz.html` (array `QUESTIONS`) e são espelhadas em `index.html` (array `QUIZ_QUESTIONS`) para rotular os resultados — para trocar as perguntas, edite os dois arquivos juntos, na mesma ordem.

### Ranking, saudação e nuvem de palavras

- **Ranking por pergunta**: ao revelar uma resposta, aparecem os 3 primeiros que acertaram mais rápido (tempo contado a partir do momento em que a pergunta foi liberada, medido pelo servidor — não depende do relógio do celular).
- **Ranking geral**: no slide "Resumo final do quiz", um placar com todo mundo ordenado por acertos e, em caso de empate, por tempo total de resposta.
- **Saudação ao entrar**: assim que um nome novo aparece no quiz ou na Dinâmica dos 20, um aviso ("👋 Fulano entrou…") pisca por alguns segundos no telão/apresentação.
- **Nuvem de palavras**: bônus ao final do quiz — antes de seguir pra Dinâmica dos 20, cada participante manda uma palavra curta (até 24 caracteres) respondendo "por que você está nessa rede?". A última tela da apresentação mostra todas as palavras juntas, com as mais repetidas maiores.

## Sem banco de dados

Os dados vivem **na memória da função serverless** apenas durante a sessão:

- Cada celular reenvia sua lista completa a cada alteração e a cada 10 segundos.
- O telão acumula no navegador tudo o que já recebeu.
- Se a função reiniciar (cold start), os celulares repovoam os dados sozinhos em segundos.
- Nada fica armazenado permanentemente — o **registro oficial** é o botão "Enviar pelo WhatsApp", que manda a lista formatada para a coordenação.

Ideal para dinâmicas de sala (5–8 pessoas, sessões de até ~1h). Para persistência real, migrar depois para o sistema da campanha.

## Salas (turmas simultâneas)

Use o parâmetro `?sala=` para separar turmas:

- Apresentação: `https://SEU-DOMINIO/?sala=turma1`
- Quiz: `https://SEU-DOMINIO/quiz.html?sala=turma1`
- Participantes (Dinâmica): `https://SEU-DOMINIO/dinamica.html?sala=turma1`
- Telão: `https://SEU-DOMINIO/telao.html?sala=turma1`

Sem o parâmetro, todos entram na sala `treino`. Ao abrir a apresentação com `?sala=turma1`, os QR Codes do quiz e da dinâmica já saem apontando para essa mesma sala automaticamente.

> Os QR Codes só aparecem corretos depois do deploy (eles usam o endereço real da página, `location.origin`, para montar o link). Abrindo o arquivo `index.html` direto do computador (`file://`), o QR não tem para onde apontar.

## WhatsApp direto para a coordenação

Acrescente `&para=5595XXXXXXXX` na URL do participante para que o botão "Enviar pelo WhatsApp" abra direto na conversa da coordenação:

```
https://SEU-DOMINIO/dinamica.html?sala=turma1&para=5595XXXXXXXX
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
