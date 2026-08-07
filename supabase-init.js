// Inicializar Supabase (global, sem redeclaração)
window.SUPABASE_URL = 'https://scdbnlrmkkljwutyrtrt.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZGJubHJta2tsand1dHlydHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDMyNTAsImV4cCI6MjEwMTYxOTI1MH0.A5IylXMhbVYnB7FKVAbNzs-qkCi4w9sr4cQqEoWg9vs';

// Esperar supabase-js estar disponível, depois inicializar
window.addEventListener('load', () => {
  if (typeof window.supabase !== 'undefined' && !window.supabaseClient) {
    // Configurar para manter sessão persistida
    window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    });
    console.log('✅ Supabase inicializado com sessão persistida');
  }
});

// Funções de autenticação (globais)
async function signUp(email, password) {
  try {
    const { data, error } = await window.supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    console.log('✅ Conta criada:', email);
    return { success: true, user: data.user };
  } catch (error) {
    console.error('❌ Erro ao criar conta:', error.message);
    return { success: false, error: error.message };
  }
}

async function signIn(email, password) {
  try {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log('✅ Login realizado:', email);
    return { success: true, user: data.user };
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error.message);
    return { success: false, error: error.message };
  }
}

async function signOut() {
  try {
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) throw error;
    console.log('✅ Logout realizado');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error.message);
    return { success: false, error: error.message };
  }
}

async function getCurrentUser() {
  try {
    const { data: { user }, error } = await window.supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('❌ Erro ao verificar usuário:', error.message);
    return null;
  }
}
