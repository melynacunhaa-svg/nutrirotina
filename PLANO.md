# 📱 NutriRotina — Plano do MVP
> Um app pessoal que organiza sua rotina diária integrando Google Calendar, sugere roteiro de stories baseado no seu dia, e aprende com seu padrão.

---

## 1. Decisões

| Tema | Decisão |
|---|---|
| **Quem usa** | Melyna Cunha (nutricionista, 1 pessoa, uso pessoal) — sem login, sem multi-usuário |
| **Quando funciona** | Mobile-first (celular o tempo todo), funciona bem em computador também |
| **Onde os dados ficam** | localStorage primeiro (Fases 0–6), Supabase + Google Calendar API na fase final |
| **Identidade visual** | Paleta: rosa `#e88ba3` + cinza `#6b6b6b` + branco + cinza claro `#e0e0e0`. Fonte: Plus Jakarta Sans + Inter. Vibe: clean, acessível, tipo Sunsama. Tom de voz: simples, direto, próximo, "tu", emojis equilibrados (💖 ✨ 💫 🌿) |
| **Referência de layout** | Inspiração em: Notion (organização por categorias), Sunsama (simplicidade), Google Calendar (base visual) |

---

## 2. Telas do app

| Tela | O que a pessoa faz nela |
|---|---|
| **Home (dia de hoje)** | Vê tudo de uma vez: agenda do dia (Google Calendar), tarefas do dia (do banco de tarefas), e o roteiro de stories gerado pelo app. É a primeira tela que abre. |
| **Planejamento noturno** | À noite, registra como vai ser amanhã: onde vai estar (Viamão/POA/casa/consultório), quantas consultas tem e em qual período, qual período tá livre. O app processa e gera o roteiro pra manhã. |
| **Roteiro de stories** | Vê o roteiro gerado, dividido em 3 categorias fixas (Humanização, Engajamento, Vendas). Pode marcar como "postei" ou "não postei" com motivo. |
| **Banco de tarefas** | Adiciona tarefas ao longo do dia. As tarefas do dia aparecem na Home. Pode marcar como feita, adicionar data ou deixar solta. |
| **Banco de ideias** | Campo rápido de texto pra anotar ideias soltas de conteúdo (no consultório, no trânsito, etc.). Ideias ficam armazenadas e o app puxa delas quando monta o roteiro. |
| **Feed de novidades** | Vê assuntos do momento em nutrição/emagrecimento já transformados em pautas prontas pra story. Pode salvar uma novidade como ideia no banco. |
| **Atualização noturna (feedback)** | No fim do dia, registra: o que postou, o que funcionou, o que não postou e por quê. O app usa isso pra ajustar sugestões futuras. |

---

## 3. O diferencial (detalhado)

### ⭐ Roteiro inteligente de stories — o coração do app

**À noite:** você abre o app e registra como vai ser seu amanhã — onde vai estar, quantas consultas, qual período tá livre.

**De manhã:** quando abre o app, o roteiro de stories já tá pronto, **adaptado especificamente ao seu dia e ao que você já cadastrou**. Ele puxa de três fontes, nesta ordem:

1. **Suas ideias cadastradas** (prioridade máxima) — se você anotou "falar sobre fome emocional", isso entra no roteiro.
2. **Trending topics em nutrição/emagrecimento** (do feed de novidades).
3. **Sugestões automáticas** baseadas no tipo de dia que você tem (muitas consultas = conteúdo de autoridade; manhã livre = bastidor/humanização).

**Exemplo real:**
> Você registrou à noite: "Amanhã: 3 consultas à tarde em POA, manhã livre em casa."  
> De manhã, o roteiro tá pronto:  
> 1. **Humanização:** bastidores do consultório (a foto do seu dia)  
> 2. **Autoridade:** paciente que parou com medo de engordar depois (sua ideia cadastrada)  
> 3. **Vendas:** convite pra agendar consultoria  

**As 3 categorias são fixas:**
- **Humanização:** bastidores, rotina, histórias reais, conexão pessoal.
- **Engajamento:** caixinhas, quizzes, perguntas, interação.
- **Vendas:** quebra de objeção, convite pra agendar, mostrar como funciona o acompanhamento.

**Sem o planejamento noturno, o roteiro não funciona** — ele é o gatilho que faz o app processar e sugerir.

---

## 4. O que o app guarda

**Tarefa**
- Título, status (pendente / fazendo / feita), data (opcional), criada em

