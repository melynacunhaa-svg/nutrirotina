// Supabase Data Sync - sincroniza dados com o banco
// Deve ser carregado DEPOIS de supabase-init.js e auth-handler.js

window.SupabaseData = {
  async getCurrentUserId() {
    let attempts = 0;
    while (!currentUser && attempts < 50) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }
    return currentUser?.id;
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
            id: h.id,
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
    if (!userId) return;
    try {
      await window.supabaseClient
        .from('tasks')
        .delete()
        .eq('user_id', userId);

      if (tasks.length > 0) {
        const { error } = await window.supabaseClient
          .from('tasks')
          .insert(tasks.map(t => ({
            id: t.id,
            user_id: userId,
            title: t.title,
            description: t.description || '',
            category: t.category || '',
            priority: t.priority || 'média',
            status: t.status || 'pendente',
            date: t.date || null,
            time: t.time || ''
          })));
        if (error) throw error;
      }
      console.log('✅ Tarefas salvas no Supabase');
    } catch (error) {
      console.error('Erro ao salvar tasks:', error);
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
        const { error } = await window.supabaseClient
          .from('goals')
          .insert(goals.map(g => ({
            id: g.id,
            user_id: userId,
            name: g.name,
            description: g.description || '',
            start_date: g.start_date,
            end_date: g.end_date,
            progress: g.progress || 0,
            status: g.status || 'em andamento'
          })));
        if (error) throw error;
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
      const { error } = await window.supabaseClient
        .from('gamification')
        .upsert({
          user_id: userId,
          points: data.points || 0,
          history: data.history || []
        }, { onConflict: 'user_id' });
      if (error) throw error;
      console.log('✅ Gamification salva no Supabase');
    } catch (error) {
      console.error('Erro ao salvar gamification:', error);
    }
  }
};
