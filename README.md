# 📅 NutriRotina — MVP

Um app pessoal de planner para nutricionista que organiza rotina diária, integra Google Calendar, sugere roteiro de stories e aprende ao longo do tempo.

## 🚀 Como rodar

### Pré-requisitos
- Um servidor web simples (Live Server, http-server, ou similar)

### Passos

1. **Instalar Live Server** (VS Code extension recomendado):
   - No VS Code, instale a extensão "Live Server" by Ritwick Dey
   - Ou use: `npx http-server` no terminal

2. **Rodar o app**:
   - Se usar Live Server: clique direito em `index.html` → "Open with Live Server"
   - Ou: `npx http-server` e acesse `http://localhost:8080`

3. **Ver preview duplo**:
   - Abra `preview.html` no navegador
   - Ele carrega o app em dois tamanhos lado a lado (celular + computador)

## 📱 Preview Duplo

O `preview.html` mostra o app em dois iframes simultaneamente:
- **Esquerda**: Celular (390px) — com moldura de iPhone
- **Direita**: Computador (1200px+) — com chrome simulada

Ambos iframes apontam pro mesmo localhost, então quando você edita o app, ambas as telas atualizam automaticamente.

## 🎨 Design System

**Paleta:**
- Rosa destaque: `#e88ba3`
- Cinza texto: `#6b6b6b`
- Branco fundo: `#ffffff`
- Cinza claro bordas: `#e0e0e0`

**Tipografia:**
- Headings: Plus Jakarta Sans
- Corpo: Inter

**Vibe:** Clean, acessível, tipo Sunsama

## 📋 Fases de desenvolvimento

- [x] **Fase 0:** Setup + preview duplo
- [ ] **Fase 1:** Home (dia de hoje)
- [ ] **Fase 2:** Banco de tarefas
- [ ] **Fase 3:** Banco de ideias
- [ ] **Fase 4:** Planejamento noturno + Roteiro
- [ ] **Fase 5:** Feed de novidades
- [ ] **Fase 6:** Feedback noturno
- [ ] **Final:** Publicar (Supabase + Vercel + PWA)

## 📂 Estrutura

```
├── index.html       # App principal
├── preview.html     # Preview duplo
├── styles.css       # Design system
├── app.js           # Lógica do app
├── PLANO.md         # Plano completo
└── PROMPTS.md       # Prompts prontos por fase
```

Desenvolvido com ❤️ para organizar sua rotina.
