# 📝 NutriRotina — Prompts das Adições

Cada prompt abaixo é pronto pra copiar, colar e construir a próxima feature. Leia o `ADIÇÕES.md` antes.

---

## Prompt — Fase 1️⃣: Linha do Tempo Visual

Leia o arquivo `ADIÇÕES.md`. Estou adicionando features ao app NutriRotina que já existe.

**Agora vamos construir SÓ a Fase 1: Linha do Tempo Visual da Home.**

O que é: A Home vai virar uma timeline visual do dia (de cima pra baixo). Em vez de uma lista simples de "agenda", cada atividade é um bloco colorido com:
- Horário de início e fim (ex: "6h00 — 6h10")
- Título (ex: "acordar", "criar conteúdo")
- Cor da categoria (cinza, verde, azul, rosa, etc.)
- Blocos **arrastáveis** pra reorganizar horários
- Espaços vazios aparecem como blocos brancos → toca pra adicionar

**O que guardar:**
Uma lista de atividades com: id, titulo, horaInicio, horaFim, categoria, data.

**Paleta e fontes (do app existente):**
- Cores: rosa `#e88ba3`, cinza `#6b6b6b`, branco, cinza claro `#e0e0e0`
- Fontes: Plus Jakarta Sans + Inter
- Mobile-first

**Detalhes técnicos:**
- Salva no localStorage (chave: `nutrirotina_atividades`)
- Atualiza ao arrastar (sem recarregar página)
- Bloqueia sobreposição de horários (avisa "esse horário tá ocupado")
- Mostra horas em formato 24h (ex: 14h30)

**NÃO faça:**
- Não mexa no header, nav ou resto da Home (agenda, tarefas, roteiro vão virar cards menores abaixo da timeline)
- Não adicione banco de dados — só localStorage
- Não adicione novos ícones ou cores além da paleta existente

**Estrutura que você vai modificar:**
- `index.html`: adiciona a estrutura da timeline (vocês vão manter o template e só renderizar diferente)
- `app.js`: cria os métodos: `loadAtividades()`, `saveAtividades()`, `renderTimeline()`, `handleDragDrop()`

Vai me explicando o que está fazendo e me avisa quando eu puder testar.

**Está pronto quando:**
- [ ] Abro a Home e vejo o dia como timeline visual de cima pra baixo
- [ ] Cada bloco mostra horário de início/fim e título
- [ ] Consigo arrastar um bloco e ele muda de horário (salva no localStorage)
- [ ] Posso clicar em um espaço vazio (branco) e adicionar uma atividade nova
- [ ] As cores dos blocos ficam legíveis e dentro da paleta

---

## Prompt — Fase 2️⃣: 6 Contadores de Hábitos

Leia o `ADIÇÕES.md`. Fase 1 tá pronta (linha do tempo visual).

**Agora vamos construir a Fase 2: 6 Contadores de Hábitos com Streak.**

O que é: Acima da timeline, adicionar uma seção com 6 botões principais:
- 💖 Postei stories → rastreia se postou hoje
- 💧 Bebi água → rastreia copos de água
- 🌿 Treinei → rastreia treino
- 💫 Anotei ideia → rastreia ideia de conteúdo
- ✨ Cumpri tarefas → rastreia tarefas concluídas
- 📋 Planejei amanhã → rastreia planejamento noturno

**Cada contador:**
- Toque simples muda a cor (quando concluído fica com cor mais saturada)
- Mostra o número de dias seguidos (streak) embaixo
- Se quebra a sequência (não faz 1 dia), o streak volta pra 0
- Salva no localStorage por data (chave: `nutrirotina_habitos`)

**Dados que guardar:**
```
habitos: [
  { id, nome, icone, dataCompleta (YYYY-MM-DD), streak, dataUltimaCompleta }
]
```

**Design:**
- 6 botões em grid 3x2 (mobile) ou inline (desktop)
- Ícone grande + nome + streak embaixo
- Cor de fundo muda quando concluído (ex: rosa mais saturada)
- Animação suave ao tocar

**NÃO faça:**
- Não adicione banco de dados — só localStorage
- Não crie telas separadas pra hábitos
- Não mexa na timeline (Fase 1)

Vai explicando e me avisa quando testar.

**Está pronto quando:**
- [ ] Vejo os 6 contadores acima da timeline na Home
- [ ] Consigo tocar um e ele muda de cor
- [ ] O streak aparece embaixo e conta os dias corretamente
- [ ] Se não faço 1 dia, o streak reseta pra 0
- [ ] Fecha e reabre o app — os dados persistem

