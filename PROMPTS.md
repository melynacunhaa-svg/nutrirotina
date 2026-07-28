# 📋 PROMPTS.md — NutriRotina

Cada seção abaixo é um prompt pronto. Se você fechar o app e voltar outro dia, é só colar o prompt da fase onde parou.

---

## Prompt — Fase 0: Setup + Preview duplo + Identidade visual

Leia o arquivo PLANO.md. Estou criando o app **NutriRotina**: um app que organiza rotina pessoal, consultório e conteúdo de redes sociais em um só lugar.

Nesta fase você vai:
1. Criar a estrutura HTML/CSS/JS do projeto
2. Aplicar a identidade visual: paleta (Rosa quente `#e88ba3` + Verde menta `#7ec8c8` + Cinza claro `#f0f0f0` + Preto `#2a2a2a`), tipografia (Poppins + Inter)
3. Criar uma página de **preview duplo** (`preview.html`) que mostra o app **duas vezes lado a lado**:
   - À esquerda: **moldura de celular** (390px de largura, com aparência de telefone)
   - À direita: **largura de computador** (desktop)
   - **Ambas apontam pra mesma URL do app rodando** (dois `<iframe>` do localhost)
   - **O app dentro dos iframes é o app de verdade, clicável e funcionando** (não são imagens estáticas)

