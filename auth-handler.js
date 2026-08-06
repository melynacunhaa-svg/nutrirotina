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
  await checkAuthStatus();
  setupAuthListeners();
});

async function checkAuthStatus() {
  const user = await getCurrentUser();
  if (user) {
    currentUser = user;
    showApp();
  } else {
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
    showAuthScreen();
    console.log('✅ Logout realizado');
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error);
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
