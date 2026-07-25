// ===== TELA DE AUTENTICAÇÃO =====
class AuthUI {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  async init() {
    const user = await getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.showApp();
    } else {
      this.showAuthScreen();
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.currentUser = session.user;
        this.showApp();
      } else {
        this.currentUser = null;
        this.showAuthScreen();
      }
    });
  }

  showAuthScreen() {
    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.style.display = 'none';

    let authContainer = document.querySelector('.auth-container');
    if (!authContainer) {
      authContainer = document.createElement('div');
      authContainer.className = 'auth-container';
      document.body.insertBefore(authContainer, document.body.firstChild);
    }

    authContainer.style.display = 'flex';
    authContainer.innerHTML = `
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-emoji">📅</span>
          <h1>NutriRotina</h1>
          <p>Seu planejador de stories</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab active" onclick="authUI.switchTab('login')">Login</button>
          <button class="auth-tab" onclick="authUI.switchTab('signup')">Cadastro</button>
        </div>

        <div class="auth-panel active" id="loginPanel">
          <input type="email" id="loginEmail" placeholder="Seu e-mail" class="auth-input">
          <input type="password" id="loginPassword" placeholder="Sua senha" class="auth-input">
          <button class="auth-btn" onclick="authUI.handleLogin()">Entrar 🚀</button>
          <div id="loginError" class="auth-error"></div>
        </div>

        <div class="auth-panel" id="signupPanel">
          <input type="email" id="signupEmail" placeholder="Seu e-mail" class="auth-input">
          <input type="password" id="signupPassword" placeholder="Sua senha (min 6 caracteres)" class="auth-input">
          <input type="password" id="signupPassword2" placeholder="Confirme sua senha" class="auth-input">
          <button class="auth-btn" onclick="authUI.handleSignUp()">Criar Conta ✨</button>
          <div id="signupError" class="auth-error"></div>
        </div>
      </div>
    `;

    if (!document.querySelector('.auth-styles')) {
      const style = document.createElement('style');
      style.className = 'auth-styles';
      style.textContent = `
        .auth-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e88ba3 0%, #f5a3bb 100%);
          z-index: 10000;
        }
        .auth-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        .auth-header { text-align: center; margin-bottom: 30px; }
        .auth-emoji { font-size: 48px; display: block; margin-bottom: 10px; }
        .auth-header h1 { color: #e88ba3; margin: 0; font-size: 28px; }
        .auth-header p { color: #6b6b6b; margin: 5px 0 0 0; font-size: 14px; }
        .auth-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .auth-tab {
          flex: 1;
          padding: 12px;
          border: none;
          background: #f0f0f0;
          cursor: pointer;
          border-radius: 8px;
          font-weight: 600;
          color: #6b6b6b;
          transition: all 0.3s;
        }
        .auth-tab.active { background: #e88ba3; color: white; }
        .auth-panel { display: none; }
        .auth-panel.active { display: block; }
        .auth-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          box-sizing: border-box;
        }
        .auth-input:focus { outline: none; border-color: #e88ba3; }
        .auth-btn {
          width: 100%;
          padding: 14px;
          background: #e88ba3;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
        }
        .auth-btn:hover { background: #d67a92; }
        .auth-error {
          color: #f44336;
          font-size: 12px;
          margin-top: 10px;
          text-align: center;
        }
      `;
      document.head.appendChild(style);
    }
  }

  showApp() {
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) authContainer.style.display = 'none';

    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.style.display = 'flex';

    if (typeof window.nutriRotina === 'undefined' && typeof NutriRotina !== 'undefined') {
      window.nutriRotina = new NutriRotina();
    }
  }

  switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(`${tab}Panel`).classList.add('active');
  }

  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    if (!email || !password) {
      errorDiv.textContent = '❌ Preencha e-mail e senha';
      return;
    }

    errorDiv.textContent = '⏳ Entrando...';
    const result = await signIn(email, password);

    if (result.success) {
      errorDiv.textContent = '';
    } else {
      errorDiv.textContent = `❌ ${result.error}`;
    }
  }

  async handleSignUp() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const password2 = document.getElementById('signupPassword2').value;
    const errorDiv = document.getElementById('signupError');

    if (!email || !password || !password2) {
      errorDiv.textContent = '❌ Preencha todos os campos';
      return;
    }

    if (password !== password2) {
      errorDiv.textContent = '❌ As senhas não conferem';
      return;
    }

    if (password.length < 6) {
      errorDiv.textContent = '❌ Senha deve ter no mínimo 6 caracteres';
      return;
    }

    errorDiv.textContent = '⏳ Criando conta...';
    const result = await signUp(email, password);

    if (result.success) {
      errorDiv.textContent = '';
    } else {
      errorDiv.textContent = `❌ ${result.error}`;
    }
  }

  async logout() {
    const result = await signOut();
    this.currentUser = null;
    if (result.success) {
      window.location.reload();
    }
  }
}

let authUI;
document.addEventListener('DOMContentLoaded', () => {
  authUI = new AuthUI();
});
