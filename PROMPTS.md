# 📝 PROMPTS — NutriRotina (prontos pra copiar e colar)

Cada prompt abaixo é **completo e independente**. Se você fechar a conversa e voltar depois, é só colar o prompt da fase onde parou.

---

## Prompt — Fase 0: Setup + Preview duplo

```
Leia o arquivo PLANO.md do projeto NutriRotina.

Estou construindo o NutriRotina, um app pessoal de planner pra nutricionista que organiza rotina diária, integra Google Calendar, sugere roteiro de stories e aprende ao longo do tempo.

Vamos construir SÓ a Fase 0 agora: setup e preview duplo.

Nesta fase você vai:

1. **Criar a estrutura HTML/CSS/JS** do projeto (ou usando React/Vue se preferir — mas quer dizer que precisa de um dev server). Mobile-first.

2. **Aplicar a identidade visual:**
   - Paleta: rosa `#e88ba3` (destaque) + cinza `#6b6b6b` (texto) + branco `#ffffff` (fundo) + cinza claro `#e0e0e0` (bordas)
   - Fonte: Plus Jakarta Sans (headings) + Inter (corpo), ambas do Google Fonts
   - Vibe: clean, acessível, minimalista tipo Sunsama
   - Espaçamento: generoso, respira bem

3. **Criar uma tela de preview duplo** (`preview.html` ou equivalente):
   - Dois iframes lado a lado
   - À esquerda: moldura de celular (~390px de largura, com visual de telefone, com home button/notch fake, etc.)
   - À direita: moldura de computador (largura maior, tipo 1200px)
   - Ambos os iframes apontam pro **MESMO app rodando** no localhost (ex.: `http://localhost:3000` se React, ou `http://localhost:5500` se estático com Live Server)
   - **Importante:** os iframes carregam o app de verdade e clicável nos dois tamanhos. Quando você edita o app, ambas as telas atualizam automaticamente (hot reload).
   - O preview tem um layout bonito, talvez um título "NutriRotina — Preview" e as duas telas bem alinhadas

4. **A primeira página do app** (que vai dentro dos iframes) pode ser bem simples nessa fase:
   - Uma Home básica, mobile-first
   - Header com o nome "NutriRotina" e um ícone/logo (pode ser um emoji mesmo, tipo 📅 ou 🌿)
   - Um espaço pro conteúdo (vazio agora, mas estruturado pra receber telas depois)
   - Um menu/navegação simples pra navegar entre as telas (Home, Tarefas, Ideias, Planejamento, etc.) — pode ser ícones em um footer, ou um menu hambúrguer mobile, o que achar melhor
   - Usar localStorage pra guardar preferências (como tema, se houver)

5. **Configurar tudo pra funcionar**:
   - Se for HTML puro: sobe num dev server simples (Live Server do VS Code, ou `npx http-server`)
   - Se for React/Vue: `npm run dev` ou equivalente
   - Certifique-se que os iframes conseguem carregar o localhost sem erros CORS

6. **Configurar tom de voz:** Textos que o app gera (labels, botões, mensagens) usam linguagem simples, direto, próximo, "tu", com emojis equilibrados (💖 ✨ 💫 🌿). Exemplos: "Cê tá no controle 💖", "Bora organizar seu dia?", "Adicionar ideia rápido ✨"

Não faça ainda:
- Não integrar de verdade com Google Calendar (dados fake/mock tá ótimo nessa fase)
- Não adicionar lógica de Tarefas, Ideias, Planejamento ou Roteiro (só a tela vazia mesmo)
- Não usar banco de dados (localStorage tá ótimo)
- Não instalar pacotes além do essencial

Está pronto quando:
- [ ] Abro o `preview.html`, vejo o app em duas telas lado a lado (celular à esquerda, computador à direita)
- [ ] Consigo clicar nos dois e ambas as telas respondem (é o mesmo app)
- [ ] A identidade visual tá aplicada (rosa, cinza, branco, fonte correta)
- [ ] Se editar um arquivo, ambas as telas atualizam automaticamente
- [ ] A navegação entre telas funciona nos dois tamanhos igualmente bem
```

---

## Prompt — Fase 1: Home (dia de hoje)

```
Leia o arquivo PLANO.md do projeto NutriRotina. Estou construindo o NutriRotina.

Já concluí a Fase 0 (setup + preview duplo). Agora vamos construir a Fase 1: a tela Home (dia de hoje).

Nesta fase:
- Criar a tela **Home**, que é a primeira tela que abre quando alguém entra no app
- A Home mostra **tudo de uma vez:** agenda do dia (Google Calendar), tarefas do dia (do banco de tarefas), e espaço reservado pro roteiro de stories

