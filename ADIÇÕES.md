# 📱 NutriRotina — Plano de Adições de Features

> O app já funciona. Agora a gente adiciona 10 features inspiradas em Structured, Habitica, Milha, Way of Life e Any.do — sem quebrar o que tá funcionando.

## 📋 O que já existe (NÃO mexe)
- Home com agenda, banco de tarefas, roteiro de stories
- Planejamento noturno (registra como vai ser amanhã)
- Roteiro de stories com 3 categorias fixas (Humanização, Engajamento, Vendas)
- Banco de ideias de conteúdo
- Feedback noturno
- **Paleta:** rosa `#e88ba3`, cinza `#6b6b6b`, branco, cinza claro `#e0e0e0`
- **Fontes:** Plus Jakarta Sans + Inter
- **Plataforma:** mobile-first, localStorage, sem login

---

## 🎯 As 10 Adições (em ordem de prioridade)

### Fase 1️⃣ — Linha do Tempo Visual (CORE)
**O que:** A Home vira uma timeline visual do dia, de cima pra baixo.  
**Cada bloco:**
- Horário de início e fim (ex: 6h00 — 6h10)
- Título da atividade
- Cor por categoria (cinza, verde, azul, azul claro, rosa, amarelo, branco com borda rosa)
- Arrastável pra reorganizar horários
- Espaços vazios aparecem como blocos em branco → toca pra adicionar atividade

**Dados que guarda:**
- `atividades`: id, titulo, horaInicio, horaFim, categoria, data

**Critério de pronto:**
- [ ] Consigo ver o dia como timeline de cima pra baixo
- [ ] Cada bloco mostra horário e título
- [ ] Consigo arrastar um bloco pra outro horário (salva no localStorage)
- [ ] Posso clicar em um espaço vazio e adicionar uma atividade

---

### Fase 2️⃣ — 6 Contadores de Hábitos (ALTO IMPACTO)
**O que:** Acima da timeline, 6 botões com ícones + streak.

| Hábito | Ícone | O que rastreia |
|--------|-------|---|
| Postei stories | 💖 | Stories postados hoje |
| Bebi água | 💧 | Copos de água |
| Treinei | 🌿 | Treino feito |
| Anotei ideia | 💫 | Ideia de conteúdo capturada |
| Cumpri tarefas | ✨ | Tarefas concluídas |
| Planejei amanhã | 📋 | Planejamento noturno feito |

**Cada contador:**
- Toque simples pra marcar como feito (muda cor/animação)
- Mostra o streak embaixo (dias seguidos)
- Se quebra o streak, volta pra 0
- Salva no localStorage por data

**Dados que guarda:**
- `habitos`: id, nome, icone, dataCompleta, streak, dataUltimaCompleta

**Critério de pronto:**
- [ ] Vejo os 6 contadores acima da timeline
- [ ] Consigo tocar um e ele muda de cor
- [ ] O streak aparece embaixo e conta corretamente
- [ ] Se não faço 1 dia, o streak reseta

---

### Fase 3️⃣ — Três Estados no Feedback (INTELIGÊNCIA)
**O que:** O feedback de stories passa de 2 estados pra 3.

**Estados:**
- 🟢 **Verde:** postei stories hoje
- 🔴 **Vermelho:** esqueci / não deu tempo
- 🟡 **Amarelo:** decidi não postar hoje e tudo bem (escolha consciente)

**Por quê:** diferencia "falhei" de "priorizar outra coisa" — o app aprende que nem sempre é falha.

**Dados que guarda:**
- Adiciona campo `feedbackState` em `plannings`: 'posted' | 'missed' | 'conscious_skip'

**Critério de pronto:**
- [ ] No feedback noturno, vejo 3 botões (verde, amarelo, vermelho)
- [ ] Consigo clicar em cada um e ele salva
- [ ] O histórico de feedback mostra os 3 estados corretamente

---

### Fase 4️⃣ — Humor do Dia no Feedback
**O que:** Junto com os 3 estados, pergunta "como tu te sentes hoje?" com 5 níveis.

**Escala:** 1 (😞 péssimo) → 5 (🤩 ótimo)

**O app usa isso pra:**
- Sugerir conteúdo mais leve se você tá cansada
- Reconhecer padrões (ex: "você posta menos quando tem sono")

**Dados que guarda:**
- Adiciona campo `humor` em `plannings`: 1-5

**Critério de pronto:**
- [ ] Vejo a pergunta "como tu te sentes?" no feedback
- [ ] Posso clicar em 1-5 e salva
- [ ] O histórico mostra o humor do dia

---

### Fase 5️⃣ — Revisar Pendentes Antes de Planejar
**O que:** No planejamento noturno, **antes de perguntar "como vai ser amanhã?"**, o app mostra:
- Tarefas não feitas hoje
- Stories não postados
- Ideias não usadas

Você decide: arrastar pra amanhã ou descartar.

**Dados que guarda:**
- Nada novo — usa dados que já existem, só reorganiza a UX.

**Critério de pronto:**
- [ ] Abro planejamento noturno e vejo a seção de pendentes
- [ ] Consigo arrastar um pendente pra amanhã (muda a data)
- [ ] Consigo descartar um pendente (remove)
- [ ] Depois de resolver pendentes, aparece o formulário de planejamento

