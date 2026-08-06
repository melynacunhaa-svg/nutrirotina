// Auth Handler - Gerencia login, cadastro e verificação de autenticação

let currentUser = null;

// Verificar se usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
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
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;

      // Remove active de todos
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      // Muda título do form
      const formTitle = document.querySelector('.modal-header h2') ||
                       document.querySelector('.auth-form');
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
    authForm.addEventListener('submit', handleAuthSubmit);
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const mode = document.querySelector('.auth-tab.active').dataset.tab || 'login';
  const errorEl = document.getElementById('auth-error');

  errorEl.textContent = '';

  try {
    let result;
    if (mode === 'signup') {
      result = await signUp(email, password);
    } else {
      result = await signIn(email, password);
    }

    if (result.success) {
      currentUser = result.user;
      document.getElementById('auth-form').reset();
      showApp();
    } else {
      errorEl.textContent = result.error || 'Erro ao autenticar';
    }
  } catch (error) {
    errorEl.textContent = 'Erro: ' + error.message;
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
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
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