---

## Prompt — Fase 3️⃣: Três Estados no Feedback

Leia o `ADIÇÕES.md`. Fases 1 e 2 prontas.

**Agora vamos construir a Fase 3: Três Estados no Feedback Noturno.**

O que é: O feedback de stories que já existe vai passar de 2 estados pra 3:
- 🟢 **Verde:** postei stories hoje
- 🔴 **Vermelho:** esqueci / não deu tempo
- 🟡 **Amarelo:** decidi não postar hoje e tudo bem (escolha consciente)

A diferença entre amarelo e vermelho é importante: o app aprende que nem sempre é "falha" — às vezes é priorizar outra coisa.

**Onde fica:** Na página de Feedback (que já existe). Em vez de 2 botões, agora são 3.

**Dados que guardar:**
Adiciona campo `feedbackState` nos dados de planejamento:
- 'posted' (verde)
- 'missed' (vermelho)
- 'conscious_skip' (amarelo)

**Design:**
- 3 botões grandes lado a lado
- Ícone + cor + texto
- Seleciona 1 por vez
- Salva no localStorage junto com o planejamento

**NÃO faça:**
- Não mexa na timeline ou hábitos
- Não mude o feedback de outras coisas (outras que já têm formato binário ficam igual)

**Está pronto quando:**
- [ ] Abro o Feedback e vejo 3 botões (verde, amarelo, vermelho)
- [ ] Consigo clicar em cada um e eles ficam selecionados
- [ ] Fecha e reabre — o estado que escolhi tá lá
- [ ] O histórico de feedback mostra os 3 estados corretamente

---

## Prompt — Fase 4️⃣: Humor do Dia

Leia o `ADIÇÕES.md`. Fases 1, 2, 3 prontas.

**Agora vamos construir a Fase 4: Humor do Dia no Feedback.**

O que é: Junto com os 3 estados de feedback, adicionar a pergunta "como tu te sentes hoje?" com 5 níveis de humor.

**Escala:** 1 (😞 péssimo) → 5 (🤩 ótimo)

O app usa isso pra:
- Reconhecer padrões (você posta menos quando tá cansada)
- Sugerir conteúdo mais leve se você tá desgastada
- Futuramente, dar insights ("você tá mais consistente quando humor > 3")

**Onde fica:** No Feedback, abaixo dos 3 estados de stories.

**Dados que guardar:**
Adiciona campo `humor` (1-5) no registro de planejamento/feedback.

**Design:**
- 5 emojis clicáveis: 😞 😐 🙂 😊 🤩
- Números 1-5 embaixo
- Toque seleciona (cor muda)
- Mais legível no mobile

**NÃO faça:**
- Não mexa nas fases anteriores
- Não crie recomendações baseadas em humor ainda (isso é Versão 2)

**Está pronto quando:**
- [ ] Vejo a pergunta "como tu te sentes?" no Feedback
- [ ] Posso clicar em cada nível (1-5) e a cor muda
- [ ] Fecha e reabre — o humor que escolhi tá lá
- [ ] Os dados salvam junto com o feedback

---

## Prompt — Fase 5️⃣: Revisar Pendentes Antes de Planejar

Leia o `ADIÇÕES.md`. Fases 1-4 prontas.

**Agora vamos construir a Fase 5: Revisar Pendentes Antes de Planejar.**

O que é: Na página de Planejamento Noturno, **antes de mostrar o formulário**, exibir uma seção de revisão:
- Tarefas não feitas hoje (status ≠ 'done')
- Stories não postados (no feedback, nenhum estado selecionado)
- Ideias não usadas (ideias criadas mas não referenciadas no roteiro)

Você decide: **arrastar pra amanhã** (muda a data) ou **descartar** (remove / marca como irrelevante).

**Dados que guardar:**
Nada novo — usa dados que já existem. Só muda a lógica de exibição.

**Design:**
- Seção "Revisão do Dia" acima do formulário de planejamento
- 3 cards: "Tarefas", "Stories", "Ideias"
- Cada um com uma lista de pendentes
- Botões: "Arrastar pra amanhã" ou "Descartar"
- Após resolver tudo, o formulário de planejamento aparece

**NÃO faça:**
- Não mexa no formulário de planejamento existente
- Não crie lógica nova de dados — só reorganiza o que já tá lá

**Está pronto quando:**
- [ ] Abro o Planejamento e vejo a seção de Revisão no topo
- [ ] As tarefas, stories e ideias pendentes aparecem corretamente
- [ ] Consigo arrastar um pendente pra amanhã (data muda)
- [ ] Consigo descartar um pendente (some da lista)
- [ ] Após resolver pendentes, aparece o formulário de planejamento