---

### Fase 6️⃣ — My Day Limpo
**O que:** Quando abre o app de manhã, a Home mostra **SÓ** o que é de hoje.  
Tarefas antigas não feitas **não aparecem automaticamente** — o app pergunta antes: "ainda precisa fazer isso?" em um card suspensório.

**Dados que guarda:**
- Adiciona campo em `tasks`: `isVisibleInMyDay` (boolean)

**Critério de pronto:**
- [ ] Abro a Home de manhã e vejo só tarefas de hoje
- [ ] Se tiver tarefa atrasada não feita, aparece um card perguntando
- [ ] Consigo marcar "sim, ainda preciso" (aparece na Home) ou "não, descarta" (some)

---

### Fase 7️⃣ — Visão Semanal de Consistência
**O que:** Nova aba "Semana" que mostra um mini-calendário com pontos coloridos por dia.

**Cores:**
- 🟣 Rosa: postei stories
- 🟢 Verde: treinei
- 🔵 Azul: cumpri tarefas
- ⚪ Cinza: não fiz nada

**UX:**
- Toca pra ver a semana em detalhe
- Desliza esquerda/direita pra ver semanas anteriores
- Cada ponto é "ao menos 1 vez" (ex: se postou 5x, conta como 1 ponto rosa)

**Dados que guarda:**
- Agrupa dados que já existem por semana.

**Critério de pronto:**
- [ ] Vejo uma aba "Semana" com mini-calendário
- [ ] Cada dia tem pontos coloridos conforme o que fiz
- [ ] Consigo deslizar pra semanas anteriores
- [ ] Os pontos batem com o que tá no app

---

### Fase 8️⃣ — Heatmap Anual de Postagem
**O que:** Novo card na Home ou aba "Ano" — calendário tipo GitHub contribution graph.

**Cada dia:**
- 🟣 Rosa: postei stories
- ⚪ Branco: não postei

**UX:**
- Mostra 12 meses de um dia
- Toca em um mês pra ampliar e ver dias específicos
- Desliza pra ver anos anteriores (se houver dados)

**Dados que guarda:**
- Agrupa dados que já existem.

**Critério de pronto:**
- [ ] Vejo um calendário tipo GitHub com meses
- [ ] Consigo ver cores rosa (postei) e branco (não postei)
- [ ] Consigo tocar em um mês pra ampliar
- [ ] As cores batem com os dados do app

---

### Fase 9️⃣ — Cores por Categoria
**O que:** Cada tipo de atividade tem uma cor suave (dentro da paleta existente).

| Categoria | Cor | Uso |
|-----------|-----|-----|
| Pessoal | Cinza `#9b9b9b` | acordar, banho, maquiagem |
| Exercício | Verde `#a8d5a8` | treino, yoga, corrida |
| Atendimento presencial | Azul `#a8c5d5` | consultório, presencial |
| Atendimento online | Azul claro `#b8d5e8` | chamada, online |
| Conteúdo | Rosa `#e88ba3` | stories, criação, redes |
| Compromissos sociais | Amarelo `#f0d9a8` | encontros, eventos |
| Organização | Branco com borda rosa | tarefas, planejamento |

**Dados que guarda:**
- Adiciona campo `categoria` em `atividades` → automático pega a cor.

**Critério de pronto:**
- [ ] Cada tipo de atividade tem sua cor
- [ ] Consigo adicionar uma atividade e ela pega a cor certa
- [ ] As cores são suaves (não chapadas)

---

### Fase 🔟 — Deslizar pra Concluir (UX)
**O que:** No mobile, deslizar um hábito/tarefa:
- **Pra direita:** marca como concluído
- **Pra esquerda:** adia / postpone

**UX:**
- Animação suave
- Sem precisar abrir o item
- Rápido, intuitivo

**Dados que guarda:**
- Nada novo — usa dados que já existem.

**Critério de pronto:**
- [ ] Consigo deslizar um hábito pra direita e ele marca como feito
- [ ] Consigo deslizar pra esquerda e aparece um menu de adiar
- [ ] A animação é suave e responsiva

---

## ✅ Checklist de Conclusão

Ao final, o NutriRotina terá:
- [ ] Timeline visual do dia (blocos arrastáveis)
- [ ] 6 contadores de hábitos com streak
- [ ] 3 estados no feedback + humor
- [ ] Revisão de pendentes antes de planejar
- [ ] My Day limpo (sem lixo visual)
- [ ] Visão semanal de consistência
- [ ] Heatmap anual de postagem
- [ ] Cores por categoria (suaves, na paleta)
- [ ] Deslizar pra concluir (mobile)
- [ ] **Tudo rodando no localStorage, sem quebrar o que já existe**

---

## 🚀 Próximos Passos
1. Ler o arquivo `ADIÇÕES-PROMPTS.md` com os prompts prontos de cada fase
2. Começar pela **Fase 1 — Linha do Tempo Visual**
3. Testar cada fase antes de passar pra próxima
4. Ao final: celebrar e considerar Versão 2 (PWA, notificações, integrações)