Estrutura da Home:
1. **Header:** "Seu dia hoje, 📅 [data de hoje]" (ou algo assim, no tom da marca)
2. **Seção Agenda (Google Calendar):**
   - Lista as consultas/eventos do dia (dados fake primeiro, tipo 3 eventos fixos pra testar)
   - Cada evento mostra: horário, título, local/descrição
   - Ícones visuais pra diferenciar (ícone de consulta, ícone de treino, etc.)
3. **Seção Tarefas:**
   - Lista as tarefas do dia (vindas do banco de tarefas que vamos construir na Fase 2)
   - Cada tarefa mostra: checkbox (pra marcar como feita), título, status
   - Se não houver tarefas, mensagem tipo "Tá tudo em dia por agora 💖"
4. **Seção Roteiro de Stories:**
   - Espaço reservado (pode ser um placeholder tipo "Seu roteiro de stories vai aparecer aqui de manhã ✨")
   - Logo vai receber o roteiro gerado na Fase 4

Design:
- Mobile-first, uma coluna só
- Separação clara entre as 3 seções (Cards? Dividers? O que combinar com a identidade)
- Paleta rosa + cinza + branco
- Toque no tom de voz: "Seu dia hoje", "Bora lá", emojis nos lugares certos

Não faça ainda:
- Não integrar de verdade com Google Calendar (dados mock/fake tá ótimo)
- Não implementar lógica de Tarefas ainda (vai vir na Fase 2, aqui é só espaço vazio ou mock)
- Não tentar gerar o roteiro de stories (vai ser na Fase 4)

Está pronto quando:
- [ ] Abro a Home e vejo as 3 seções bem definidas (agenda, tarefas, roteiro)
- [ ] Os dados fake aparecem e tão legíveis
- [ ] No celular e no computador (preview duplo) tá bonito e funciona bem
- [ ] O tom de voz da marca tá consistente (linguagem simples, "tu", emojis)
```

---

## Prompt — Fase 2: Banco de tarefas

```
Leia o arquivo PLANO.md do projeto NutriRotina. Estou construindo o NutriRotina.

Já concluí as Fases 0 e 1 (setup + Home). Agora vamos construir a Fase 2: o banco de tarefas.

Nesta fase:
- Criar uma tela **Banco de Tarefas** onde a pessoa adiciona tarefas ao longo do dia
- As tarefas do dia aparecem automaticamente na Home
- Tarefas sem data fica visíveis até serem marcadas como feitas

Estrutura do Banco de Tarefas:
1. **Campo pra adicionar tarefa:**
   - Input de texto simples (placeholder: "Adicionar tarefa... 📝")
   - Botão "Adicionar" ou só Enter
   - Campo de data opcional (ou um toggle "pra hoje" vs "pra depois")

2. **Lista de tarefas:**
   - Checkbox + título da tarefa + [ícone de delete]
   - Status visual: ✅ quando marcada como feita (tachado, cor diferente)
   - Se não houver tarefas: "Nenhuma tarefa ainda. Bora caprichar? 💖"

3. **Integração com Home:**
   - As tarefas "do dia" aparecem na Home automaticamente
   - Tarefas sem data (soltas) também aparecem na Home até serem feitas

Dados (localStorage):
- Guardar cada tarefa com: id, título, status (pendente/feita), data (opcional), criadaEm
- Ao carregar a página, restaurar todas as tarefas do localStorage

Design:
- Tela separada (acessível pelo menu)
- Mobile-first
- Paleta rosa + cinza + branco
- Ton de voz: simples, próximo, emojis equilibrados

Não faça ainda:
- Não implementar edição de tarefas (só adicionar, marcar como feita, deletar)
- Não criar categorias ou tags de tarefas (o simples funciona melhor agora)
- Não tentar sincronizar com Google Calendar

Está pronto quando:
- [ ] Consigo adicionar uma tarefa e ela aparece na lista
- [ ] Consigo marcar como feita (checkbox) e ela muda visualmente
- [ ] As tarefas do dia aparecem na Home automaticamente
- [ ] Se fechar e abrir de novo, as tarefas tão lá (localStorage funcionando)
- [ ] Funciona bem no celular e no computador
```

---

## Prompt — Fase 3: Banco de ideias

```
Leia o arquivo PLANO.md do projeto NutriRotina. Estou construindo o NutriRotina.

Já concluí as Fases 0, 1 e 2 (setup + Home + Tarefas). Agora vamos construir a Fase 3: o banco de ideias.

Nesta fase:
- Criar a tela **Banco de Ideias**
- Campo rápido de texto pra anotar ideias soltas de conteúdo (no consultório, no trânsito, assistindo um vídeo, etc.)
- Ideias ficam armazenadas e o app puxa delas quando monta o roteiro (Fase 4)