---

## Prompt — Fase 6️⃣: My Day Limpo

Leia o `ADIÇÕES.md`. Fases 1-5 prontas.

**Agora vamos construir a Fase 6: My Day Limpo.**

O que é: Na Home, **mostrar SÓ as tarefas de hoje**. Tarefas antigas que você não fez **não aparecem automaticamente** — o app mostra um card perguntando: "ainda precisa fazer isso?"

Você escolhe:
- ✅ "Sim, ainda preciso" → aparece na Home
- ❌ "Não, descarta" → sai do campo visual (pode ter opção de recuperar depois)

Objetivo: zero lixo visual, zero acúmulo de tarefas antigas.

**Dados que guardar:**
Adiciona campo `isVisibleInMyDay` (boolean) em cada tarefa.
- true = aparece na Home
- false = escondido (mas recuperável)

**Onde aparece:**
- Um card suspensório acima da timeline com tarefas não resolvidas ("você ainda quer fazer X?")
- Ao resolver, some do card
- A tarefa fica escondida até você escolher

**Design:**
- Card suave, sem peso visual
- Pergunta clara: "ainda precisa fazer isso?"
- Botões: ✅ Sim | ❌ Não
- Ao resolver tudo, o card some

**NÃO faça:**
- Não mexa na timeline ou hábitos
- Não delete tarefas — só as esconda

**Está pronto quando:**
- [ ] Abro a Home e vejo só tarefas de hoje
- [ ] Se tem tarefa atrasada, aparece um card perguntando
- [ ] Consigo marcar "sim" e ela aparece na Home
- [ ] Consigo marcar "não" e ela some (ainda tá no banco, só escondida)
- [ ] Fecha e reabre — o estado persiste

---

## Prompt — Fase 7️⃣: Visão Semanal de Consistência

Leia o `ADIÇÕES.md`. Fases 1-6 prontas.

**Agora vamos construir a Fase 7: Visão Semanal de Consistência.**

O que é: Uma nova aba "Semana" que mostra um mini-calendário com pontos coloridos por dia.

**Cores:**
- 🟣 Rosa: postei stories
- 🟢 Verde: treinei
- 🔵 Azul: cumpri tarefas
- ⚪ Cinza: não fiz nada

**UX:**
- Cada dia é uma célula pequena com 1 ponto (ou múltiplos se fez várias coisas)
- Toca em um dia pra ver detalhes
- Desliza esquerda/direita pra semanas anteriores
- Semana atual vem pré-selecionada

**Dados que guardar:**
Agrupa dados que já existem (atividades, hábitos, feedback) por semana.

**Onde fica:**
- Nova aba na navegação: "📊 Semana" (ou similar)
- Ou um card na Home com a semana atual

**Design:**
- Mini-calendário em grid 7 colunas (sun-sat)
- Cada dia é um quadradinho com ícones coloridos
- Suave, não poluído visualmente

**NÃO faça:**
- Não mexa nas fases anteriores
- Não crie cálculos novos — usa dados que já existem

**Está pronto quando:**
- [ ] Vejo a aba "Semana" na navegação
- [ ] Vejo um mini-calendário com 7 dias
- [ ] Cada dia tem pontos coloridos conforme o que fiz
- [ ] Consigo deslizar pra semanas anteriores
- [ ] Os pontos batem com os dados do app

---

## Prompt — Fase 8️⃣: Heatmap Anual de Postagem

Leia o `ADIÇÕES.md`. Fases 1-7 prontas.

**Agora vamos construir a Fase 8: Heatmap Anual de Postagem.**

O que é: Um calendário anual (tipo GitHub contribution graph) que mostra cada dia em rosa (postei) ou branco (não postei).

**Visual:**
- 12 colunas = 12 meses
- 7 linhas = 7 dias da semana
- Cada quadradinho = 1 dia
- Rosa escuro/saturado = postei
- Branco = não postei
- Cinza bem claro = sem dados (futuro)

**UX:**
- Toca em um mês pra ampliar e ver dias específicos
- Desliza pra ver anos anteriores (se houver dados — começa com o ano atual)
- Hover mostra "X posts nesse dia" (em desktop)

**Dados que guardar:**
Agrupa dados de feedback (feedbackState === 'posted') por data anual.

**Onde fica:**
- Nova aba "📆 Ano" ou um card na Home

