// Configuração do Supabase - NutriRotina
const SUPABASE_URL = 'https://scdbnlrmkkljwutyrtrt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZGJubHJta2tsand1dHlydHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDMyNTAsImV4cCI6MjEwMTYxOTI1MH0.A5IylXMhbVYnB7FKVAbNzs-qkCi4w9sr4cQqEoWg9vs';

// Criar cliente Supabase (global)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase conectado:', SUPABASE_URL);

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
    const { error } = await supabase.auth.signOut();
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
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('❌ Erro ao verificar usuário:', error.message);
    return null;
  }
}

// ===== FUNÇÕES DE DATABASE =====

async function insertData(table, data) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não logado');

    const { data: result, error } = await supabase
      .from(table)
      .insert([{ ...data, user_id: user.id }])
      .select();

    if (error) throw error;
    console.log(`✅ Dados inseridos em ${table}`);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error(`❌ Erro ao inserir em ${table}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function readData(table, filters = {}) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não logado');

    let query = supabase.from(table).select('*').eq('user_id', user.id);

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) throw error;
    console.log(`✅ Dados lidos de ${table}:`, data.length);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Erro ao ler de ${table}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function updateData(table, id, data) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não logado');

    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    console.log(`✅ Dados atualizados em ${table}`);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error(`❌ Erro ao atualizar em ${table}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function deleteData(table, id) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não logado');

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    console.log(`✅ Dados deletados de ${table}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao deletar de ${table}:`, error.message);
    return { success: false, error: error.message };
  }
}
