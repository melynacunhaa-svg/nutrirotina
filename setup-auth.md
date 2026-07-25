# ⚙️ Configurar Login no Supabase

## Opção 1: Manual (5 cliques) — RECOMENDADO

1. Abre: https://supabase.com/dashboard/project/lqihzcwundjlxdwedeqq/auth/providers
2. Procura por **Email** e deixa **HABILITADO** ✅
3. Volta pro menu esquerdo e clica em **Settings** (dentro de Authentication)
4. Procura por **"Confirm email"** e DESATIVA ❌ (toggle pra esquerda/cinza)
5. Clica **Save** 💾

Pronto! ✅

---

## Opção 2: Automático via Script

Se preferir, abra o painel em uma aba e execute este script no Console (F12):

```javascript
// Ir pra página de providers e habilitar Email
window.location.href = 'https://supabase.com/dashboard/project/lqihzcwundjlxdwedeqq/auth/providers';

// Espera carregar e depois:
setTimeout(() => {
  // Procura o toggle de Email e liga
  const emailToggle = document.querySelector('[data-provider="email"]');
  if (emailToggle) emailToggle.click();
}, 2000);

// Depois vai pra Settings
setTimeout(() => {
  window.location.href = 'https://supabase.com/dashboard/project/lqihzcwundjlxdwedeqq/auth/settings';
}, 4000);
```

---

## Resumo do que ativa:
✅ Login por e-mail + senha  
✅ Desativa confirmação de e-mail (facilita testes)  
✅ Tá pronto pra receber contas

Qual opção você quer fazer?