Estrutura do Banco de Ideias:
1. **Campo rápido de texto:**
   - Textarea grande (mobile-first, ocupa a maioria da tela)
   - Placeholder: "Ideia rápida... 💭 (ex: 'falar sobre paciente que parou com medo de engordar depois')"
   - Botão "Salvar ideia" bem grande/destacado (rosa!)
   - Depois de salvar, campo limpa e pronto pro próximo

2. **Lista de ideias já cadastradas:**
   - Abaixo do campo, lista todas as ideias salvas
   - Cada ideia mostra: texto, data que foi criada, status (nova / usada no roteiro)
   - [Ícone de delete] ou deslize pra deletar (mobile UX)
   - Se não houver ideias: "Nenhuma ideia cadastrada ainda. Comece a capturar! 💡"

3. **Status de ideias:**
   - Quando uma ideia é usada no roteiro (na Fase 4), seu status muda pra "usada"
   - Ideias usadas podem ficar com cor diferente ou um ícone indicando que foram puxadas

Dados (localStorage):
- Guardar cada ideia com: id, texto, criadaEm, status (nova/usada)

Design:
- Tela separada (acessível pelo menu)
- Mobile-first, simples, foco no texto
- Paleta rosa + cinza + branco
- Tom de voz: "Bora capturar essa ideia?", emojis

Não faça ainda:
- Não implementar busca em ideias (é só uma lista simples agora)
- Não tentar editar ideias (só criar e deletar)
- Não adicionar tags ou categorias

Está pronto quando:
- [ ] Consigo digitar uma ideia e clicar em "Salvar"
- [ ] A ideia aparece na lista abaixo
- [ ] Se fechar e abrir de novo, as ideias tão lá (localStorage)
- [ ] Consigo deletar uma ideia
- [ ] Funciona bem no celular e no computador
```

---

## Prompt — Fase 4: Planejamento noturno + Roteiro de stories

```
Leia o arquivo PLANO.md do projeto NutriRotina. Estou construindo o NutriRotina.

Já concluí as Fases 0, 1, 2 e 3 (setup + Home + Tarefas + Ideias). Agora vamos construir a **Fase 4: o coração do app** — Planejamento noturno + Roteiro de stories.

**IMPORTANTE:** Esta é a fase que define o diferencial do app. Leia bem a seção "3. O diferencial (detalhado)" do PLANO.md.

Nesta fase você vai criar:

### 1. Tela de **Planejamento noturno:**
- À noite, a pessoa abre essa tela e registra como vai ser amanhã
- Campos:
  - Local (select: Viamão / POA / casa / consultório)
  - Número de consultas (número 0-10)
  - Período livre (select: manhã / tarde / ambos / nenhum)
  - Observações (textarea opcional)
  - Botão "Planejar amanhã" (rosa!)
- **Regra:** sem preencher esses dados, o app não consegue gerar o roteiro. Validar os campos.
- Depois de salvar, mostrar uma mensagem tipo "Seu roteiro tá pronto pra amanhã! 💖 Durma bem."

### 2. Tela de **Roteiro de stories** (gerado):
- Mostra o roteiro já pronto, com 3 sequências fixas em 3 categorias:
  - **Humanização:** (descrição, origem da ideia)
  - **Engajamento:** (descrição, origem)
  - **Vendas:** (descrição, origem)
- Cada sequência mostra:
  - Ícone da categoria (um emoji que represente cada uma, tipo 💭 / 💬 / 💰)
  - Título/descrição do story
  - Origem: "Sua ideia" (se veio do banco de ideias) | "Trending" (se veio do trending/feed) | "Automática" (sugestão do app)
- Botões: "Postei ✅" ou "Não postei ❌"
- Se clicar em "Não postei", abre um campo pra deixar motivo curto

### 3. A **lógica de geração do roteiro** (aqui é o diferencial):
- Quando a pessoa salva o planejamento noturno, o app gera um roteiro com base em:
  1. **Prioritário:** ideias que ela mesma cadastrou no banco de ideias (status = nova)
  2. **Secundário:** assuntos trending em nutrição/emagrecimento (aqui você pode fingir/mock uns assuntos tipo "GLP-1", "Intestino saudável", "Efeito rebote", etc.)
  3. **Terceiro:** sugestões automáticas baseadas no tipo de dia (ex: muitas consultas = conteúdo de autoridade/vendas; muito tempo livre = humanização/bastidor)
  
