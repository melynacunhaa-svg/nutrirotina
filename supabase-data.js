// Supabase Data Sync - sincroniza dados com o banco
// Deve ser carregado DEPOIS de supabase-init.js e auth-handler.js

// Função auxiliar: gerar UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função auxiliar: verificar se é UUID válido
function isValidUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(String(id));
}

window.SupabaseData = {
  // Armazenar subscriptions para poder cancelar depois
  subscriptions: [],

  // Setup realtime sync - sincroniza automaticamente quando dados mudam
  setupRealtimeSync() {
    console.log('🔴 Configurando Realtime Sync...');
    const userId = currentUser?.id;
    if (!userId) {
      console.warn('Sem user logado, não pode setup realtime');
      return;
    }

    // Listen para mudanças em habits
    const habitsSubscription = window.supabaseClient
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'habits',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('🔄 Mudança em habits:', payload);
        // Recarregar habits
        this.loadHabits().then(habits => {
          if (typeof habitsManager !== 'undefined') {
            habitsManager.habits = habits.map(h => ({
              id: h.id,
              name: h.name,
              description: h.description,
              frequency: h.frequency,
              category: h.category,
              color: h.color,
              time: h.time,
              reminder: h.reminder,
              weeklyDays: h.weekly_days || [],
              monthlyDay: h.monthly_day,
              createdAt: h.created_at,
              history: {}
            }));
            if (typeof renderHabits === 'function') renderHabits();
            console.log('✅ Habits atualizados no UI');
          }
        });
      })
      .subscribe();

    // Listen para mudanças em goals
    const goalsSubscription = window.supabaseClient
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'goals',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('🔄 Mudança em goals:', payload);
        this.loadGoals().then(goals => {
          if (typeof goalsManager !== 'undefined') {
            goalsManager.goals = goals.map(g => ({
              id: g.id,
              name: g.name,
              description: g.description || '',
              startDate: g.start_date,
              endDate: g.end_date,
              progress: g.progress || 0,
              status: g.status || 'em andamento',
              createdAt: g.created_at,
              milestones: [],
              history: []
            }));
            if (typeof renderGoals === 'function') renderGoals();
            console.log('✅ Goals atualizados no UI');
          }
        });
      })
      .subscribe();

    // Listen para mudanças em tasks
    const tasksSubscription = window.supabaseClient
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('🔄 Mudança em tasks:', payload);
        this.loadTasks().then(tasks => {
          if (typeof tasksManager !== 'undefined') {
            tasksManager.tasks = tasks.map(t => ({
              id: t.id,
              title: t.title,
              description: t.description || '',
              category: t.category || '',
              priority: t.priority || 'média',
              status: t.status || 'pendente',
              date: t.date,
              time: t.time || '',
              createdAt: t.created_at
            }));
            if (typeof renderTasks === 'function') renderTasks();
            console.log('✅ Tasks atualizadas no UI');
          }
        });
      })
      .subscribe();

    console.log('✅ Realtime Sync ativado!');
    this.subscriptions = [habitsSubscription, goalsSubscription, tasksSubscription];
  },

  async getCurrentUserId() {
    let attempts = 0;
    while (!currentUser && attempts < 50) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }
    const userId = currentUser?.id;
    console.log('🔑 getUserId:', userId, 'currentUser:', currentUser);
    return userId;
  },

  // HABITS
  async loadHabits() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('habits')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar habits:', error);
      return [];
    }
  },

  async saveHabits(habits) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      // Limpar hábitos antigos do usuário
      await window.supabaseClient
        .from('habits')
        .delete()
        .eq('user_id', userId);

      // Inserir novos
      if (habits.length > 0) {
        const { error } = await window.supabaseClient
          .from('habits')
          .insert(habits.map(h => ({
            id: isValidUUID(h.id) ? h.id : generateUUID(), // Converter ID se necessário
            user_id: userId,
            name: h.name,
            description: h.description || '',
            frequency: h.frequency || 'diária',
            category: h.category || '',
            color: h.color || '#7ec8c8',
            time: h.time || '',
            reminder: h.reminder || false,
            weekly_days: h.weekly_days || [],
            monthly_day: h.monthly_day || null
          })));
        if (error) throw error;
      }
      console.log('✅ Hábitos salvos no Supabase');
    } catch (error) {
      console.error('Erro ao salvar habits:', error);
    }
  },

  // TASKS
  async loadTasks() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks) {
    const userId = await this.getCurrentUserId();
    console.log('💾 saveTasks - userId:', userId, 'tasks:', tasks.length);
    if (!userId) {
      console.error('❌ Sem userId, não pode salvar tasks');
      return;
    }
    try {
      console.log('🗑️ Deletando tasks antigas...');
      const delResult = await window.supabaseClient
        .from('tasks')
        .delete()
        .eq('user_id', userId);
      console.log('Delete result:', delResult);

      if (tasks.length > 0) {
        const tasksToInsert = tasks.map(t => ({
          id: isValidUUID(t.id) ? t.id : generateUUID(),
          user_id: userId,
          title: t.title,
          description: t.description || '',
          category: t.category || '',
          priority: t.priority || 'média',
          status: t.status || 'pendente',
          date: t.date || null,
          time: t.time || ''
        }));
        console.log('📤 Inserindo tasks:', tasksToInsert);
        const { data, error } = await window.supabaseClient
          .from('tasks')
          .insert(tasksToInsert);
        if (error) {
          console.error('❌ Erro ao inserir:', error);
          throw error;
        }
        console.log('✅ Tasks inseridas:', data);
      }
      console.log('✅ Tarefas salvas no Supabase');
    } catch (error) {
      console.error('❌ Erro ao salvar tasks:', error);
    }
  },

  // GOALS
  async loadGoals() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('goals')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar goals:', error);
      return [];
    }
  },

  async saveGoals(goals) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      await window.supabaseClient
        .from('goals')
        .delete()
        .eq('user_id', userId);

      if (goals.length > 0) {
        const goalsToInsert = goals.map(g => ({
          id: isValidUUID(g.id) ? g.id : generateUUID(),
          user_id: userId,
          name: g.name,
          description: g.description || '',
          start_date: g.startDate || g.start_date,
          end_date: g.endDate || g.end_date,
          progress: g.progress || 0,
          status: g.status || 'em andamento'
        }));
        console.log('📤 Goals a inserir:', goalsToInsert);
        const { data, error } = await window.supabaseClient
          .from('goals')
          .insert(goalsToInsert);
        if (error) {
          console.error('❌ Erro ao inserir goals:', error);
          throw error;
        }
        console.log('✅ Goals inseridas:', data);
      }
      console.log('✅ Metas salvas no Supabase');
    } catch (error) {
      console.error('Erro ao salvar goals:', error);
    }
  },

  // CLINIC APPOINTMENTS
  async loadClinicAppointments() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('clinic_appointments')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar clinic appointments:', error);
      return [];
    }
  },

  async saveClinicAppointments(appointments) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      await window.supabaseClient
        .from('clinic_appointments')
        .delete()
        .eq('user_id', userId);

      if (appointments.length > 0) {
        const { error } = await window.supabaseClient
          .from('clinic_appointments')
          .insert(appointments.map(a => ({
            id: a.id,
            user_id: userId,
            patient_name: a.patient_name,
            phone: a.phone || '',
            date: a.date,
            time: a.time,
            notes: a.notes || ''
          })));
        if (error) throw error;
      }
      console.log('✅ Consultório salvo no Supabase');
    } catch (error) {
      console.error('Erro ao salvar appointments:', error);
    }
  },

  // SCHEDULE
  async loadSchedule() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('schedule')
        .select('*')
        .eq('user_id', userId)
        .order('day_of_week');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar schedule:', error);
      return [];
    }
  },

  async saveSchedule(schedule) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      await window.supabaseClient
        .from('schedule')
        .delete()
        .eq('user_id', userId);

      if (schedule.length > 0) {
        const { error } = await window.supabaseClient
          .from('schedule')
          .insert(schedule.map(s => ({
            id: s.id,
            user_id: userId,
            day_of_week: s.day_of_week,
            items: s.items || []
          })));
        if (error) throw error;
      }
      console.log('✅ Agenda salva no Supabase');
    } catch (error) {
      console.error('Erro ao salvar schedule:', error);
    }
  },

  // STORIES
  async loadStories() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('stories')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar stories:', error);
      return [];
    }
  },

  async saveStories(stories) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      await window.supabaseClient
        .from('stories')
        .delete()
        .eq('user_id', userId);

      if (stories.length > 0) {
        const { error } = await window.supabaseClient
          .from('stories')
          .insert(stories.map(s => ({
            id: s.id,
            user_id: userId,
            title: s.title,
            category: s.category || '',
            platform: s.platform || '',
            opening: s.opening || '',
            transitions: s.transitions || '',
            closing: s.closing || '',
            status: s.status || 'rascunho'
          })));
        if (error) throw error;
      }
      console.log('✅ Stories salvas no Supabase');
    } catch (error) {
      console.error('Erro ao salvar stories:', error);
    }
  },

  // IDEAS
  async loadIdeas() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('ideas')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar ideas:', error);
      return [];
    }
  },

  async saveIdeas(ideas) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      await window.supabaseClient
        .from('ideas')
        .delete()
        .eq('user_id', userId);

      if (ideas.length > 0) {
        const { error } = await window.supabaseClient
          .from('ideas')
          .insert(ideas.map(i => ({
            id: i.id,
            user_id: userId,
            title: i.title,
            description: i.description || '',
            category: i.category || '',
            status: i.status || 'ideia'
          })));
        if (error) throw error;
      }
      console.log('✅ Ideias salvas no Supabase');
    } catch (error) {
      console.error('Erro ao salvar ideas:', error);
    }
  },

  // MOOD CHECKINS
  async loadMoodCheckins() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('mood_checkins')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar mood checkins:', error);
      return [];
    }
  },

  async saveMoodCheckins(checkins) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      // Não deleta tudo, apenas atualiza por data
      const checkinsArray = Array.isArray(checkins) ? checkins : Object.entries(checkins).map(([date, data]) => ({
        date,
        emoji: data.emoji || '',
        note: data.note || ''
      }));

      for (const c of checkinsArray) {
        const { error } = await window.supabaseClient
          .from('mood_checkins')
          .upsert({
            id: `${userId}-${c.date}`,
            user_id: userId,
            date: c.date,
            emoji: c.emoji || '',
            note: c.note || ''
          }, { onConflict: 'date,user_id' });
        if (error) throw error;
      }
      console.log('✅ Mood check-ins salvos no Supabase');
    } catch (error) {
      console.error('Erro ao salvar mood checkins:', error);
    }
  },

  // JOURNAL ENTRIES
  async loadJournalEntries() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];
    try {
      const { data, error } = await window.supabaseClient
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar journal entries:', error);
      return [];
    }
  },

  async saveJournalEntries(entries) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      await window.supabaseClient
        .from('journal_entries')
        .delete()
        .eq('user_id', userId);

      if (entries.length > 0) {
        const { error } = await window.supabaseClient
          .from('journal_entries')
          .insert(entries.map(e => ({
            id: e.id,
            user_id: userId,
            date: e.date,
            content: e.content
          })));
        if (error) throw error;
      }
      console.log('✅ Diário salvo no Supabase');
    } catch (error) {
      console.error('Erro ao salvar journal entries:', error);
    }
  },

  // GAMIFICATION
  async loadGamification() {
    const userId = await this.getCurrentUserId();
    if (!userId) return { points: 0, history: [] };
    try {
      const { data, error } = await window.supabaseClient
        .from('gamification')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ? { points: data.points || 0, history: data.history || [] } : { points: 0, history: [] };
    } catch (error) {
      console.error('Erro ao carregar gamification:', error);
      return { points: 0, history: [] };
    }
  },

  async saveGamification(data) {
    const userId = await this.getCurrentUserId();
    if (!userId) return;
    try {
      const gamifData = {
        user_id: userId,
        points: data.points || 0,
        history: data.history || []
      };
      console.log('📤 Gamification a inserir:', gamifData);
      const { data: insertedData, error } = await window.supabaseClient
        .from('gamification')
        .upsert(gamifData);
      if (error) {
        console.error('❌ Erro ao inserir gamification:', error);
        throw error;
      }
      console.log('✅ Gamification inserida:', insertedData);
    } catch (error) {
      console.error('Erro ao salvar gamification:', error);
    }
  },

  // MIGRAÇÃO: envia todos os dados do localStorage pro Supabase
  async migrateLocalDataToSupabase(managers) {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ Sem usuario logado, não pode migrar dados');
      return;
    }

    console.log('🚀 Iniciando migração de dados locais → Supabase');

    try {
      // Migra cada tipo de dado
      if (managers.habits?.habits?.length > 0) {
        console.log('📤 Migrando', managers.habits.habits.length, 'hábitos...');
        await this.saveHabits(managers.habits.habits);
      }

      if (managers.tasks?.tasks?.length > 0) {
        console.log('📤 Migrando', managers.tasks.tasks.length, 'tarefas...');
        await this.saveTasks(managers.tasks.tasks);
      }

      if (managers.goals?.goals?.length > 0) {
        console.log('📤 Migrando', managers.goals.goals.length, 'metas...');
        await this.saveGoals(managers.goals.goals);
      }

      if (managers.clinic?.appointments?.length > 0) {
        console.log('📤 Migrando', managers.clinic.appointments.length, 'consultas...');
        await this.saveClinicAppointments(managers.clinic.appointments);
      }

      if (managers.gamification?.data?.points > 0) {
        console.log('📤 Migrando gamificação...');
        await this.saveGamification(managers.gamification.data);
      }

      console.log('✅ Migração concluída! Dados sincronizados com Supabase');
      return true;
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      return false;
    }
  }
};
