// Auth Handler - Gerencia login, cadastro e verificação de autenticação

let currentUser = null;

// Esperar Supabase estar pronto
function waitForSupabase() {
  return new Promise((resolve) => {
    if (typeof supabase !== 'undefined') {
      resolve();
    } else {
      setTimeout(() => waitForSupabase().then(resolve), 100);
    }
  });
}

// Verificar se usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  await waitForSupabase();

  // Verificar se é link de reset de senha
  const hash = window.location.hash;
  if (hash.includes('type=recovery')) {
    console.log('🔐 Link de reset de senha detectado');
    showResetPasswordScreen();
    return;
  }

  await checkAuthStatus();
  setupAuthListeners();
});

async function checkAuthStatus() {
  console.log('Verificando auth status...');

  // Esperar supabase estar pronto
  let attempts = 0;
  while (!window.supabaseClient && attempts < 50) {
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }

  if (!window.supabaseClient) {
    console.error('Supabase não inicializou');
    showAuthScreen();
    return;
  }

  try {
    // Verificar localStorage primeiro
    const savedSession = localStorage.getItem('nutrirotina_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        console.log('✅ Sessão encontrada no localStorage');
        currentUser = sessionData.user;
        showApp();
        return;
      } catch (e) {
        console.warn('Sessão salva inválida:', e);
      }
    }

    // Depois verificar sessão do Supabase
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    console.log('Session do Supabase:', session);

    if (session && session.user) {
      currentUser = session.user;
      console.log('✅ Usuário já está logado:', session.user.email);
      showApp();
    } else {
      console.log('❌ Nenhuma sessão ativa');
      showAuthScreen();
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    showAuthScreen();
  }
}

function setupAuthListeners() {
  // Tabs de login/signup
  const tabs = document.querySelectorAll('.auth-tab');
  console.log('Tabs found:', tabs.length);

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = e.target.dataset.tab;
      console.log('Tab clicked:', tabName);

      // Remove active de todos
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      // Muda título do form
      if (tabName === 'login') {
        document.getElementById('auth-submit-btn').textContent = 'Entrar';
      } else {
        document.getElementById('auth-submit-btn').textContent = 'Criar Conta';
      }

      // Guarda na data do form
      document.getElementById('auth-form').dataset.mode = tabName;
    });
  });

  // Form de autenticação
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    console.log('Auth form found, attaching submit listener');
    authForm.addEventListener('submit', handleAuthSubmit);
  } else {
    console.error('Auth form NOT found!');
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const mode = document.querySelector('.auth-tab.active')?.dataset?.tab || 'login';
  const errorEl = document.getElementById('auth-error');

  errorEl.textContent = 'Processando...';
  console.log('Auth attempt:', { email, mode });

  try {
    let result;
    if (mode === 'signup') {
      console.log('Tentando signup...');
      result = await signUp(email, password);
    } else {
      console.log('Tentando signin...');
      result = await signIn(email, password);
    }

    console.log('Auth result:', result);

    if (result.success) {
      currentUser = result.user;

      // Salvar sessão no localStorage
      const { data: { session } } = await window.supabaseClient.auth.getSession();
      if (session) {
        localStorage.setItem('nutrirotina_session', JSON.stringify({
          user: session.user,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at
        }));
        console.log('✅ Sessão salva no localStorage');
      }

      document.getElementById('auth-form').reset();
      showApp();
    } else {
      errorEl.textContent = result.error || 'Erro ao autenticar';
      console.error('Auth error:', result.error);
    }
  } catch (error) {
    errorEl.textContent = 'Erro: ' + error.message;
    console.error('Auth exception:', error);
  }
}

function showAuthScreen() {
  const authScreen = document.getElementById('auth-screen');
  const appContainer = document.querySelector('.app-container');

  if (authScreen) {
    authScreen.classList.remove('hidden');
    authScreen.style.display = 'flex';
  }
  if (appContainer) {
    appContainer.style.display = 'none';
  }
}

function showApp() {
  const authScreen = document.getElementById('auth-screen');
  const appContainer = document.querySelector('.app-container');

  if (authScreen) {
    authScreen.style.display = 'none';
  }
  if (appContainer) {
    appContainer.style.display = 'flex';
  }
}

// Logout
async function logout() {
  try {
    await signOut();
    currentUser = null;
    localStorage.removeItem('nutrirotina_session');
    showAuthScreen();
    console.log('✅ Logout realizado');
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error);
  }
}

// Reset de Senha
function showResetPasswordScreen() {
  const authScreen = document.getElementById('auth-screen');
  const appContainer = document.querySelector('.app-container');

  if (authScreen) {
    authScreen.innerHTML = `
      <div class="auth-container">
        <div class="auth-header">
          <h1>🔑 Resetar Senha</h1>
          <p>Crie uma nova senha</p>
        </div>
        <form id="reset-password-form" class="auth-form">
          <input type="password" id="reset-password" placeholder="Nova senha (mín. 6 caracteres)" required />
          <input type="password" id="reset-password-confirm" placeholder="Confirmar senha" required />
          <button type="submit" class="submit-btn">Atualizar Senha</button>
          <p id="reset-error" class="auth-error"></p>
        </form>
      </div>
    `;
    authScreen.classList.remove('hidden');
    authScreen.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';

    document.getElementById('reset-password-form').addEventListener('submit', handleResetPassword);
  }
}

async function handleResetPassword(e) {
  e.preventDefault();

  const password = document.getElementById('reset-password').value;
  const passwordConfirm = document.getElementById('reset-password-confirm').value;
  const errorEl = document.getElementById('reset-error');

  if (password !== passwordConfirm) {
    errorEl.textContent = 'As senhas não conferem!';
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = 'Senha deve ter pelo menos 6 caracteres';
    return;
  }

  try {
    const { error } = await window.supabaseClient.auth.updateUser({ password });
    if (error) throw error;

    errorEl.textContent = '';
    errorEl.style.color = 'green';
    errorEl.textContent = 'Senha atualizada! Redirecionando...';

    setTimeout(() => {
      window.location.hash = '';
      window.location.reload();
    }, 2000);
  } catch (error) {
    errorEl.textContent = 'Erro: ' + error.message;
  }
}

// Ouvir mudanças de autenticação em tempo real
setTimeout(() => {
  if (window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth event:', event);
      if (event === 'SIGNED_IN') {
        currentUser = session.user;
        showApp();
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        showAuthScreen();
      }
    });
  }
}, 1000);