- O roteiro SEMPRE segue 3 sequências: uma pra cada categoria (Humanização, Engajamento, Vendas)
- Exemplo output:
  ```
  📅 Seu roteiro pra amanhã — 3 consultas à tarde em POA, manhã livre em casa
  
  1️⃣ 💭 Humanização — Rotina de manhã em casa (Sua ideia: "mostrar como começo meu dia")
  
  2️⃣ 💬 Engajamento — "Qual é o seu medo com GLP-1?" Quiz nos stories (Trending: GLP-1)
  
  3️⃣ 💰 Vendas — "Quer saber como funciona uma consulta?" Convite pra agendar (Automática)
  ```

### 4. Integração com **Home**:
- Quando a Home carrega de manhã, mostra o roteiro do dia (se existe um planejamento pra esse dia)
- Se não houver planejamento pra hoje, mostra placeholder "Ah, esqueceu de planejar ontem? Fica pra hoje 😊"

Dados (localStorage):
- Guardar cada planejamento com: id, dataDoDiaSeguite, local, numConsultas, períodoLivre, observações, criadoEm
- Guardar cada roteiro gerado com: id, dataDoDia, sequências (array com as 3 sequências), statusPostagem (postei/não postei), motivo (se não postou)

Design:
- Duas telas (Planejamento e Roteiro), bem diferenciadas
- Planejamento é noturno (pode ter um tom/visual mais "repouso" — cores mais suaves)
- Roteiro é de manhã (visual limpo, pronto pra ação)
- Mobile-first
- Paleta rosa + cinza + branco
- Tom de voz: "Vamo planejar seu dia?", "Seu roteiro tá pronto!", emojis

Não faça ainda:
- Não tentar analisar trending de verdade (mock/fake tá ótimo agora)
- Não fazer IA de verdade pra gerar sugestões (lógica simples funciona — tipo: se muitas consultas, puxa ideias de "vendas" do seu banco)
- Não integrar com Google Calendar (dados fake tá ótimo)
- Não implementar o loop de aprendizado ainda (vai ser na Fase 6)

Está pronto quando:
- [ ] Consigo preencher o planejamento noturno (local, consultas, período livre)
- [ ] Ao salvar, o app gera um roteiro com 3 sequências nas 3 categorias
- [ ] O roteiro aparece na Home de manhã (se carregar a página com o dia de hoje)
- [ ] Cada sequência mostra a origem (sua ideia / trending / automática)
- [ ] Consigo marcar como "Postei" ou "Não postei" e deixar motivo
- [ ] Fechei e abri de novo, dados tão lá (localStorage)
- [ ] Funciona bem no celular e no computador
- [ ] O tom de voz tá consistente (simples, próximo, emojis)
```

---

## Prompt — Fase 5: Feed de novidades (Versão 2)

```
Leia o arquivo PLANO.md do projeto NutriRotina.

Esta é a Fase 5 (Versão 2 — melhoria): Feed de novidades.

[Prompt completo omitido nessa versão — será gerado quando chegar a hora]

Está pronto quando:
- [ ] Consigo ver assuntos trending em nutrição/emagrecimento em uma tela
- [ ] Cada assunto é uma pauta pronta pra virar story
- [ ] Consigo salvar um assunto como ideia no banco de ideias
```

---

## Prompt — Fase 6: Feedback noturno (Versão 2)

```
Leia o arquivo PLANO.md do projeto NutriRotina.

Esta é a Fase 6 (Versão 2 — melhoria): Feedback noturno (loop de aprendizado).

[Prompt completo omitido nessa versão — será gerado quando chegar a hora]

Está pronto quando:
- [ ] À noite consigo registrar o que postei/não postei e motivo
- [ ] O app aprende com esses padrões e ajusta sugestões futuras
```

---

## Prompt — Final: Publicar (Supabase + Vercel + PWA)

```
Leia o arquivo PLANO.md do projeto NutriRotina.

Estou terminando o NutriRotina e agora vamos publicar pra valer.

Nesta fase você vai:

1. **Integrar Google Calendar API de verdade** (leitura apenas) — a Home vai puxar eventos reais do calendário da Melyna
2. **Migrar dados de localStorage pra Supabase** — tarefas, ideias, planejamentos, roteiros, feedback — tudo guardado na nuvem
3. **Deploy na Vercel** — o app fica acessível em um domínio (tipo `nutri-rotina.vercel.app`)
4. **Instalar como PWA no celular** — "Adicionar à tela inicial" funciona e o app fica com ícone + nome

Não precisa de login porque é um app pessoal (usuário único).

[Prompt completo detalhado — será gerado quando chegar a hora]

Está pronto quando:
- [ ] Google Calendar real aparece na Home
- [ ] Dados tão salvando no Supabase (não mais em localStorage)
- [ ] Deploy tá live na Vercel
- [ ] PWA funciona no celular (ícone na home, abre sem abrir navegador)
```

---

**Próximos passos:** Vamos partir pra **Fase 0** agora mesmo! 🚀
