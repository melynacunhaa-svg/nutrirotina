# 📱 NutriRotina — Plano do MVP

> Um app que organiza sua rotina pessoal, consultório e conteúdo de redes sociais em um só lugar — com roteiros de stories prontos pra postar todo dia.

---

## 1. Decisões

| Tema | Decisão |
|---|---|
| **Pra quem** | Pra você (nutricionista), inicialmente. Depois pode expandir pra outras nutricionistas. |
| **Precisa de login?** | Não na Fase 0-7 (dados locais). Login + Supabase entram na Aula 3. |
| **Mobile-first** | Sim. Funciona perfeito no celular, adapta pra desktop. Preview duplo mostra os dois lado a lado. |
| **Dados** | Fase 0-7: localStorage (navegador). Aula 3: migra pra Supabase com login. |
| **Paleta** | Rosa quente `#e88ba3` + Verde menta `#7ec8c8` + Cinza claro `#f0f0f0` + Preto `#2a2a2a` |
| **Tipografia** | Poppins (títulos) + Inter (corpo). Clean, moderno, wellness. |
| **Referência visual** | Direct Line (cards arredondados, bottom bar, heatmap), mas com estética própria. |

---

## 2. Telas do app

| Tela | O que você faz nela |
|---|---|
| **Home (Painel)** | Vê sua semana em heatmap, calendário visual, e tudo que tem pra fazer hoje (hábitos, tarefas, consultório, rotina). Adiciona novas ações. |
| **Hábitos** | Rastreia hábitos diários, marca como concluído, vê heatmap de consistência (quanto tempo seguido fez cada hábito). |
| **Metas** | Cria metas com datas, acompanha progresso (%), histórico de evolução. |
| **Consultório** | Lista consultas agendadas, observações de pacientes, lembretes de retorno. |
| **Tarefas** | Gerencia tarefas do dia/semana, marca como concluído, categoriza (pessoal/trabalho/conteúdo). |
| **Roteiros** | Vê roteiros prontos de stories por categoria (Humanização, Engajamento, Vendas), marca status (rascunho/pronto/gravado/postado). |
| **Banco de Ideias** | Anota ideias soltas, classifica como conteúdo/pessoal/trabalho, depois converte em tarefa ou roteiro. |
| **Humor** | Faz o check-in emocional do dia (emoji), vê retrospectiva da semana. |
| **Diário** | Escreve livremente com data, revê entradas antigas. |

---

## 3. O diferencial (detalhado)

### A função nº 1: **Home como painel único da sua vida**

Quando você abre o app, vê tudo que importa hoje:

**Topo da tela:**
- Saudação ("Boa tarde, Melyna")
- Pontos/progresso de gamificação (entra na Versão 2, mas estrutura já fica pronta)
- Indicador de "X dias seguido" de alguma meta/hábito importante

**Calendário semanal visual:**
- Barra de dias (seg-dom) com indicador de qual é hoje
- Cada dia mostra um pequeno heatmap/progresso do dia
- Você pode navegar pra semana anterior/próxima com setinhas

**O que fazer HOJE:**
- **Seção "Hoje"** mostrando:
  - Seus hábitos do dia (checkbox de concluído ou não)
  - Tarefas pendentes (com horário se tem)
  - Consultório: consultas agendadas (paciente, horário)
  - Rotina fixa: coisas que você combinou pra fazer todo dia
  - Banco de ideias marcados pra hoje

**Botão flutuante:**
- "+ Adicionar ação" → abre modal pra criar hábito, tarefa, consulta, ideia ou roteiro

### A função nº 2 (próxima): **Hábitos com visual de consistência**

Não é só checkbox. Você vê em um heatmap estilo GitHub:
- Qual foi o seu "record" (X dias seguidos)
- Quais dias você fez/não fez
- Tendência da semana/mês
- Cada hábito tem uma cor

---

## 4. O que o app guarda

Tudo é salvo no navegador (localStorage). Estrutura simples em português:

**Hábitos:**
- Nome (ex: "Beber 2L de água")
- Descrição (ex: "8 copos por dia")
- Frequência (diário/semanal/custom)
- Cor (pra identificar rápido)
- Data de início
- Histórico: {data: true/false} (concluiu ou não?)

**Metas:**
- Nome (ex: "30 dias sem açúcar")
- Descrição
- Data de início, data de término
- Progresso (%)
- Histórico de evolução

**Tarefas:**
- Título
- Descrição
- Data, horário (opcional)
- Categoria (pessoal/trabalho/conteúdo)
- Status (pendente/concluído)
- Prioridade (baixa/média/alta)

**Consultório/Agenda:**
- Paciente: nome, telefone
- Data, horário
- Observações
- Status (agendado/feito/cancelado)