**Ideia de conteúdo**
- Texto da ideia, criada em, status (nova / usada no roteiro)

**Planejamento noturno**
- Data do dia seguinte, local (Viamão / POA / casa / consultório), número de consultas, período livre (manhã / tarde / ambos), observações

**Roteiro de stories**
- Data, sequências (categoria + descrição + origem [minha ideia / novidade / automática]), status (postei / não postei), feedback noturno

**Feedback noturno**
- Data, o que postou, o que não postou, motivo, observações gerais

**Agenda (do Google Calendar)**
- Lida do Google Calendar, apenas leitura no MVP: consultas, horários, local

**Como tudo se liga:**
- O roteiro do dia puxa do banco de ideias (suas ideias têm prioridade) + feed de novidades (assuntos do momento) + padrão do seu feedback anterior.
- O planejamento noturno alimenta o roteiro do dia seguinte.
- O feedback noturno ajusta as sugestões futuras (aprendizado contínuo).

---

## 5. Fases de construção

| Fase | O que entrega | Quando |
|---|---|---|
| **0. Setup + preview duplo** | Projeto rodando no navegador, mobile-first, com a identidade do NutriRotina (paleta rosa + cinza + branco, Plus Jakarta Sans, tom de voz). **Uma tela de preview (`preview.html`) que mostra o app duas vezes lado a lado: à esquerda numa moldura de celular (~390px), à direita em largura de computador. Os dois iframes apontam pro mesmo app rodando, então tudo funciona nos dois tamanhos ao mesmo tempo.** | Aula 2 |
| **1. Home (dia de hoje)** | Tela principal com: agenda do Google Calendar do dia (integração read-only, dados fake pra agora), banco de tarefas visível, espaço reservado pro roteiro. Dados em localStorage. | Aula 2 |
| **2. Banco de tarefas** | Adicionar, marcar como feita, ver tarefas do dia. Acumulador que vai alimentando e aparece na Home. | Aula 2 / dever |
| **3. Banco de ideias** | Campo rápido de texto pra anotar ideias soltas. Lista de ideias cadastradas com status (nova/usada). | Dever de casa |
| **4. Planejamento noturno + Roteiro de stories** | Tela noturna onde registra como vai ser amanhã. O app processa e gera o roteiro (com as 3 categorias). Roteiro aparece na Home de manhã. | Dever de casa |
| **5. Feed de novidades** | Assuntos do momento em nutrição/emagrecimento transformados em pautas prontas. Pode salvar como ideia. | Versão 2* |
| **6. Feedback noturno (loop de aprendizado)** | No fim do dia, registra o que postou/não postou e por quê. O app ajusta sugestões futuras. | Versão 2* |
| **Final. Publicar** | Google Calendar API (leitura real) + Supabase (dados de verdade, sem login) + deploy na Vercel + PWA no celular | Aula 3 |

**\*Nota:** Fases 5 e 6 podem ser adicionadas antes da publicação se houver tempo. Elas refinam o aprendizado, mas não são essenciais pro app cumprir a promessa inicial (roteiro automático baseado no dia + tarefas + ideias).

---

## 6. Versão 2 (fica pra depois)

Essas ideias não entram no MVP — são melhorias futuras:

- Metas e objetivos mensais com acompanhamento visual (meta de pacientes, meta de posts, meta de treinos).
- Sincronização bidirecional com Google Calendar (editar dos dois lados).
- Agendamento automático de posts no Instagram.
- Notificação push lembrando de postar os stories do dia.
- Integração com TikTok e YouTube.
- Versão pra vender pra outros nutricionistas.
- Feed de novidades com IA analisando trending topics em tempo real.

---

## 7. Critério de pronto

O app tá completo quando:
- ✅ Abre de manhã, mostra Home com agenda + tarefas + roteiro.
- ✅ À noite, consegue registrar como vai ser amanhã e o app gera um roteiro com as 3 categorias.
- ✅ Banco de tarefas funciona: adiciona, marca como feita, aparece na Home.
- ✅ Banco de ideias funciona: anota, lista aparece, as ideias podem ser puxadas pro roteiro.
- ✅ Tudo funciona igualmente bem no celular e no computador.
- ✅ Tom de voz tá consistente em todo o app (simples, direto, "tu", emojis equilibrados).
- ✅ Preview duplo abre lado a lado e tudo funciona nos dois tamanhos.

---

**Documento elaborado em 24 de julho de 2026.**