O critério de pronto é:
- [ ] Projeto rodando no navegador (http://localhost:algo)
- [ ] Paleta + fonte aplicadas (rosa, verde, cinza, preto, Poppins + Inter)
- [ ] Página `preview.html` aberta mostra o app em **dois tamanhos ao mesmo tempo**: celular à esquerda, desktop à direita
- [ ] Clico em ambos e o app funciona (não é mockup, é o app real)
- [ ] Fechar e abrir de novo: as mudanças aparecem nos dois iframes automaticamente (não precisa recarregar manualmente)

**Não faça ainda:** home, hábitos, metas, nenhuma funcionalidade. Só estrutura e styling.

---

## Prompt — Fase 1: Home (Painel) 

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí a Fase 0 (setup + preview duplo).

Agora vou construir **SÓ a Fase 1: Home (Painel)**.

Nesta fase:
- **Topo:** Saudação ("Boa [período], [nome]"), indicador de pontos/streak (estrutura pronta, sem funcionalidade real ainda)
- **Calendário semanal:** Barra de dias (seg a dom), indicador visual de qual é hoje, setinhas pra navegar semana anterior/próxima
- **Lista "Hoje":** Seção mostrando:
  - Hábitos do dia (checkbox, nome do hábito)
  - Tarefas pendentes (título, horário se tem)
  - Consultório: consultas agendadas (paciente, horário)
  - Ideias marcadas pra hoje
- **Botão flutuante:** "+ Adicionar ação" que abre modal/tela pra criar hábito, tarefa, consulta ou ideia (não precisa fazer salvar real ainda, só estrutura)
- **Bottom bar:** Navegação com ícones (Home, Hábitos, Metas, Consultório, Tarefas, Roteiros, Ideias) — **só Home ativa agora**, os outros aparecem como botões desabilitados/cinzas

Identidade visual: Rosa quente `#e88ba3`, Verde menta `#7ec8c8`, Cinza claro `#f0f0f0`, Preto `#2a2a2a`, Poppins + Inter. Mobile-first.

Não faça ainda: Salvar dados de verdade, conectar hábitos/tarefas reais. Fase 1 é só a tela aparecer bonita e responsiva.

Vá me explicando o que está fazendo em linguagem simples.

Está pronto quando:
- [ ] Abro o preview duplo e vejo a home nos dois tamanhos (celular e desktop)
- [ ] Calendário mostra os dias, consigo navegar pra semana anterior/próxima
- [ ] "Hoje" aparece com alguns dados fake (1-2 hábitos, 1-2 tarefas, exemplo de consulta)
- [ ] Bottom bar aparece com 7 abas (só Home ativa)
- [ ] Clico em "+ Adicionar ação" e abre um modal/tela

---

## Prompt — Fase 2: Hábitos com heatmap

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0 e 1 (setup + home).

Agora vou construir **SÓ a Fase 2: Hábitos com heatmap**.

Nesta fase:
- **Página de Hábitos:** Clico na aba "Hábitos" e vejo lista de hábitos
- **Cada hábito mostra:**
  - Nome do hábito
  - Cor própria (diferente pra cada um)
  - Checkbox de hoje (marca como concluído ou não)
  - **Heatmap visual:** grid de dias (últimos 30 dias) mostrando quais dias você fez/não fez o hábito (quadrinhos coloridos tipo GitHub)
  - **Streak:** "X dias seguidos" visível
- **Adicionar hábito:** Botão pra criar novo hábito (nome, descrição, frequência, cor)
- **Dados salvam em localStorage:** Fechar e abrir de novo, tudo continua lá

Identidade visual: Mesma paleta e font da Fase 1. Cards arredondados, clean.

Não faça ainda: Editar/deletar hábitos (entra na Fase 2+). Hábitos com frequência custom (só diário por enquanto).

Vá me explicando o que está fazendo.

Está pronto quando:
- [ ] Aba "Hábitos" funciona (clico e vejo a lista)
- [ ] Vejo pelo menos 3 hábitos com cores diferentes
- [ ] Cada hábito tem um checkbox pra marcar/desmarcar hoje
- [ ] Cada hábito mostra um heatmap dos últimos 30 dias
- [ ] Botão "+ Adicionar" cria novo hábito
- [ ] Fecho o app, abro de novo: dados persistem (localStorage)

---

## Prompt — Fase 3: Metas com progresso

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0, 1 e 2 (setup + home + hábitos).

Agora vou construir **SÓ a Fase 3: Metas com progresso**.

Nesta fase:
- **Página de Metas:** Clico na aba "Metas" e vejo lista de metas
- **Cada meta mostra:**
  - Nome (ex: "30 dias sem açúcar")
  - Descrição
  - Data de início e fim
  - **Barra de progresso visual** (0-100%)
  - Dias restantes
- **Atualizar progresso:** Clico em uma meta e consigo atualizar o % manualmente (slider ou input)
- **Histórico:** Cada meta tem um mini-gráfico mostrando evolução ao longo do tempo
- **Adicionar meta:** Botão pra criar nova meta (nome, descrição, data início, data fim)
- **Dados salvam em localStorage**

Identidade visual: Mesma. Barra de progresso com Verde menta, muito visual.

Não faça ainda: Cálculo automático de progresso (só manual por enquanto). Integrações com hábitos.

Vá me explicando.

Está pronto quando:
- [ ] Aba "Metas" funciona
- [ ] Vejo pelo menos 2-3 metas com barras de progresso
- [ ] Consigo atualizar o progresso de uma meta
- [ ] Vejo o histórico visual (mini-gráfico)
- [ ] Posso criar nova meta
- [ ] Fecho e abro: dados persistem

---

## Prompt — Fase 4: Consultório/Agenda

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0-3.

Agora vou construir **SÓ a Fase 4: Consultório/Agenda**.

Nesta fase:
- **Página de Consultório:** Aba "Consultório" mostra lista de consultas agendadas
- **Cada consulta mostra:**
  - Nome do paciente
  - Data e horário
  - Status (agendado/feito/cancelado)
  - Observações (espaço pra anotar algo sobre o paciente)
- **Adicionar consulta:** Botão pra marcar nova consulta (paciente, data, horário, observações)
- **Editar status:** Clico e mudo pra "feito" ou "cancelado"
- **Filtros:** Mostrar "próximas consultas" ou "todas"
- **Dados salvam em localStorage**

Identidade visual: Mesma. Destaque visual pra "próximas" (Rosa).

Não faça ainda: Integração com Google Calendar. SMS/WhatsApp automático.

Vá me explicando.

Está pronto quando:
- [ ] Aba "Consultório" funciona
- [ ] Vejo lista de consultas com paciente, data, horário
- [ ] Consigo adicionar nova consulta
- [ ] Consigo editar status (agendado/feito/cancelado)
- [ ] Posso adicionar observações
- [ ] Fecho e abro: dados persistem

---

## Prompt — Fase 5: Tarefas

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0-4.

Agora vou construir **SÓ a Fase 5: Tarefas**.

Nesta fase:
- **Página de Tarefas:** Aba "Tarefas" mostra lista de tarefas
- **Cada tarefa mostra:**
  - Título
  - Descrição
  - Data (se tem)
  - Horário (se tem)
  - Categoria (pessoal/trabalho/conteúdo) — cores diferentes pra cada
  - Status (pendente/concluído) — checkbox pra marcar
  - Prioridade (baixa/média/alta)
- **Adicionar tarefa:** Botão pra criar nova tarefa
- **Filtros:** Mostrar por categoria, por prioridade, mostrar só pendentes
- **Dados salvam em localStorage**

Identidade visual: Mesma. Cores de categoria (rosa pra pessoal, verde pra trabalho, outro tom pra conteúdo).

Não faça ainda: Lembretes/notificações. Tarefas recorrentes.

Vá me explicando.

Está pronto quando:
- [ ] Aba "Tarefas" funciona
- [ ] Vejo lista de tarefas com título, categoria, prioridade
- [ ] Consigo adicionar nova tarefa
- [ ] Consigo marcar como concluído (checkbox)
- [ ] Posso filtrar por categoria/prioridade
- [ ] Fecho e abro: dados persistem

---

## Prompt — Fase 6: Roteiros de Stories

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0-5.

Agora vou construir **SÓ a Fase 6: Roteiros de Stories**.

Nesta fase:
- **Página de Roteiros:** Aba "Roteiros" mostra lista de roteiros disponíveis
- **Filtros:** Mostrar por categoria (Humanização/Engajamento/Vendas) ou plataforma (Instagram/TikTok/YouTube)
- **Cada roteiro mostra:**
  - Título (ex: "A nutri que ninguém vê")
  - Categoria
  - Plataforma
  - **Preview:** Primeiras linhas do roteiro
  - Status (rascunho/pronto/gravado/postado)
- **Abrir roteiro:** Clico e vejo o texto completo (abertura, transições, encerramento)
- **Marcar status:** Consigo mudar de rascunho → pronto → gravado → postado
- **Copiar:** Botão pra copiar texto do roteiro (pra colar no telefone e ler na hora de gravar)
- **Adicionar roteiro:** Botão pra criar novo (título, categoria, plataforma, texto)
- **Dados salvam em localStorage**

Identidade visual: Mesma. Cores por categoria (Rosa = Humanização, Verde = Engajamento, outro tom = Vendas).

Não faça ainda: Agendamento automático de posts. Integração com plataformas.

Vá me explicando.

Está pronto quando:
- [ ] Aba "Roteiros" funciona
- [ ] Vejo lista de roteiros com filtros por categoria/plataforma
- [ ] Consigo abrir um roteiro e ver texto completo
- [ ] Botão "Copiar" funciona (copia pra clipboard)
- [ ] Consigo marcar status (rascunho/pronto/gravado/postado)
- [ ] Posso criar novo roteiro
- [ ] Fecho e abro: dados persistem

---

## Prompt — Fase 7: Banco de Ideias

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0-6.

Agora vou construir **SÓ a Fase 7: Banco de Ideias**.

Nesta fase:
- **Página de Ideias:** Aba "Ideias" mostra banco de ideias
- **Cada ideia mostra:**
  - Título
  - Descrição
  - Categoria (conteúdo/pessoal/trabalho) — cores diferentes
  - Data criada
  - Status (ideia/rascunho/desenvolvimento)
- **Adicionar ideia:** Botão pra criar nova ideia rapidinho
- **Converter em ação:** Clico em uma ideia e consigo convertê-la em tarefa ou roteiro
- **Filtros:** Mostrar por categoria, por status
- **Dados salvam em localStorage**

Identidade visual: Mesma. Cards simples, leves (pra parecer que são "rascunhos").

Não faça ainda: Organização por pastas. Tags custom.

Vá me explicando.

Está pronto quando:
- [ ] Aba "Ideias" funciona
- [ ] Consigo adicionar nova ideia rapidinho
- [ ] Vejo lista com categoria (conteúdo/pessoal/trabalho) diferenciada por cor
- [ ] Posso converter uma ideia em tarefa/roteiro
- [ ] Filtros funcionam (por categoria, por status)
- [ ] Fecho e abro: dados persistem

---

## Prompt — Fase 8: Gamificação

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0-7.

Agora vou construir **SÓ a Fase 8: Gamificação**.

Nesta fase:
- **Pontos:** Concluir um hábito ou tarefa dá pontos (defina um valor simples, ex: 10 pontos)
- **Nível:** A cada X pontos acumulados, sobe de nível (ex: a cada 100 pontos)
- **Indicador na Home:** O topo da Home (onde já existe o espaço reservado pra "pontos/streak") passa a mostrar pontos totais e nível atual de verdade
- **Histórico:** Guarda quando cada ponto foi ganho (data, origem — qual hábito/tarefa)
- **Dados salvam em localStorage**

Identidade visual: Mesma paleta e fonte das fases anteriores.

Não faça ainda: Avatar customizável, badges/conquistas, ranking ou comparação com outras pessoas.

Vá me explicando o que está fazendo.

Está pronto quando:
- [ ] Concluo um hábito ou tarefa e vejo os pontos subirem na Home
- [ ] O nível muda quando acumulo pontos suficientes
- [ ] Fecho o app, abro de novo: pontos e nível continuam lá (localStorage)

---

## Prompt — Fase 9: Humor/Check-in

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0-8.

Agora vou construir **SÓ a Fase 9: Humor/Check-in**.

Nesta fase:
- **Página/aba Humor:** Nova aba "Humor" na navegação
- **Check-in do dia:** Lista de emojis (ex: 😄 😊 😐 😔 😣) pra marcar como está se sentindo hoje, com espaço opcional pra uma nota curta
- **Histórico:** Vejo os check-ins dos últimos dias
- **Retrospectiva semanal:** Um resumo visual simples da semana (quantos dias de cada humor, ou um mini-gráfico)
- **Dados salvam em localStorage**

Identidade visual: Mesma paleta e fonte.

Não faça ainda: Retrospectiva mensal ou anual. Correlação com hábitos/metas.

Vá me explicando.

Está pronto quando:
- [ ] Aba "Humor" funciona
- [ ] Consigo marcar meu humor de hoje com um clique
- [ ] Vejo o histórico dos últimos dias
- [ ] Vejo a retrospectiva da semana
- [ ] Fecho e abro: dados persistem

---

## Prompt — Fase 10: Diário

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí as Fases 0-9.

Agora vou construir **SÓ a Fase 10: Diário**.

Nesta fase:
- **Página/aba Diário:** Nova aba "Diário" na navegação
- **Nova entrada:** Escrevo livremente, a entrada salva com a data de hoje
- **Lista de entradas:** Vejo as entradas anteriores organizadas por data (mais recente primeiro)
- **Buscar:** Campo de busca simples pra encontrar entradas por palavra
- **Dados salvam em localStorage**

Identidade visual: Mesma paleta e fonte. Visual limpo, sem distração (é um espaço de escrita).

Não faça ainda: Formatação rica de texto (negrito, listas). Anexar fotos.

Vá me explicando.

Está pronto quando:
- [ ] Aba "Diário" funciona
- [ ] Consigo escrever e salvar uma entrada de hoje
- [ ] Vejo entradas antigas listadas por data
- [ ] A busca encontra entradas por palavra
- [ ] Fecho e abro: dados persistem

---

## Prompt — Aula 3: Back-end + Publicar

*Esta fase entra na Aula 3 do workshop.*

Leia o arquivo PLANO.md. Estou construindo o app **NutriRotina**. Já concluí todas as fases 0-10 (app completo rodando localmente com localStorage).

Agora vou:
1. **Conectar Supabase:** Migrar dados do localStorage pra um banco de dados de verdade
2. **Adicionar login:** Cada pessoa tem sua própria conta, seus dados privados
3. **Deploy na Vercel:** App rodando na internet
4. **PWA no celular:** Instalar o app como if it was native

Use a skill **backend-do-seu-app** pra guiar os passos de Supabase e login. Depois faça o deploy.

---

## 📌 Guia rápido

- **Fase 0:** Setup + identidade visual + preview duplo (você SÓ usa o preview pra testar daqui pra frente)
- **Fase 1:** Home (painel do dia)
- **Fase 2:** Hábitos + heatmap
- **Fase 3:** Metas + progresso
- **Fase 4:** Consultório + agenda
- **Fase 5:** Tarefas
- **Fase 6:** Roteiros de stories
- **Fase 7:** Banco de ideias
- **Fase 8:** Gamificação
- **Fase 9:** Humor/check-in
- **Fase 10:** Diário
- **Aula 3:** Back-end (Supabase + login) + deploy

Se você fechar e voltar, é só colar o prompt da fase onde parou. Simples!