**Roteiros de Stories:**
- Título (ex: "A nutri que ninguém vê")
- Categoria (Humanização/Engajamento/Vendas)
- Plataforma (Instagram/TikTok/YouTube)
- Texto do roteiro (abertura, transições, encerramento)
- Status (rascunho/pronto/gravado/postado)

**Banco de Ideias:**
- Título
- Descrição
- Categoria (conteúdo/pessoal/trabalho)
- Data criada
- Status (ideia/rascunho/desenvolvimento)

**Gamificação:**
- Pontos totais
- Nível atual
- Histórico de pontos (data, origem — hábito/tarefa concluído, quantos pontos)

**Humor/Check-in:**
- Data
- Emoji/humor do dia
- Nota opcional

**Diário:**
- Data
- Texto da entrada

---

## 5. Fases de construção

| Fase | O que entrega | Quando (workshop) | Status |
|---|---|---|---|
| **0. Setup + Preview duplo** | Projeto rodando, paleta + fonte aplicadas, preview mostrando app em celular e desktop lado a lado. | Aula 2 | ✅ Pronto |
| **1. Home (Painel)** | Calendário semanal visual, lista do dia (hábitos, tarefas, consultório, rotina), botão pra adicionar ação. Dados salvam em localStorage. | Aula 2 | ✅ Pronto |
| **2. Hábitos com heatmap** | Página de hábitos com checkbox diário, heatmap visual de consistência, records, histórico. | Aula 2 / Dever | ✅ Pronto |
| **3. Metas com progresso** | Criar metas, ver progresso (%), histórico de evolução, visual de progresso. | Dever de casa | ✅ Pronto |
| **4. Consultório/Agenda** | Listar consultas, adicionar pacientes, observações, lembretes de retorno. | Dever de casa | ✅ Pronto |
| **5. Tarefas** | Gerenciar tarefas, categorizar (pessoal/trabalho/conteúdo), marcar concluído, priorizar. | Dever de casa | ✅ Pronto |
| **6. Roteiros de Stories** | Visualizar roteiros prontos por categoria, status (rascunho/pronto/gravado/postado), copiar pra colar. | Dever de casa | ✅ Pronto |
| **7. Banco de Ideias** | Adicionar ideias, classificar, converter em tarefa/roteiro depois (cobre o "brain dump"). | Dever de casa | ✅ Pronto |
| **8. Gamificação** | Pontos por hábito/tarefa concluído, nível, indicador visível na Home. | Pós-workshop | ✅ Pronto |
| **9. Humor/Check-in** | Registro diário de humor (emoji), retrospectiva da semana. Junto com o Diário na mesma aba. | Pós-workshop | ✅ Pronto |
| **10. Diário** | Escrita livre por data, buscável. Junto com o Humor na mesma aba. | Pós-workshop | ✅ Pronto |
| **Final. Publicar** | Conectar Supabase (dados de verdade + login), deploy na Vercel, instalar como PWA no celular. | Aula 3 | ⏳ Depois |

---

## 6. Versão 2 (fica pra depois) 🚀

- **✅ IA como assistente de rotina completa — já construída:** o botão "+ Adicionar ação" da Home tem o "Plano de Rotina com IA": você escolhe áreas (treino, estudos, casa, leitura, skincare), a frequência e um foco opcional, e o app gera as tarefas certas pra cada área direto na Home — via regras fixas, sem gastar com API de IA.
- **Gamificação, Humor/Check-in e Diário** viraram fases reais (8, 9 e 10 acima), na ordem de prioridade que você definiu.
- **Brain dump** não virou fase separada — é a mesma coisa que a Fase 7 (Banco de Ideias): anotar ideia solta e depois converter em tarefa/roteiro.

Sem prioridade definida ainda, mas continuam anotadas pra um dia:

- **Integrações:** Google Calendar, WhatsApp, automações
- **Relatórios avançados:** Exportar dados, gráficos de tendência
- **Compartilhamento:** Mostrar progresso pra amigos ou comunidade

---

## 📋 Checklist do MVP

Quando terminar todas as fases + publicar na Aula 3, você terá:

- [x] Home mostrando seu dia completo
- [x] Hábitos rastreados com visual
- [x] Metas com progresso
- [x] Consultório organizado
- [x] Tarefas gerenciadas
- [x] Roteiros de stories prontos pra postar
- [x] IA de rotina (questionário + regras fixas) gerando tarefas por área
- [x] Banco de ideias funcionando
- [x] Gamificação (pontos, nível)
- [x] Humor/check-in diário
- [x] Diário pessoal
- [x] Dados salvando no navegador
- [x] Preview duplo (celular + desktop)
- [ ] Publicado e rodando na Vercel
- [ ] PWA instalável no celular

**E aí, topou começar?** 🚀