**Design:**
- Bem compacto, visual limpo
- Paleta: branco, rosa claro `#e88ba3`, rosa escuro `#d44f79`
- Não poluído

**NÃO faça:**
- Não mexa nas fases anteriores
- Não crie API de dados — usa localStorage

**Está pronto quando:**
- [ ] Vejo um calendário anual tipo GitHub
- [ ] Cada dia pintado de rosa = postei stories
- [ ] Cada dia branco = não postei
- [ ] Consigo tocar em um mês pra ampliar
- [ ] Consigo ver anos anteriores (deslizando)

---

## Prompt — Fase 9️⃣: Cores por Categoria

Leia o `ADIÇÕES.md`. Fases 1-8 prontas.

**Agora vamos construir a Fase 9: Cores por Categoria.**

O que é: Cada tipo de atividade (na timeline) tem uma cor suave e consistente.

**Tabela de cores:**

| Categoria | Cor | Atividades |
|-----------|-----|------------|
| Pessoal | Cinza `#9b9b9b` | acordar, banho, maquiagem |
| Exercício | Verde suave `#a8d5a8` | treino, yoga, corrida |
| Atendimento presencial | Azul `#a8c5d5` | consultório, presencial |
| Atendimento online | Azul claro `#b8d5e8` | chamada, zoom, online |
| Conteúdo | Rosa `#e88ba3` | stories, criação, redes |
| Compromissos sociais | Amarelo suave `#f0d9a8` | encontros, eventos |
| Organização | Branco com borda rosa | tarefas, planejamento |

**Dados que guardar:**
Adiciona campo `categoria` em cada atividade. O campo já existe na estrutura — só precisa mapear a cor.

**Modificações:**
- `renderTimeline()` pega a categoria → aplica a cor CSS
- Ao criar atividade, pedir pra selecionar a categoria (ou auto-detectar por tipo)

**Design:**
- Cores suaves, não chapadas
- Bom contraste com texto
- Consistente em toda a timeline

**NÃO faça:**
- Não mexa em nenhuma feature anterior
- Não adicione novas categorias (fica com as 7 listadas)

**Está pronto quando:**
- [ ] Cada tipo de atividade na timeline tem sua cor
- [ ] As cores são suaves e legíveis
- [ ] Consigo adicionar uma atividade e ela pega a cor certa
- [ ] As cores batem com a tabela listada

---

## Prompt — Fase 🔟: Deslizar pra Concluir

Leia o `ADIÇÕES.md`. Fases 1-9 prontas.

**Agora vamos construir a Fase 10: Deslizar pra Concluir (Swipe Actions).**

O que é: No mobile, deslizar um hábito ou tarefa:
- **Pra direita:** marca como concluído (checkmark)
- **Pra esquerda:** adia / postpone (abre menu com opções: "amanhã", "próxima semana", "remover")

Rápido, sem precisar abrir o item, sem clique duplo.

**Onde funciona:**
- Blocos na timeline (arrastar ainda funciona, deslizar pra concluir é diferente)
- Contadores de hábitos (swipe direita = concluído)
- Cards de tarefas (swipe direita/esquerda)

**UX:**
- Desliza suave (usar `touch` events ou biblioteca tipo Hammer.js)
- Feedback visual: ícone aparece (✓ ou ⏭)
- Animação de saída (elemento sai de cena, depois reappears ou atualiza)
- Só funciona em dispositivos touch (mobile)

**Dados que guardar:**
Nada novo — atualiza o campo `status` ou `completedAt` da atividade/hábito.

**Design:**
- Ícones bem visíveis (✓ verde, ⏭ cinza)
- Fundo de cor quando desliza (ex: verde claro quando completa)
- Animação suave, não abrupta

**NÃO faça:**
- Não mexa em nenhuma feature anterior
- Não implemente swipe em desktop (só mobile)

**Está pronto quando:**
- [ ] Abro a Home no celular
- [ ] Consigo deslizar um hábito pra direita e ele marca como feito
- [ ] Consigo deslizar uma tarefa pra esquerda e aparece um menu de adiar
- [ ] A animação é suave e responsiva
- [ ] Fecha e reabre — o estado mudou

---

## ✅ Próximos Passos

1. **Fase 1 (Linha do Tempo):** é a maior e mais importante. Dedique tempo aqui.
2. **Fases 2-4:** as adições secundárias mas de alto impacto (hábitos, feedback, humor).
3. **Fases 5-10:** refinamentos e vistas alternativas.
4. **Ao final:** testar tudo integrado, sem quebras.

Bora começar pela Fase 1! 🚀
