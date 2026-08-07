// NutriRotina - Main App Logic

const GAMIFICATION_LEVEL_TITLES = [
    'Iniciante', 'Em Ritmo', 'Consistente', 'Disciplinada', 'Focada',
    'Determinada', 'Imparável', 'Mestra da Rotina', 'Referência', 'Lendária',
    'Inabalável', 'Lenda Viva'
];

// Data Management (localStorage) - Gamificação
class GamificationManager {
    constructor() {
        this.storageKey = 'nutrirotina_gamification';
        this.pointsPerAction = 10;
        this.pointsPerLevel = 100;
        this.data = this.loadData();
    }

    loadData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : { points: 0, history: [] };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getLevel() {
        return Math.floor(this.data.points / this.pointsPerLevel) + 1;
    }

    getLevelTitle(level) {
        const index = Math.min(level, GAMIFICATION_LEVEL_TITLES.length) - 1;
        return GAMIFICATION_LEVEL_TITLES[index];
    }

    addPoints(amount, origin) {
        this.data.points = Math.max(0, this.data.points + amount);
        this.data.history.push({
            date: new Date().toISOString(),
            amount,
            origin
        });
        this.saveData();
        renderGamificationBadge();
    }

    awardHabit(habitName) {
        this.addPoints(this.pointsPerAction, `Hábito concluído: ${habitName}`);
    }

    revokeHabit(habitName) {
        this.addPoints(-this.pointsPerAction, `Hábito desmarcado: ${habitName}`);
    }

    awardTask(taskTitle) {
        this.addPoints(this.pointsPerAction, `Tarefa concluída: ${taskTitle}`);
    }

    revokeTask(taskTitle) {
        this.addPoints(-this.pointsPerAction, `Tarefa desmarcada: ${taskTitle}`);
    }
}

const gamificationManager = new GamificationManager();

function renderGamificationBadge() {
    const pointsEl = document.getElementById('home-points');
    const levelEl = document.getElementById('home-level');
    if (pointsEl) pointsEl.textContent = gamificationManager.data.points;
    if (levelEl) levelEl.textContent = gamificationManager.getLevel();
    renderGamificationModal();
}

function renderGamificationModal() {
    const levelNumberEl = document.getElementById('gam-level-number');
    if (!levelNumberEl) return;

    const points = gamificationManager.data.points;
    const level = gamificationManager.getLevel();
    const pointsInLevel = points % gamificationManager.pointsPerLevel;
    const pointsToNext = gamificationManager.pointsPerLevel - pointsInLevel;

    levelNumberEl.textContent = level;
    document.getElementById('gam-level-text').textContent = level;
    document.getElementById('gam-level-title').textContent = gamificationManager.getLevelTitle(level);
    document.getElementById('gam-points-text').textContent = points;
    document.getElementById('gam-progress-fill').style.width = `${(pointsInLevel / gamificationManager.pointsPerLevel) * 100}%`;
    document.getElementById('gam-next-level-text').textContent = `Faltam ${pointsToNext} pontos pra virar ${gamificationManager.getLevelTitle(level + 1)} (Nível ${level + 1})`;

    const historyListEl = document.getElementById('gam-history-list');
    const history = [...gamificationManager.data.history].reverse();

    if (history.length === 0) {
        historyListEl.innerHTML = '<p class="gamification-history-empty">Ainda sem pontos. Marque um hábito ou tarefa como concluído pra começar!</p>';
        return;
    }

    historyListEl.innerHTML = history.map(entry => {
        const isPositive = entry.amount >= 0;
        const dateLabel = new Date(entry.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        return `
            <div class="gamification-history-item">
                <div>
                    <p class="gamification-history-origin">${entry.origin}</p>
                    <p class="gamification-history-date">${dateLabel}</p>
                </div>
                <span class="gamification-history-amount ${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${entry.amount}</span>
            </div>
        `;
    }).join('');
}

function openGamificationModal() {
    renderGamificationModal();
    document.getElementById('gamification-modal').classList.remove('hidden');
}

function closeGamificationModal() {
    document.getElementById('gamification-modal').classList.add('hidden');
}

// Data Management (localStorage)
class HabitsManager {
    constructor() {
        this.storageKey = 'nutrirotina_habits';
        this.habits = this.loadHabits();
    }

    loadHabits() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveHabits() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.habits));
    }

    addHabit(name, description, frequency, category, color, time = '', reminder = false, weeklyDays = [], monthlyDay = '') {
        const habit = {
            id: Date.now(),
            name,
            description,
            frequency,
            category,
            color,
            time, // HH:MM format
            reminder,
            weeklyDays, // Array de dias [0-6]
            monthlyDay, // 1-31
            createdAt: new Date().toISOString(),
            history: {} // {YYYY-MM-DD: true/false}
        };
        this.habits.push(habit);
        this.saveHabits();
        return habit;
    }

    toggleHabitDay(habitId, date) {
        const habit = this.habits.find(h => h.id === habitId);
        if (habit) {
            const dateStr = date.toISOString().split('T')[0];
            const wasDone = !!habit.history[dateStr];
            habit.history[dateStr] = !wasDone;
            this.saveHabits();
            if (wasDone) {
                gamificationManager.revokeHabit(habit.name);
            } else {
                gamificationManager.awardHabit(habit.name);
            }
        }
    }

    getHabitStreak(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            if (habit.history[dateStr]) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    getHabitHistory(habitId, days = 30) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return [];

        const history = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            history.push({
                date: dateStr,
                done: habit.history[dateStr] || false
            });
        }
        return history;
    }
}

const habitsManager = new HabitsManager();

// Data Management (localStorage) - Tarefas
class TasksManager {
    constructor() {
        this.storageKey = 'nutrirotina_tasks';
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveTasks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    addTask({ title, description = '', date = '', time = '', category = 'pessoal', priority = 'média' }) {
        const task = {
            id: Date.now(),
            title,
            description,
            date,
            time,
            category,
            priority,
            status: 'pendente',
            createdAt: new Date().toISOString()
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    updateStatus(taskId, status) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const wasCompleted = task.status === 'concluído';
            task.status = status;
            this.saveTasks();
            const isCompleted = status === 'concluído';
            if (isCompleted && !wasCompleted) {
                gamificationManager.awardTask(task.title);
            } else if (!isCompleted && wasCompleted) {
                gamificationManager.revokeTask(task.title);
            }
        }
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
    }
}

const tasksManager = new TasksManager();

// Data Management (localStorage) - Metas
class GoalsManager {
    constructor() {
        this.storageKey = 'nutrirotina_goals';
        this.goals = this.loadGoals();
    }

    loadGoals() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveGoals() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.goals));
    }

    addGoal(name, description, startDate, endDate) {
        const today = new Date().toISOString().split('T')[0];
        const goal = {
            id: Date.now(),
            name,
            description,
            startDate,
            endDate,
            progress: 0,
            history: [{ date: today, progress: 0 }],
            subtasks: []
        };
        this.goals.push(goal);
        this.saveGoals();
        return goal;
    }

    updateProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        this.setProgress(goal, progress);
        this.saveGoals();
    }

    setProgress(goal, progress) {
        goal.progress = progress;
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = goal.history.find(h => h.date === today);
        if (todayEntry) {
            todayEntry.progress = progress;
        } else {
            goal.history.push({ date: today, progress });
        }
    }

    addSubtask(goalId, text) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        const task = tasksManager.addTask({
            title: text,
            description: `Sub-meta de "${goal.name}"`
        });

        goal.subtasks = goal.subtasks || [];
        goal.subtasks.push({ id: Date.now(), text, done: false, taskId: task.id });

        this.recalcProgress(goal);
        this.saveGoals();
    }

    toggleSubtask(goalId, subtaskId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;
        const subtask = (goal.subtasks || []).find(s => s.id === subtaskId);
        if (!subtask) return;

        subtask.done = !subtask.done;
        tasksManager.updateStatus(subtask.taskId, subtask.done ? 'concluído' : 'pendente');

        this.recalcProgress(goal);
        this.saveGoals();
    }

    removeSubtask(goalId, subtaskId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;
        const subtask = (goal.subtasks || []).find(s => s.id === subtaskId);
        if (!subtask) return;

        goal.subtasks = goal.subtasks.filter(s => s.id !== subtaskId);
        tasksManager.removeTask(subtask.taskId);

        this.recalcProgress(goal);
        this.saveGoals();
    }

    recalcProgress(goal) {
        if (!goal.subtasks || goal.subtasks.length === 0) return;
        const doneCount = goal.subtasks.filter(s => s.done).length;
        const progress = Math.round((doneCount / goal.subtasks.length) * 100);
        this.setProgress(goal, progress);
    }

    getDaysRemaining(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return 0;

        const [year, month, day] = goal.endDate.split('-').map(Number);
        const end = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    }
}

const goalsManager = new GoalsManager();

// Data Management (localStorage) - Consultório
class ClinicManager {
    constructor() {
        this.storageKey = 'nutrirotina_clinic';
        this.appointments = this.loadAppointments();
    }

    loadAppointments() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveAppointments() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.appointments));
    }

    addAppointment({ patientName, phone = '', date, time, notes = '' }) {
        const appointment = {
            id: String(Date.now()),
            patientName,
            phone,
            date,
            time,
            notes,
            status: 'agendado',
            createdAt: new Date().toISOString()
        };
        this.appointments.push(appointment);
        this.saveAppointments();
        return appointment;
    }

    importAppointment({ id, patientName, phone = '', date, time, notes = '', status = 'agendado', createdAt }) {
        const appointment = {
            id: String(id),
            patientName,
            phone,
            date,
            time,
            notes,
            status,
            createdAt: createdAt || new Date().toISOString()
        };
        this.appointments.push(appointment);
        this.saveAppointments();
        return appointment;
    }

    updateStatus(id, status) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            appointment.status = status;
            this.saveAppointments();
        }
    }

    updateNotes(id, notes) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            appointment.notes = notes;
            this.saveAppointments();
        }
    }

    getSorted(filter = 'upcoming') {
        const now = new Date();
        let list = [...this.appointments];

        if (filter === 'upcoming') {
            list = list.filter(a => a.status === 'agendado' && new Date(`${a.date}T${a.time}`) >= now);
        }

        list.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
        return list;
    }

    getNextUpcomingId() {
        const upcoming = this.getSorted('upcoming');
        return upcoming.length > 0 ? upcoming[0].id : null;
    }
}

const clinicManager = new ClinicManager();
let clinicFilter = 'upcoming';

let taskFilters = { category: 'todas', priority: 'todas', onlyPending: false };
const TASK_CATEGORY_STYLES = {
    pessoal: { bg: 'rgba(232, 139, 163, 0.12)', color: '#e88ba3', label: 'Pessoal' },
    trabalho: { bg: 'rgba(126, 200, 200, 0.15)', color: '#4a9b9b', label: 'Trabalho' },
    'conteúdo': { bg: 'rgba(224, 168, 62, 0.18)', color: '#b3791f', label: 'Conteúdo' },
    treino: { bg: 'rgba(227, 83, 54, 0.15)', color: '#E35336', label: '🏋️ Treino' },
    estudos: { bg: 'rgba(135, 206, 235, 0.25)', color: '#3d7ea6', label: '📚 Estudos' },
    casa: { bg: 'rgba(101, 67, 33, 0.15)', color: '#654321', label: '🏠 Casa' },
    leitura: { bg: 'rgba(224, 176, 255, 0.25)', color: '#8e44ad', label: '📖 Leitura' },
    skincare: { bg: 'rgba(255, 20, 147, 0.12)', color: '#ff1493', label: '🧴 Skincare' }
};

// Plano de Rotina com IA — gera tarefas pra cada área da vida escolhida, lendo o estado real do app
// (mesmo espírito do gerador de sugestão de roteiro: baseado em regras, não numa API externa)
const ROUTINE_AREA_TEMPLATES = {
    treino: ['Treino de força', 'Caminhada ou cardio leve', 'Alongamento e mobilidade'],
    estudos: ['Sessão de estudo focada (25min)', 'Revisar o que aprendeu', 'Praticar um exercício do conteúdo'],
    casa: ['Organizar um cômodo da casa', 'Lista de compras e pendências', 'Faxina rápida de 15 minutos'],
    leitura: ['Ler algumas páginas', 'Continuar a leitura atual', 'Anotar uma reflexão da leitura'],
    skincare: ['Rotina de skincare da manhã', 'Rotina de skincare da noite', 'Um cuidado extra (máscara ou esfoliação)']
};
const ROUTINE_AREA_ICONS = { treino: '🏋️', estudos: '📚', casa: '🏠', leitura: '📖', skincare: '🧴' };
const ROUTINE_FREQUENCY_OFFSETS = { diária: [0, 1, 2, 3, 4, 5, 6], '3x': [0, 2, 4], '1x': [0] };

function generateRoutinePlan(areaConfigs) {
    const today = new Date();
    let created = 0;

    areaConfigs.forEach(({ area, frequency, focus }) => {
        const templates = ROUTINE_AREA_TEMPLATES[area];
        const icon = ROUTINE_AREA_ICONS[area];
        const offsets = ROUTINE_FREQUENCY_OFFSETS[frequency] || ROUTINE_FREQUENCY_OFFSETS['1x'];
        if (!templates) return;

        offsets.forEach((offset, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() + offset);
            const dateStr = date.toISOString().split('T')[0];

            tasksManager.addTask({
                title: `${icon} ${templates[i % templates.length]}`,
                description: focus ? `Foco: ${focus}` : '',
                date: dateStr,
                category: area,
                priority: 'média'
            });
            created++;
        });
    });

    return created;
}

// Data Management (localStorage) - Agenda/horários do dia (calendário da Home)
class ScheduleManager {
    constructor() {
        this.itemsKey = 'nutrirotina_schedule_items';
        this.checksKey = 'nutrirotina_schedule_checks';
        this.itemsByDay = this.loadItems();
        this.checks = this.loadChecks();
        this._counter = 0;
    }

    loadItems() {
        const data = localStorage.getItem(this.itemsKey);
        return data ? JSON.parse(data) : { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    }

    saveItems() {
        localStorage.setItem(this.itemsKey, JSON.stringify(this.itemsByDay));
    }

    loadChecks() {
        const data = localStorage.getItem(this.checksKey);
        return data ? JSON.parse(data) : {};
    }

    saveChecks() {
        localStorage.setItem(this.checksKey, JSON.stringify(this.checks));
    }

    generateId() {
        return `${Date.now()}_${this._counter++}`;
    }

    getItemsForDay(dayOfWeek) {
        return [...(this.itemsByDay[dayOfWeek] || [])].sort((a, b) => a.time.localeCompare(b.time));
    }

    setDayItems(dayOfWeek, items) {
        this.itemsByDay[dayOfWeek] = items;
        this.saveItems();
    }

    isChecked(dateStr, itemId) {
        return !!(this.checks[dateStr] && this.checks[dateStr][itemId]);
    }

    toggleCheck(dateStr, itemId) {
        if (!this.checks[dateStr]) this.checks[dateStr] = {};
        this.checks[dateStr][itemId] = !this.checks[dateStr][itemId];
        if (!this.checks[dateStr][itemId]) delete this.checks[dateStr][itemId];
        this.saveChecks();
    }
}

const scheduleManager = new ScheduleManager();
let weekOffset = 0;

const WEEKDAY_NAMES_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const WEEKDAY_NAMES_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

// Data Management (localStorage) - Roteiros de Stories
class StoriesManager {
    constructor() {
        this.storageKey = 'nutrirotina_stories';
        this.stories = this.loadStories();
    }

    loadStories() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveStories() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stories));
    }

    addStory({ title, category, platform, opening, transitions = '', closing = '' }) {
        const story = {
            id: Date.now(),
            title,
            category,
            platform,
            opening,
            transitions,
            closing,
            status: 'rascunho',
            createdAt: new Date().toISOString()
        };
        this.stories.push(story);
        this.saveStories();
        return story;
    }

    updateStatus(storyId, status) {
        const story = this.stories.find(s => s.id === storyId);
        if (story) {
            story.status = status;
            this.saveStories();
        }
    }
}

const storiesManager = new StoriesManager();
let activeStoryId = null;
let storyFilters = { category: 'todas', platform: 'todas' };
const STORY_CATEGORY_STYLES = {
    'Humanização': { bg: 'rgba(232, 139, 163, 0.12)', color: '#e88ba3' },
    'Engajamento': { bg: 'rgba(126, 200, 200, 0.15)', color: '#4a9b9b' },
    'Vendas': { bg: 'rgba(224, 168, 62, 0.18)', color: '#b3791f' }
};
const STORY_PLATFORM_STYLE = { bg: 'var(--cinza-claro)', color: 'var(--preto)' };
let currentSuggestion = null;

// Data Management (localStorage) - Banco de Ideias
class IdeasManager {
    constructor() {
        this.storageKey = 'nutrirotina_ideas';
        this.ideas = this.loadIdeas();
    }

    loadIdeas() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveIdeas() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.ideas));
    }

    addIdea({ title, description = '', category = 'Humanização' }) {
        const idea = {
            id: Date.now(),
            title,
            description,
            category,
            status: 'ideia',
            createdAt: new Date().toISOString()
        };
        this.ideas.push(idea);
        this.saveIdeas();
        return idea;
    }

    updateStatus(ideaId, status) {
        const idea = this.ideas.find(i => i.id === ideaId);
        if (idea) {
            idea.status = status;
            this.saveIdeas();
        }
    }
}

const ideasManager = new IdeasManager();
let activeIdeaId = null;
let ideaFilters = { category: 'todas', status: 'todas' };
const IDEA_STATUS_LABELS = { ideia: 'Ideia', rascunho: 'Rascunho', desenvolvimento: 'Em desenvolvimento' };

// Gera ideias de conteúdo da semana com base na rotina semanal (Editar semana), hábitos, tarefas,
// consultas e metas — e, se já existir, nas tendências pesquisadas pelo agendamento diário
// (data/tendencias-claude.json).
async function generateWeeklyIdeas() {
    const ideas = [];
    const todayStr = new Date().toISOString().split('T')[0];
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    const in7DaysStr = in7Days.toISOString().split('T')[0];

    // Rotina semanal fixa (botão "Editar semana" na Home)
    for (let day = 0; day < 7; day++) {
        const items = scheduleManager.getItemsForDay(day);
        if (items.length > 0) {
            ideas.push({
                title: `Bastidores da ${items[0].title}`,
                description: `Toda ${WEEKDAY_NAMES_FULL[day]} eu faço "${items[0].title}"${items[0].time ? ` às ${items[0].time}` : ''} — mostra como é esse momento de verdade, sem edição.`,
                category: 'Humanização'
            });
            break; // só um exemplo da rotina fixa por geração, pra não repetir ideia parecida toda hora
        }
    }

    // Hábito com maior sequência de dias seguidos
    const topHabit = habitsManager.habits
        .map(h => ({ name: h.name, streak: habitsManager.getHabitStreak(h.id) }))
        .filter(h => h.streak > 0)
        .sort((a, b) => b.streak - a.streak)[0];
    if (topHabit) {
        ideas.push({
            title: `${topHabit.streak} dias seguidos: ${topHabit.name}`,
            description: `Conta a história de como conseguiu manter "${topHabit.name}" por ${topHabit.streak} dias seguidos — o que mudou, o que quase te fez desistir.`,
            category: 'Humanização'
        });
    }

    // Tarefa de maior prioridade nos próximos 7 dias
    const priorityOrder = { alta: 0, média: 1, baixa: 2 };
    const topTask = tasksManager.tasks
        .filter(t => t.date && t.date >= todayStr && t.date <= in7DaysStr && t.status !== 'concluído')
        .sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1))[0];
    if (topTask) {
        ideas.push({
            title: 'Enquete: vocês também travam nisso?',
            description: `Essa semana preciso resolver "${topTask.title}" — pergunta pro público se elas também procrastinam com isso e compartilha sua estratégia.`,
            category: 'Engajamento'
        });
    }

    // Consultas marcadas nos próximos 7 dias
    const upcomingAppointments = clinicManager.appointments.filter(
        a => a.date >= todayStr && a.date <= in7DaysStr && a.status === 'agendado'
    );
    if (upcomingAppointments.length > 0) {
        ideas.push({
            title: 'Bastidores do consultório dessa semana',
            description: `Com ${upcomingAppointments.length} consulta${upcomingAppointments.length > 1 ? 's' : ''} marcada${upcomingAppointments.length > 1 ? 's' : ''} essa semana, mostra como é se preparar pros atendimentos e reforça que ainda tem vaga aberta na agenda.`,
            category: 'Vendas'
        });
    }

    // Meta em andamento com mais progresso
    const topGoal = goalsManager.goals.filter(g => g.progress < 100).sort((a, b) => b.progress - a.progress)[0];
    if (topGoal) {
        ideas.push({
            title: `Atualização da meta: ${topGoal.name}`,
            description: `Compartilha que já tá em ${topGoal.progress}% na meta "${topGoal.name}" — mostra o processo, não só o resultado final.`,
            category: 'Engajamento'
        });
    }

    // Tendências da semana, se o agendamento diário já tiver gerado o arquivo
    try {
        const response = await fetch('data/tendencias-claude.json');
        if (response.ok) {
            const trends = await response.json();
            trends.slice(0, 3).forEach(trend => {
                ideas.push({
                    title: trend.topic,
                    description: trend.description || '',
                    category: trend.suggestedCategory || 'Engajamento'
                });
            });
        }
    } catch (err) {
        // Arquivo de tendências ainda não existe (sem servidor local ou agendamento não configurado) — segue sem ele.
    }

    if (ideas.length === 0) {
        ideas.push({
            title: 'Um dia na vida de nutricionista',
            description: 'Sem rotina cadastrada ainda essa semana — que tal mostrar um pouco do seu dia a dia mesmo assim?',
            category: 'Humanização'
        });
    }

    ideas.forEach(idea => ideasManager.addIdea(idea));
    return ideas;
}

// Data Management (localStorage) - Humor/Check-in
class MoodManager {
    constructor() {
        this.storageKey = 'nutrirotina_mood';
        this.data = this.loadData(); // {YYYY-MM-DD: {emoji, note}}
    }

    loadData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    setMood(dateStr, emoji, note = '') {
        this.data[dateStr] = { emoji, note };
        this.saveData();
    }

    getMood(dateStr) {
        return this.data[dateStr] || null;
    }

    getWeek() {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = formatDateStr(date);
            days.push({
                date: dateStr,
                dayLabel: WEEKDAY_NAMES_SHORT[date.getDay()],
                isToday: i === 0,
                mood: this.getMood(dateStr)
            });
        }
        return days;
    }
}

const moodManager = new MoodManager();
const MOOD_OPTIONS = [
    { emoji: '😄', label: 'Ótimo' },
    { emoji: '🙂', label: 'Bem' },
    { emoji: '😐', label: 'Neutro' },
    { emoji: '😔', label: 'Mal' },
    { emoji: '😢', label: 'Péssimo' }
];
let selectedMoodEmoji = null;

// Data Management (localStorage) - Diário
class JournalManager {
    constructor() {
        this.storageKey = 'nutrirotina_journal';
        this.entries = this.loadEntries();
    }

    loadEntries() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveEntries() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
    }

    addEntry(date, text) {
        const entry = {
            id: Date.now(),
            date,
            text,
            createdAt: new Date().toISOString()
        };
        this.entries.push(entry);
        this.saveEntries();
        return entry;
    }

    removeEntry(entryId) {
        this.entries = this.entries.filter(e => e.id !== entryId);
        this.saveEntries();
    }

    search(query) {
        let list = [...this.entries];
        if (query) {
            const q = query.toLowerCase();
            list = list.filter(e => e.text.toLowerCase().includes(q));
        }
        list.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
        return list;
    }
}

const journalManager = new JournalManager();
let journalSearchQuery = '';

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// Junta hábitos, tarefas, consultas e metas de hoje pra alimentar a sugestão de roteiro.
function buildStorySuggestionContext() {
    const today = new Date().toISOString().split('T')[0];

    let habitHighlight = null;
    habitsManager.habits.forEach(habit => {
        const streak = habitsManager.getHabitStreak(habit.id);
        if (streak > 0 && (!habitHighlight || streak > habitHighlight.streak)) {
            habitHighlight = { name: habit.name, streak };
        }
    });

    const priorityOrder = { alta: 0, média: 1, baixa: 2 };
    const todayTasks = tasksManager.tasks
        .filter(t => t.date === today && t.status !== 'concluído')
        .sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1));

    const todayAppointments = clinicManager.appointments.filter(a => a.date === today && a.status === 'agendado');

    const activeGoals = goalsManager.goals
        .filter(g => g.progress < 100)
        .sort((a, b) => b.progress - a.progress);

    return {
        habitHighlight,
        taskHighlight: todayTasks[0] || null,
        todayAppointments,
        goalHighlight: activeGoals[0] || null
    };
}

// Gera um roteiro de sugestão com base na rotina real do dia (hábitos, tarefas, consultas, metas).
function generateStorySuggestion() {
    const ctx = buildStorySuggestionContext();
    const weekdayRaw = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
    const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);

    const openingOptions = [];
    if (ctx.habitHighlight) {
        openingOptions.push(`Hoje já são ${ctx.habitHighlight.streak} dias seguidos fazendo "${ctx.habitHighlight.name}" 🔥 Vem ver como é meu dia de verdade`);
    }
    if (ctx.todayAppointments.length > 0) {
        openingOptions.push(`Hoje é dia de consultório! Vou te mostrar um pouco dos bastidores do meu dia de atendimentos`);
    }
    openingOptions.push(`Bom dia! Vem comigo nesse(a) ${weekday} ver como tá sendo minha rotina hoje`);

    const middleOptions = [];
    if (ctx.todayAppointments.length > 0) {
        const first = ctx.todayAppointments[0];
        middleOptions.push(ctx.todayAppointments.length > 1
            ? `Hoje tenho ${ctx.todayAppointments.length} consultas marcadas — separando um tempinho antes de cada uma pra revisar as anotações do paciente`
            : `Hoje tenho consulta marcada às ${first.time} — separando um tempinho antes pra revisar as anotações do paciente`);
    }
    if (ctx.taskHighlight) {
        middleOptions.push(`Ainda tenho "${ctx.taskHighlight.title}" pra resolver hoje, então também vou aproveitar esse story pra me organizar em voz alta`);
    }
    if (ctx.goalHighlight) {
        middleOptions.push(`E seguindo minha meta "${ctx.goalHighlight.name}", já tô em ${ctx.goalHighlight.progress}% — só reforça que consistência funciona`);
    }
    if (middleOptions.length === 0) {
        middleOptions.push(`Hoje tá sendo um dia mais tranquilo, então vou aproveitar pra cuidar de mim e organizar a semana com calma`);
    }

    const closingOptions = [
        `Se você também tenta equilibrar rotina, consultório e conteúdo, salva esse story pra lembrar que dá pra fazer tudo com leveza 💛`,
        `Manda um 🙋‍♀️ nos comentários se você também tem dias assim!`,
        `Se identificou? Compartilha esse story com uma amiga nutri 💚`
    ];

    return {
        title: `Bastidores do meu dia — ${weekday}`,
        category: 'Humanização',
        platform: 'Instagram',
        opening: pickRandom(openingOptions),
        transitions: middleOptions.join(' '),
        closing: pickRandom(closingOptions)
    };
}

function renderStorySuggestion() {
    currentSuggestion = generateStorySuggestion();
    document.getElementById('story-suggestion-title').textContent = currentSuggestion.title;
    document.getElementById('story-suggestion-preview').textContent =
        `${currentSuggestion.opening}\n\n${currentSuggestion.transitions}\n\n${currentSuggestion.closing}`;
}

// Importa consultas que o Claude adicionou em data/consultas-claude.json.
// Cada consulta só é importada uma vez (controlado por nutrirotina_clinic_imported_ids),
// então editar o status/observações pelo app depois não é sobrescrito numa próxima sincronização.
async function syncClaudeAppointments() {
    const importedKey = 'nutrirotina_clinic_imported_ids';
    try {
        const response = await fetch('data/consultas-claude.json');
        if (!response.ok) return;

        const claudeAppointments = await response.json();
        const importedIds = JSON.parse(localStorage.getItem(importedKey) || '[]');
        let hasNew = false;

        claudeAppointments.forEach(appointment => {
            if (!importedIds.includes(String(appointment.id))) {
                clinicManager.importAppointment(appointment);
                importedIds.push(String(appointment.id));
                hasNew = true;
            }
        });

        if (hasNew) {
            localStorage.setItem(importedKey, JSON.stringify(importedIds));
        }
    } catch (err) {
        // App aberto sem servidor local (file://) ou arquivo ainda não existe — ignora.
    }
}

// Render Global Tracker (all habits together)
function renderGlobalTracker() {
    const trackerContent = document.getElementById('tracker-content');
    const globalTracker = document.getElementById('global-tracker');

    if (habitsManager.habits.length === 0) {
        globalTracker.style.display = 'none';
        return;
    }

    globalTracker.style.display = 'block';
    trackerContent.innerHTML = renderTrackerView('weekly');
}

function renderTrackerView(viewType) {
    const daysMap = {
        'weekly': 7,
        'monthly': 30,
        'yearly': 365
    };
    const days = daysMap[viewType];
    const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

    let html = `<div class="tracker-grid" data-view="${viewType}">`;

    habitsManager.habits.forEach(habit => {
        const history = habitsManager.getHabitHistory(habit.id, days);

        html += `<div class="tracker-habit-row">
            <div class="tracker-habit-name" style="background: ${habit.color}20; border-left: 4px solid ${habit.color};">
                <span>${habit.name}</span>
            </div>
            <div class="tracker-habit-circles">`;

        history.forEach(h => {
            const bg = h.done ? habit.color : '#f0f0f0';
            const borderWidth = viewType === 'weekly' ? '3px' : (viewType === 'monthly' ? '2px' : '1px');
            html += `<div class="tracker-circle" data-date="${h.date}" data-habit-id="${habit.id}"
                         style="background: ${bg}; border: ${borderWidth} solid ${habit.color}; cursor: pointer;"
                         title="${new Date(h.date).toLocaleDateString('pt-BR')}"></div>`;
        });

        html += `</div></div>`;
    });

    html += '</div>';
    return html;
}

// Notification System
function checkAndNotifyHabits() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();

    habitsManager.habits.forEach(habit => {
        if (!habit.reminder || !habit.time) return;

        // Check if it's time to notify
        if (habit.time !== currentTime) return;

        const shouldNotify = isHabitDueToday(habit, dayOfWeek, dayOfMonth);

        if (shouldNotify && 'Notification' in window && Notification.permission === 'granted') {
            const todayDone = habit.history[today] ? ' ✓' : '';
            new Notification(`${habit.name}${todayDone}`, {
                body: habit.description || 'Hora de fazer seu hábito!',
                icon: '🎯'
            });
        }
    });
}

// Check notifications every minute
setInterval(checkAndNotifyHabits, 60000);

// Render Habits
function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    habitsList.innerHTML = '';

    if (habitsManager.habits.length === 0) {
        habitsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 20px;">Nenhum hábito ainda. Adicione seu primeiro hábito!</p>';
        return;
    }

    habitsManager.habits.forEach(habit => {
        const streak = habitsManager.getHabitStreak(habit.id);
        const history = habitsManager.getHabitHistory(habit.id);
        const today = new Date().toISOString().split('T')[0];
        const todayDone = habit.history[today] || false;

        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card';
        habitCard.style.borderLeft = `4px solid ${habit.color}`;

        // Heatmap grid (30 dias)
        let heatmapHTML = '<div class="habit-heatmap"><div class="heatmap-grid">';
        history.forEach(h => {
            const cellClass = h.done ? 'heatmap-cell done' : 'heatmap-cell';
            heatmapHTML += `<div class="${cellClass}" data-date="${h.date}" data-habit-id="${habit.id}" title="${h.date}"></div>`;
        });
        heatmapHTML += '</div><p class="heatmap-label">Últimos 30 dias</p></div>';

        habitCard.innerHTML = `
            <div class="habit-card-header">
                <input type="checkbox" class="habit-checkbox" ${todayDone ? 'checked' : ''} data-habit-id="${habit.id}">
                <div class="habit-card-content">
                    <div class="habit-title">${habit.name}</div>
                    ${habit.description ? `<div class="habit-desc">${habit.description}</div>` : ''}
                    <div class="habit-meta">
                        <div class="category-badge" style="background: ${habit.category === 'profissional' ? 'rgba(0,0,0,0.08)' : 'rgba(232,139,163,0.1)'}; color: ${habit.category === 'profissional' ? '#2a2a2a' : '#e88ba3'};">
                            ${habit.category === 'profissional' ? '💼 Profissional' : '🏠 Pessoal'}
                        </div>
                        ${habit.time ? `<div class="habit-time-badge">⏰ ${habit.time}</div>` : ''}
                        ${habit.reminder ? `<div class="habit-reminder-badge">🔔 Notificação</div>` : ''}
                        <div class="streak-badge">
                            <span>🔥</span>
                            <span>${streak} dias</span>
                        </div>
                    </div>
                </div>
            </div>
            ${heatmapHTML}
        `;

        habitsList.appendChild(habitCard);
    });

    // Render global tracker
    renderGlobalTracker();

    // Event listeners
    document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const habitId = parseInt(e.target.dataset.habitId);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            habitsManager.toggleHabitDay(habitId, today);
            renderHabits();
            renderToday();
        });
    });

    document.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener('click', (e) => {
            const habitId = parseInt(e.target.dataset.habitId);
            const date = new Date(e.target.dataset.date);
            habitsManager.toggleHabitDay(habitId, date);
            renderHabits();
            renderToday();
        });
    });

    // Global tracker circle listeners
    document.querySelectorAll('#tracker-content .tracker-circle').forEach(circle => {
        circle.addEventListener('click', (e) => {
            const habitId = parseInt(e.currentTarget.dataset.habitId);
            const date = new Date(e.currentTarget.dataset.date);
            habitsManager.toggleHabitDay(habitId, date);
            renderHabits();
            renderToday();
        });
    });
}

// Render Goals
function buildSparkline(history) {
    const points = history.slice(-10);
    if (points.length < 2) return '<p class="sparkline-empty">Ainda sem histórico</p>';

    const w = 100, h = 30;
    const stepX = w / (points.length - 1);
    const coords = points.map((p, i) => {
        const x = i * stepX;
        const y = h - (p.progress / 100) * h;
        return `${x},${y}`;
    }).join(' ');

    return `<svg class="goal-sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <polyline points="${coords}" fill="none" stroke="#7ec8c8" stroke-width="2"/>
    </svg>`;
}

function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';

    if (goalsManager.goals.length === 0) {
        goalsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 20px;">Nenhuma meta ainda. Crie sua primeira meta!</p>';
        return;
    }

    goalsManager.goals.forEach(goal => {
        const daysRemaining = goalsManager.getDaysRemaining(goal.id);
        let daysLabel;
        if (daysRemaining > 0) daysLabel = `${daysRemaining} dias restantes`;
        else if (daysRemaining === 0) daysLabel = 'Último dia';
        else daysLabel = 'Prazo encerrado';

        const subtasks = goal.subtasks || [];
        const hasSubtasks = subtasks.length > 0;

        const subtasksHTML = subtasks.length > 0
            ? subtasks.map(st => `
                <div class="subtask-item">
                    <input type="checkbox" class="subtask-checkbox" ${st.done ? 'checked' : ''} data-goal-id="${goal.id}" data-subtask-id="${st.id}">
                    <span class="subtask-text ${st.done ? 'done' : ''}">${st.text}</span>
                    <button type="button" class="subtask-remove" data-goal-id="${goal.id}" data-subtask-id="${st.id}">&times;</button>
                </div>
            `).join('')
            : '<p class="subtasks-empty">Nenhuma sub-meta ainda.</p>';

        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';

        goalCard.innerHTML = `
            <div class="goal-card-header">
                <div class="goal-title">${goal.name}</div>
                ${goal.description ? `<div class="goal-desc">${goal.description}</div>` : ''}
            </div>
            <div class="goal-progress-bar">
                <div class="goal-progress-fill" style="width: ${goal.progress}%;"></div>
            </div>
            <div class="goal-meta">
                <span class="goal-percent">${goal.progress}%${hasSubtasks ? ' <small>(automático)</small>' : ''}</span>
                <span class="goal-days">${daysLabel}</span>
            </div>
            <div class="goal-subtasks">
                <p class="subtasks-label">O que fazer pra essa meta dar certo</p>
                <div class="subtasks-list">${subtasksHTML}</div>
                <form class="add-subtask-form" data-goal-id="${goal.id}">
                    <input type="text" class="add-subtask-input" placeholder="Ex: Tirar açúcar de casa" required>
                    <button type="submit" class="add-subtask-btn">+</button>
                </form>
            </div>
            <div class="goal-history">
                ${buildSparkline(goal.history)}
                <p class="heatmap-label">Evolução</p>
            </div>
            ${hasSubtasks ? '' : `<button class="update-progress-btn" data-goal-id="${goal.id}">Atualizar progresso</button>`}
        `;

        goalsList.appendChild(goalCard);
    });

    document.querySelectorAll('.update-progress-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const goalId = parseInt(e.target.dataset.goalId);
            openProgressModal(goalId);
        });
    });

    document.querySelectorAll('.subtask-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const goalId = parseInt(e.target.dataset.goalId);
            const subtaskId = parseInt(e.target.dataset.subtaskId);
            goalsManager.toggleSubtask(goalId, subtaskId);
            renderGoals();
        });
    });

    document.querySelectorAll('.subtask-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const goalId = parseInt(e.target.dataset.goalId);
            const subtaskId = parseInt(e.target.dataset.subtaskId);
            goalsManager.removeSubtask(goalId, subtaskId);
            renderGoals();
        });
    });

    document.querySelectorAll('.add-subtask-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const goalId = parseInt(form.dataset.goalId);
            const input = form.querySelector('.add-subtask-input');
            const text = input.value.trim();
            if (text) {
                goalsManager.addSubtask(goalId, text);
                renderGoals();
            }
        });
    });
}

// Render Clinic
function renderClinic() {
    const clinicList = document.getElementById('clinic-list');
    clinicList.innerHTML = '';

    const appointments = clinicManager.getSorted(clinicFilter);
    const nextId = clinicManager.getNextUpcomingId();

    if (appointments.length === 0) {
        const message = clinicFilter === 'upcoming'
            ? 'Nenhuma consulta agendada. Adicione sua próxima consulta!'
            : 'Nenhuma consulta ainda. Adicione a primeira!';
        clinicList.innerHTML = `<p class="clinic-empty">${message}</p>`;
        return;
    }

    appointments.forEach(appointment => {
        const [year, month, day] = appointment.date.split('-');
        const dateLabel = `${day}/${month}/${year}`;

        const card = document.createElement('div');
        card.className = 'clinic-card' + (appointment.id === nextId ? ' next-highlight' : '');

        card.innerHTML = `
            <div class="clinic-card-header">
                <div>
                    <div class="clinic-patient-name">${appointment.patientName}</div>
                    ${appointment.phone ? `<div class="clinic-phone">${appointment.phone}</div>` : ''}
                </div>
                <select class="status-select ${appointment.status}" data-id="${appointment.id}">
                    <option value="agendado" ${appointment.status === 'agendado' ? 'selected' : ''}>Agendado</option>
                    <option value="feito" ${appointment.status === 'feito' ? 'selected' : ''}>Feito</option>
                    <option value="cancelado" ${appointment.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </div>
            <div class="clinic-datetime">
                <span>📅 ${dateLabel}</span>
                <span>⏰ ${appointment.time}</span>
            </div>
            <textarea class="clinic-notes" data-id="${appointment.id}" placeholder="Observações sobre o paciente...">${appointment.notes}</textarea>
        `;

        clinicList.appendChild(card);
    });

    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            clinicManager.updateStatus(e.target.dataset.id, e.target.value);
            renderClinic();
            renderToday();
        });
    });

    document.querySelectorAll('.clinic-notes').forEach(textarea => {
        textarea.addEventListener('blur', (e) => {
            clinicManager.updateNotes(e.target.dataset.id, e.target.value);
        });
    });
}

// Render Tasks
function getFilteredTasks() {
    let list = [...tasksManager.tasks];

    if (taskFilters.category !== 'todas') {
        list = list.filter(t => t.category === taskFilters.category);
    }
    if (taskFilters.priority !== 'todas') {
        list = list.filter(t => t.priority === taskFilters.priority);
    }
    if (taskFilters.onlyPending) {
        list = list.filter(t => t.status === 'pendente');
    }

    const priorityOrder = { alta: 0, média: 1, baixa: 2 };
    list.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'pendente' ? -1 : 1;
        return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
    });
    return list;
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';

    const tasks = getFilteredTasks();

    if (tasks.length === 0) {
        const message = tasksManager.tasks.length === 0
            ? 'Nenhuma tarefa ainda. Adicione sua primeira tarefa!'
            : 'Nenhuma tarefa encontrada com esses filtros.';
        tasksList.innerHTML = `<p class="tasks-empty">${message}</p>`;
        return;
    }

    tasks.forEach(task => {
        const done = task.status === 'concluído';
        const categoryStyle = TASK_CATEGORY_STYLES[task.category] || TASK_CATEGORY_STYLES.pessoal;

        let dateTimeHTML = '';
        if (task.date) {
            const [year, month, day] = task.date.split('-');
            dateTimeHTML += `<span class="task-datetime">📅 ${day}/${month}/${year}</span>`;
        }
        if (task.time) {
            dateTimeHTML += `<span class="task-datetime">⏰ ${task.time}</span>`;
        }

        const card = document.createElement('div');
        card.className = 'task-card' + (done ? ' done' : '');

        card.innerHTML = `
            <div class="task-card-header">
                <input type="checkbox" class="task-checkbox" ${done ? 'checked' : ''} data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-title ${done ? 'done' : ''}">${task.title}</div>
                    ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
                    <div class="task-meta">
                        <span class="category-badge" style="background: ${categoryStyle.bg}; color: ${categoryStyle.color};">${categoryStyle.label}</span>
                        <span class="priority-badge ${task.priority}">${task.priority}</span>
                        ${dateTimeHTML}
                    </div>
                </div>
            </div>
        `;

        tasksList.appendChild(card);
    });

    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = parseInt(e.target.dataset.taskId);
            tasksManager.updateStatus(taskId, e.target.checked ? 'concluído' : 'pendente');
            renderTasks();
            renderToday();
        });
    });
}

// Render Stories
function getFilteredStories() {
    let list = [...storiesManager.stories];

    if (storyFilters.category !== 'todas') {
        list = list.filter(s => s.category === storyFilters.category);
    }
    if (storyFilters.platform !== 'todas') {
        list = list.filter(s => s.platform === storyFilters.platform);
    }

    return list;
}

function renderStories() {
    const storiesList = document.getElementById('stories-list');
    storiesList.innerHTML = '';

    const stories = getFilteredStories();

    if (stories.length === 0) {
        const message = storiesManager.stories.length === 0
            ? 'Nenhum roteiro ainda. Crie seu primeiro roteiro!'
            : 'Nenhum roteiro encontrado com esses filtros.';
        storiesList.innerHTML = `<p class="stories-empty">${message}</p>`;
        return;
    }

    stories.forEach(story => {
        const categoryStyle = STORY_CATEGORY_STYLES[story.category] || STORY_CATEGORY_STYLES['Humanização'];

        const card = document.createElement('div');
        card.className = 'story-card';
        card.dataset.storyId = story.id;

        card.innerHTML = `
            <div class="story-card-header">
                <div class="story-title">${story.title}</div>
                <span class="story-status-badge ${story.status}">${story.status}</span>
            </div>
            <div class="story-meta">
                <span class="category-badge" style="background: ${categoryStyle.bg}; color: ${categoryStyle.color};">${story.category}</span>
                <span class="category-badge" style="background: ${STORY_PLATFORM_STYLE.bg}; color: ${STORY_PLATFORM_STYLE.color};">${story.platform}</span>
            </div>
            <p class="story-preview">${story.opening}</p>
        `;

        card.addEventListener('click', () => openStoryViewModal(story.id));
        storiesList.appendChild(card);
    });
}

// Render Ideias
function getFilteredIdeas() {
    let list = [...ideasManager.ideas];

    if (ideaFilters.category !== 'todas') {
        list = list.filter(i => i.category === ideaFilters.category);
    }
    if (ideaFilters.status !== 'todas') {
        list = list.filter(i => i.status === ideaFilters.status);
    }

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function renderIdeas() {
    const ideasList = document.getElementById('ideas-list');
    ideasList.innerHTML = '';

    const ideas = getFilteredIdeas();

    if (ideas.length === 0) {
        const message = ideasManager.ideas.length === 0
            ? 'Nenhuma ideia ainda. Solta a primeira ideia aqui!'
            : 'Nenhuma ideia encontrada com esses filtros.';
        ideasList.innerHTML = `<p class="tasks-empty">${message}</p>`;
        return;
    }

    ideas.forEach(idea => {
        const categoryStyle = STORY_CATEGORY_STYLES[idea.category] || STORY_CATEGORY_STYLES['Humanização'];
        const [year, month, day] = idea.createdAt.split('T')[0].split('-');

        const card = document.createElement('div');
        card.className = 'idea-card';
        card.dataset.ideaId = idea.id;

        card.innerHTML = `
            <div class="story-card-header">
                <div class="story-title">${idea.title}</div>
                <span class="idea-status-badge ${idea.status}">${IDEA_STATUS_LABELS[idea.status] || idea.status}</span>
            </div>
            <div class="story-meta">
                <span class="category-badge" style="background: ${categoryStyle.bg}; color: ${categoryStyle.color};">${idea.category}</span>
                <span class="task-datetime">📅 ${day}/${month}/${year}</span>
            </div>
            ${idea.description ? `<p class="story-preview">${idea.description}</p>` : ''}
        `;

        card.addEventListener('click', () => openIdeaViewModal(idea.id));
        ideasList.appendChild(card);
    });
}

// Render Humor/Check-in
function renderMood() {
    const today = formatDateStr(new Date());
    const existing = moodManager.getMood(today);
    selectedMoodEmoji = existing ? existing.emoji : null;

    const emojiRow = document.getElementById('mood-emoji-row');
    if (emojiRow) {
        emojiRow.innerHTML = MOOD_OPTIONS.map(opt => `
            <button type="button" class="mood-emoji-btn ${opt.emoji === selectedMoodEmoji ? 'selected' : ''}" data-emoji="${opt.emoji}" title="${opt.label}">
                <span class="mood-emoji">${opt.emoji}</span>
                <span class="mood-emoji-label">${opt.label}</span>
            </button>
        `).join('');

        emojiRow.querySelectorAll('.mood-emoji-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedMoodEmoji = btn.dataset.emoji;
                emojiRow.querySelectorAll('.mood-emoji-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    }

    const noteInput = document.getElementById('mood-note');
    if (noteInput) noteInput.value = existing ? (existing.note || '') : '';

    renderMoodWeek();
}

function renderMoodWeek() {
    const weekRow = document.getElementById('mood-week-row');
    if (!weekRow) return;

    const week = moodManager.getWeek();
    weekRow.innerHTML = week.map(day => `
        <div class="mood-day-card ${day.isToday ? 'today' : ''}">
            <span class="mood-day-emoji">${day.mood ? day.mood.emoji : '—'}</span>
            <span class="mood-day-label">${day.dayLabel}</span>
        </div>
    `).join('');
}

// Render Diário
function renderJournalEntries() {
    const list = document.getElementById('journal-list');
    if (!list) return;

    const entries = journalManager.search(journalSearchQuery);
    list.innerHTML = '';

    if (entries.length === 0) {
        const message = journalManager.entries.length === 0
            ? 'Nenhuma entrada ainda. Escreva a primeira!'
            : 'Nenhuma entrada encontrada com essa busca.';
        list.innerHTML = `<p class="tasks-empty">${message}</p>`;
        return;
    }

    entries.forEach(entry => {
        const [year, month, day] = entry.date.split('-');

        const card = document.createElement('div');
        card.className = 'journal-entry-card';
        card.innerHTML = `
            <div class="journal-entry-header">
                <span class="task-datetime">📅 ${day}/${month}/${year}</span>
                <button type="button" class="journal-entry-delete" data-entry-id="${entry.id}">&times;</button>
            </div>
            <p class="journal-entry-text">${entry.text}</p>
        `;
        list.appendChild(card);
    });

    list.querySelectorAll('.journal-entry-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const entryId = parseInt(e.target.dataset.entryId);
            journalManager.removeEntry(entryId);
            renderJournalEntries();
        });
    });
}

// Render Home "Hoje"
function isHabitDueToday(habit, dayOfWeek, dayOfMonth) {
    if (habit.frequency === 'weekly') return (habit.weeklyDays || []).includes(dayOfWeek);
    if (habit.frequency === 'monthly') return String(habit.monthlyDay) === String(dayOfMonth);
    return true; // diário (ou frequência não reconhecida)
}

function renderToday() {
    const container = document.getElementById('today-items');
    if (!container) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();

    const todaySchedule = scheduleManager.getItemsForDay(dayOfWeek);
    const todayHabits = habitsManager.habits.filter(h => isHabitDueToday(h, dayOfWeek, dayOfMonth));
    const todayTasks = tasksManager.tasks.filter(t => t.date === todayStr || (!t.date && t.status === 'pendente'));
    const todayAppointments = clinicManager.appointments
        .filter(a => a.date === todayStr && a.status !== 'cancelado')
        .sort((a, b) => a.time.localeCompare(b.time));

    container.innerHTML = '';

    if (todaySchedule.length === 0 && todayHabits.length === 0 && todayTasks.length === 0 && todayAppointments.length === 0) {
        container.innerHTML = '<p class="today-empty">Nada por aqui ainda. Toque em "+ Adicionar uma ação" pra começar seu dia.</p>';
    } else {
        todaySchedule.forEach(item => {
            const checked = scheduleManager.isChecked(todayStr, item.id);
            const row = document.createElement('div');
            row.className = 'schedule-item';
            row.innerHTML = `
                <input type="checkbox" class="schedule-check" data-item-id="${item.id}" ${checked ? 'checked' : ''}>
                <span class="schedule-time">${item.time || '--:--'}</span>
                <p class="schedule-title">${item.title}</p>
            `;
            container.appendChild(row);
        });

        todayHabits.forEach(habit => {
            const done = !!habit.history[todayStr];
            const streak = habitsManager.getHabitStreak(habit.id);
            const item = document.createElement('div');
            item.className = 'habit-item';
            item.innerHTML = `
                <input type="checkbox" class="habit-check" data-habit-id="${habit.id}" ${done ? 'checked' : ''}>
                <div class="habit-info">
                    <span class="habit-tag">HÁBITO</span>
                    ${streak > 0 ? `<span class="habit-streak">🔥 ${streak} dia${streak > 1 ? 's' : ''}</span>` : ''}
                    ${habit.time ? `<span class="habit-time">⏰ ${habit.time}</span>` : ''}
                </div>
                <p class="habit-name">${habit.name}</p>
            `;
            container.appendChild(item);
        });

        todayTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = 'task-item';
            item.innerHTML = `
                <input type="checkbox" class="task-check" data-task-id="${task.id}" ${task.status === 'concluído' ? 'checked' : ''}>
                <p class="task-name">${task.title}${task.time ? ` <span class="habit-time">⏰ ${task.time}</span>` : ''}</p>
            `;
            container.appendChild(item);
        });

        todayAppointments.forEach(appointment => {
            const item = document.createElement('div');
            item.className = 'clinic-item';
            item.innerHTML = `
                <svg class="clinic-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <div>
                    <p class="clinic-name">Consulta - ${appointment.patientName}</p>
                    <p class="clinic-time">${appointment.time}</p>
                </div>
            `;
            container.appendChild(item);
        });
    }

    container.querySelectorAll('.schedule-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            scheduleManager.toggleCheck(todayStr, e.target.dataset.itemId);
        });
    });

    container.querySelectorAll('.habit-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const habitId = parseInt(e.target.dataset.habitId);
            habitsManager.toggleHabitDay(habitId, new Date());
            renderToday();
        });
    });

    container.querySelectorAll('.task-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = parseInt(e.target.dataset.taskId);
            tasksManager.updateStatus(taskId, e.target.checked ? 'concluído' : 'pendente');
            renderToday();
        });
    });

    const streakIndicator = document.getElementById('streak-indicator');
    const streakText = document.getElementById('streak-text');
    if (streakIndicator && streakText) {
        const maxStreak = habitsManager.habits.reduce((max, h) => Math.max(max, habitsManager.getHabitStreak(h.id)), 0);
        if (maxStreak > 0) {
            streakIndicator.style.display = '';
            streakText.textContent = `${maxStreak} dia${maxStreak > 1 ? 's' : ''} seguido${maxStreak > 1 ? 's' : ''}`;
        } else {
            streakIndicator.style.display = 'none';
        }
    }
}

function formatDateStr(d) {
    return d.toISOString().split('T')[0];
}

// Render calendário semanal da Home (dias reais, navega por semana, só mostra a semana — hoje em destaque)
function renderCalendarWeek() {
    const container = document.getElementById('calendar-display');
    if (!container) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const base = new Date(today);
    base.setDate(base.getDate() + weekOffset * 7 - base.getDay());

    container.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const isToday = formatDateStr(d) === formatDateStr(today);

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day' + (isToday ? ' active' : '');
        dayEl.innerHTML = `
            <span class="day-name">${WEEKDAY_NAMES_SHORT[d.getDay()]}</span>
            <span class="day-num">${d.getDate()}</span>
        `;
        container.appendChild(dayEl);
    }
}

// Editor da semana inteira: um grupo por dia (Seg a Dom), todos editáveis ao mesmo tempo
const SCHEDULE_EDIT_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function buildScheduleEditRow(item) {
    const row = document.createElement('div');
    row.className = 'schedule-edit-row';
    row.dataset.itemId = item.id;
    row.innerHTML = `
        <input type="time" class="schedule-edit-time" value="${item.time || ''}">
        <input type="text" class="schedule-edit-title" value="${item.title || ''}" placeholder="Ex: Tomar café da manhã">
        <button type="button" class="remove-schedule-item-btn">&times;</button>
    `;
    row.querySelector('.remove-schedule-item-btn').addEventListener('click', () => row.remove());
    return row;
}

function buildScheduleDayGroup(dayOfWeek) {
    const group = document.createElement('div');
    group.className = 'schedule-edit-day-group';
    group.dataset.dayOfWeek = dayOfWeek;
    group.innerHTML = `
        <h3 class="schedule-edit-day-title">${WEEKDAY_NAMES_FULL[dayOfWeek]}</h3>
        <div class="schedule-edit-list"></div>
        <button type="button" class="add-schedule-item-btn">+ Adicionar horário</button>
    `;

    const list = group.querySelector('.schedule-edit-list');
    scheduleManager.getItemsForDay(dayOfWeek).forEach(item => list.appendChild(buildScheduleEditRow(item)));

    group.querySelector('.add-schedule-item-btn').addEventListener('click', () => {
        list.appendChild(buildScheduleEditRow({ id: scheduleManager.generateId(), time: '', title: '' }));
    });

    return group;
}

function openScheduleEditModal() {
    const container = document.getElementById('schedule-edit-days');
    container.innerHTML = '';
    SCHEDULE_EDIT_DAY_ORDER.forEach(dayOfWeek => container.appendChild(buildScheduleDayGroup(dayOfWeek)));

    document.getElementById('schedule-edit-modal').classList.remove('hidden');
}

function closeScheduleEditModal() {
    document.getElementById('schedule-edit-modal').classList.add('hidden');
}

function saveScheduleWeek() {
    document.querySelectorAll('#schedule-edit-days .schedule-edit-day-group').forEach(group => {
        const dayOfWeek = parseInt(group.dataset.dayOfWeek);
        const rows = group.querySelectorAll('.schedule-edit-row');
        const items = Array.from(rows)
            .map(row => ({
                id: row.dataset.itemId,
                time: row.querySelector('.schedule-edit-time').value,
                title: row.querySelector('.schedule-edit-title').value.trim()
            }))
            .filter(item => item.title !== '');

        scheduleManager.setDayItems(dayOfWeek, items);
    });

    renderToday();
    closeScheduleEditModal();
}

// Modal Management
function openActionChoiceModal() {
    document.getElementById('action-choice-modal').classList.remove('hidden');
}

function closeActionChoiceModal() {
    document.getElementById('action-choice-modal').classList.add('hidden');
}

function openHabitModal() {
    document.getElementById('habit-modal').classList.remove('hidden');
}

function closeHabitModal() {
    document.getElementById('habit-modal').classList.add('hidden');
    document.getElementById('habit-form').reset();
    document.getElementById('habit-color').value = '#E0B0FF';
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('[data-color="#E0B0FF"]').classList.add('selected');
}

function openGoalModal() {
    document.getElementById('goal-modal').classList.remove('hidden');
}

function closeGoalModal() {
    document.getElementById('goal-modal').classList.add('hidden');
    document.getElementById('goal-form').reset();
}

function openClinicModal() {
    document.getElementById('clinic-modal').classList.remove('hidden');
}

function closeClinicModal() {
    document.getElementById('clinic-modal').classList.add('hidden');
    document.getElementById('clinic-form').reset();
}

function openTaskModal() {
    document.getElementById('task-modal').classList.remove('hidden');
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.add('hidden');
    document.getElementById('task-form').reset();
}

function openStoryModal() {
    document.getElementById('story-modal').classList.remove('hidden');
}

function closeStoryModal() {
    document.getElementById('story-modal').classList.add('hidden');
    document.getElementById('story-form').reset();
}

function openRoutinePlanModal() {
    document.getElementById('routine-plan-modal').classList.remove('hidden');
}

function closeRoutinePlanModal() {
    document.getElementById('routine-plan-modal').classList.add('hidden');
    document.getElementById('routine-plan-form').reset();
    document.getElementById('routine-plan-confirmation').classList.add('hidden');
    document.querySelectorAll('.routine-area-row').forEach(row => {
        row.querySelector('.routine-area-frequency').disabled = true;
        row.querySelector('.routine-area-focus').disabled = true;
    });
}

function openStoryViewModal(storyId) {
    const story = storiesManager.stories.find(s => s.id === storyId);
    if (!story) return;

    activeStoryId = storyId;
    const categoryStyle = STORY_CATEGORY_STYLES[story.category] || STORY_CATEGORY_STYLES['Humanização'];

    document.getElementById('story-view-title').textContent = story.title;
    const categoryBadge = document.getElementById('story-view-category');
    categoryBadge.textContent = story.category;
    categoryBadge.style.background = categoryStyle.bg;
    categoryBadge.style.color = categoryStyle.color;
    const platformBadge = document.getElementById('story-view-platform');
    platformBadge.textContent = story.platform;
    platformBadge.style.background = STORY_PLATFORM_STYLE.bg;
    platformBadge.style.color = STORY_PLATFORM_STYLE.color;
    document.getElementById('story-view-status').value = story.status;
    document.getElementById('story-view-opening').textContent = story.opening;
    document.getElementById('story-view-transitions').textContent = story.transitions || '(sem transições)';
    document.getElementById('story-view-closing').textContent = story.closing || '(sem encerramento)';

    document.getElementById('story-view-modal').classList.remove('hidden');
}

function closeStoryViewModal() {
    document.getElementById('story-view-modal').classList.add('hidden');
    activeStoryId = null;
}

function openIdeaModal() {
    document.getElementById('idea-modal').classList.remove('hidden');
}

function closeIdeaModal() {
    document.getElementById('idea-modal').classList.add('hidden');
    document.getElementById('idea-form').reset();
}

function openIdeaViewModal(ideaId) {
    const idea = ideasManager.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    activeIdeaId = ideaId;
    const categoryStyle = STORY_CATEGORY_STYLES[idea.category] || STORY_CATEGORY_STYLES['Humanização'];
    const [year, month, day] = idea.createdAt.split('T')[0].split('-');

    document.getElementById('idea-view-title').textContent = idea.title;
    const categoryBadge = document.getElementById('idea-view-category');
    categoryBadge.textContent = idea.category;
    categoryBadge.style.background = categoryStyle.bg;
    categoryBadge.style.color = categoryStyle.color;
    document.getElementById('idea-view-date').textContent = `📅 ${day}/${month}/${year}`;
    document.getElementById('idea-view-status').value = idea.status;
    document.getElementById('idea-view-description').textContent = idea.description || '(sem descrição)';

    document.getElementById('idea-view-modal').classList.remove('hidden');
}

function closeIdeaViewModal() {
    document.getElementById('idea-view-modal').classList.add('hidden');
    activeIdeaId = null;
}

function convertIdeaToTask(ideaId) {
    const idea = ideasManager.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    tasksManager.addTask({ title: idea.title, description: idea.description, category: 'conteúdo' });
    ideasManager.updateStatus(ideaId, 'desenvolvimento');
    renderIdeas();
    closeIdeaViewModal();
}

function convertIdeaToStory(ideaId) {
    const idea = ideasManager.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    storiesManager.addStory({
        title: idea.title,
        category: idea.category,
        platform: 'Instagram',
        opening: idea.description || idea.title
    });
    ideasManager.updateStatus(ideaId, 'desenvolvimento');
    renderIdeas();
    closeIdeaViewModal();
}

let activeGoalId = null;

function openProgressModal(goalId) {
    activeGoalId = goalId;
    const goal = goalsManager.goals.find(g => g.id === goalId);
    if (!goal) return;

    const slider = document.getElementById('progress-slider');
    slider.value = goal.progress;
    document.getElementById('progress-value-label').textContent = goal.progress;
    document.getElementById('progress-modal').classList.remove('hidden');
}

function closeProgressModal() {
    document.getElementById('progress-modal').classList.add('hidden');
    activeGoalId = null;
}

// Science Studies & Weekly Scripts (Fases 6-7)
let scienceStudies = [];
let selectedGanchoCategory = null;
let selectedGanchoWeekday = null;
let roteirosCompletos = [];
let roteiroDia = null;

async function loadRoteirosCompletos() {
    try {
        const response = await fetch('data/roteiros-completos-claude.json');
        if (!response.ok) return;
        const data = await response.json();
        roteirosCompletos = data.roteiros || [];

        // Detecta qual é o dia de hoje e carrega o roteiro correspondente
        const hoje = new Date();
        const diaAtual = hoje.getDay(); // 0=domingo, 1=segunda, etc.
        roteiroDia = roteirosCompletos.find(r => r.weekday === diaAtual);
        console.log(`[Roteiros] Loaded ${roteirosCompletos.length} roteiros. Today is ${diaAtual}, found: ${roteiroDia ? roteiroDia.dia : 'NONE'}`);
    } catch (err) {
        console.log('[Roteiros] Error loading:', err);
    }
}

async function loadScienceStudies() {
    try {
        const response = await fetch('data/estudos-claude.json');
        if (!response.ok) return;
        scienceStudies = await response.json();
    } catch (err) {
        // Arquivo ainda não existe — segue sem ele
    }
}

function renderScienceTab() {
    const container = document.getElementById('science-list');
    if (!container) return;

    if (scienceStudies.length === 0) {
        container.innerHTML = '<div class="science-empty">Ainda sem estudos gerados hoje — o assistente de conteúdo roda toda manhã.</div>';
        return;
    }

    container.innerHTML = scienceStudies.map(study => `
        <div class="science-card" onclick="openScienceViewModal(${scienceStudies.indexOf(study)})">
            <div class="science-card-title">${study.title || study.topic}</div>
            <div class="science-card-meta">
                <span>${study.journal}</span>
                <span>${study.publishedDate}</span>
            </div>
            <div class="science-badges">
                <span class="evidence-badge nivel-${study.evidenceLevel ? study.evidenceLevel.toLowerCase() : 'a'}">
                    ${study.evidenceLevel || 'A'} - ${study.evidenceType || 'Evidência'}
                </span>
                <span class="viral-badge ${study.viralScore ? study.viralScore.toLowerCase() : 'alto'}">
                    Viral: ${study.viralScore || 'ALTO'}
                </span>
            </div>
            <div class="science-card-preview">${study.resumo || ''}</div>
        </div>
    `).join('');
}

let activeScienceIndex = null;

function openScienceViewModal(index) {
    activeScienceIndex = index;
    const study = scienceStudies[index];
    if (!study) return;

    const modal = document.getElementById('science-view-modal');
    if (!modal) return;

    document.getElementById('science-view-title').textContent = study.title || study.topic;
    document.getElementById('science-view-evidence').textContent = `${study.evidenceLevel || 'A'} - ${study.evidenceType || ''}`;
    document.getElementById('science-view-evidence').className = `evidence-badge nivel-${study.evidenceLevel ? study.evidenceLevel.toLowerCase() : 'a'}`;
    document.getElementById('science-view-viral').textContent = `Viral: ${study.viralScore || 'ALTO'}`;
    document.getElementById('science-view-viral').className = `viral-badge ${study.viralScore ? study.viralScore.toLowerCase() : 'alto'}`;
    document.getElementById('science-view-journal').textContent = study.journal || '';
    document.getElementById('science-view-date').textContent = study.publishedDate || '';
    document.getElementById('science-view-type').textContent = study.evidenceType || '';
    document.getElementById('science-view-resumo').textContent = study.resumo || '';

    const resultadosList = document.getElementById('science-view-resultados');
    resultadosList.innerHTML = (study.resultadosPraticos || []).map(r => `<li>${r}</li>`).join('');

    document.getElementById('science-view-impacto').textContent = study.impactoClinico || '';
    document.getElementById('science-view-consulta').textContent = study.comoUsarConsulta || '';
    document.getElementById('science-view-limitacoes').textContent = study.limitacoes || '';
    document.getElementById('science-view-hook').textContent = study.reelHook || '';
    document.getElementById('science-view-story').textContent = study.storyIdea || '';
    document.getElementById('science-view-cta').textContent = study.cta || '';

    const pubmedLink = document.getElementById('science-view-pubmed');
    if (study.pubmedUrl) {
        pubmedLink.href = study.pubmedUrl;
        pubmedLink.style.display = 'inline-flex';
    } else {
        pubmedLink.style.display = 'none';
    }

    const doiLink = document.getElementById('science-view-doi');
    if (study.doiUrl) {
        doiLink.href = study.doiUrl;
        doiLink.style.display = 'inline-flex';
    } else {
        doiLink.style.display = 'none';
    }

    modal.classList.remove('hidden');
}

function closeScienceViewModal() {
    document.getElementById('science-view-modal').classList.add('hidden');
    activeScienceIndex = null;
}

function updateConfirmButtonState() {
    const confirmBtn = document.getElementById('confirm-use-gancho-btn');
    confirmBtn.disabled = selectedGanchoCategory === null || selectedGanchoWeekday === null;
}

function openUseGanchoModal() {
    selectedGanchoCategory = null;
    selectedGanchoWeekday = null;

    // Reset button states
    document.querySelectorAll('.category-choice-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.weekday-choice-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('confirm-use-gancho-btn').disabled = true;

    document.getElementById('use-science-gancho-modal').classList.remove('hidden');
}

function closeUseGanchoModal() {
    document.getElementById('use-science-gancho-modal').classList.add('hidden');
    selectedGanchoCategory = null;
    selectedGanchoWeekday = null;
}

function confirmUseGancho() {
    if (!selectedGanchoCategory || selectedGanchoWeekday === null) return;

    if (activeScienceIndex === null) return;
    const study = scienceStudies[activeScienceIndex];

    // Criar story com categoria e dia escolhidos
    const storyData = {
        title: study.title || study.topic,
        category: selectedGanchoCategory,
        platform: 'Instagram',
        opening: study.reelHook || '',
        transitions: study.storyIdea || '',
        closing: study.cta || ''
    };

    storiesManager.addStory(storyData);

    // Fechar modals
    closeUseGanchoModal();
    closeScienceViewModal();

    // Mostrar feedback
    const dayName = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][selectedGanchoWeekday];
    const feedbackEl = document.createElement('div');
    feedbackEl.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #4caf50; color: white; padding: 12px 20px; border-radius: 8px; z-index: 2000; font-size: 14px; font-weight: 600;';
    feedbackEl.textContent = `✓ Adicionado ao roteiro de ${dayName}`;
    document.body.appendChild(feedbackEl);
    setTimeout(() => feedbackEl.remove(), 2000);

    // Switch to roteiros tab and re-render
    const roteirosTab = document.querySelector('[data-tab="roteiros-tab"]');
    if (roteirosTab) roteirosTab.click();

    renderStories();
}

function generateWeeklyScript() {
    const weeklyData = [];
    const CATEGORIES = ['Humanização', 'Engajamento', 'Vendas'];
    const WEEKDAY_LABELS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    let trends = [];
    try {
        const trendData = localStorage.getItem('nutrirotina_cached_trends');
        if (trendData) trends = JSON.parse(trendData);
    } catch (e) {}

    for (let day = 1; day < 8; day++) {  // 1=segunda, 7=domingo (JS Date.getDay(): 0=domingo)
        const weekdayIndex = day % 7;  // 1=>1, 2=>2, ..., 7=>0
        const categoryIndex = (day - 1) % 3;  // 0=>H, 1=>E, 2=>V, 3=>H...
        const category = CATEGORIES[categoryIndex];

        // Trend da semana (cíclico)
        const trendIndex = (day - 1) % trends.length;
        const trend = trends.length > 0 ? trends[trendIndex] : null;

        // Rotina pessoal do dia
        const scheduleItems = scheduleManager.getItemsForDay(weekdayIndex);
        const gancho = scheduleItems.length > 0
            ? `Seu dia: ${scheduleItems[0].title}${scheduleItems[0].time ? ` às ${scheduleItems[0].time}` : ''}`
            : '';

        weeklyData.push({
            day: WEEKDAY_LABELS[day - 1],
            weekdayIndex,
            category,
            title: trend ? trend.topic : `Dica de ${category}`,
            description: trend ? trend.description : `Conteúdo sobre ${category.toLowerCase()}`,
            gancho,
            opening: `Eba, hoje é ${WEEKDAY_LABELS[day - 1]}! Sabe aquele ${trend ? trend.topic.toLowerCase() : 'tema'} que todos falam? Vou compartilhar comigo...`,
            transitions: trend ? trend.description : `Um conteúdo estratégico sobre ${category}`,
            closing: 'Gostou dessa dica? Manda um DM ou marca seus amigos!'
        });
    }

    return weeklyData;
}

function renderWeeklyTab() {
    const container = document.getElementById('weekly-list');
    if (!container) return;

    const weeklyData = generateWeeklyScript();

    container.innerHTML = weeklyData.map((day, idx) => {
        const style = STORY_CATEGORY_STYLES[day.category];
        return `
            <div class="weekly-card">
                <div class="weekly-day-header">
                    <div class="weekly-day-name">${day.day}</div>
                    <span class="weekly-category-badge category-badge" style="background: ${style.bg}; color: ${style.color};">
                        ${day.category}
                    </span>
                </div>
                <div class="weekly-content">
                    <strong>${day.title}</strong><br>
                    ${day.description}
                </div>
                ${day.gancho ? `<div class="weekly-gancho">💡 ${day.gancho}</div>` : ''}
                <button class="weekly-use-btn" onclick="useWeeklyScript(${idx})">+ Usar esse roteiro</button>
            </div>
        `;
    }).join('');
}

function useWeeklyScript(index) {
    const weeklyData = generateWeeklyScript();
    const day = weeklyData[index];

    const story = storiesManager.addStory({
        title: `${day.day}: ${day.title}`,
        category: day.category,
        platform: 'Instagram',
        opening: day.opening,
        transitions: day.transitions,
        closing: day.closing
    });

    const btn = event.target;
    btn.textContent = '✓ Adicionado';
    btn.classList.add('used');
    setTimeout(() => {
        btn.textContent = '+ Usar esse roteiro';
        btn.classList.remove('used');
    }, 1500);

    renderStories();
}

function renderRoteiroDia() {
    const container = document.getElementById('weekly-list');
    if (!container || !roteiroDia) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Roteiro de hoje ainda não foi gerado. Tente novamente mais tarde.</p>';
        return;
    }

    const reel = roteiroDia.reel;
    const stories = roteiroDia.stories || [];

    let html = `
        <div style="background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; border-left: 4px solid var(--rosa-quente);">
            <h2 style="font-size: 16px; margin: 0 0 8px 0; color: var(--preto);">${roteiroDia.pauta}</h2>
            <p style="font-size: 12px; color: #999; margin: 0;">Estudo: ${roteiroDia.estudoTitulo}</p>
            <p style="font-size: 12px; color: #999; margin: 4px 0 0 0;">Categoria: <strong>${roteiroDia.categoria}</strong></p>
        </div>

        <div style="background: #fff3e0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0; color: var(--preto);">🎬 Reel/Vídeo Estruturado</h3>
            <div style="font-size: 13px; line-height: 1.6; color: var(--cinza-escuro);">
                <p><strong>Hook:</strong> ${reel.hook}</p>
                <p><strong>Problema:</strong> ${reel.problema}</p>
                <p><strong>Consequência:</strong> ${reel.consequencia}</p>
                <p><strong>Exemplo:</strong> ${reel.exemploReal}</p>
                <p><strong>Solução:</strong> ${reel.solucao}</p>
                <p><strong>CTA:</strong> ${reel.cta}</p>
            </div>
            <p style="font-size: 11px; color: #999; margin: 12px 0 0 0; font-style: italic;">📝 ${roteiroDia.notasGravacao}</p>
        </div>

        <h3 style="font-size: 14px; font-weight: 600; margin: 20px 0 12px 0;">📱 8 Stories Estruturados</h3>
    `;

    stories.forEach((story, idx) => {
        const lifestyleInfo = story.lifestyleData ? `
            <div style="background: #f0f0f0; border-radius: 8px; padding: 8px; margin-top: 8px; font-size: 12px;">
                <strong>📍 Dados reais de hoje:</strong><br>
                ${Object.entries(story.lifestyleData).map(([key, val]) => {
                    if (key === 'timestamp') return '';
                    return `${key}: <strong>${val}</strong><br>`;
                }).join('')}
            </div>
        ` : '';

        html += `
            <div class="weekly-card" style="margin-bottom: 12px;">
                <div class="weekly-day-header">
                    <div class="weekly-day-name" style="background: var(--rosa-quente); color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">${idx + 1}</div>
                    <span style="font-weight: 600; font-size: 13px;">${story.titulo}</span>
                </div>
                <div style="font-size: 12px; color: #666; margin: 8px 0;">
                    <p><strong>Tipo:</strong> ${story.tipo}</p>
                    <p><strong>Na tela:</strong> "${story.textNaTela}"</p>
                    <p><strong>Conteúdo:</strong> ${story.conteudo}</p>
                    ${story.enquete ? '<p>🔄 <strong>Inclui enquete de interação</strong></p>' : ''}
                    ${lifestyleInfo}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize current date
    updateCurrentDate();
    renderGamificationBadge();
    renderToday();
    renderCalendarWeek();

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();

            // Remove active state from all items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Add active state to clicked item
            item.classList.add('active');

            // Show corresponding section
            const sectionId = item.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');

                // Render home "Hoje" when home tab is opened
                if (sectionId === 'home') {
                    renderToday();
                    renderCalendarWeek();
                }

                // Render habits when habits tab is opened
                if (sectionId === 'habits') {
                    renderHabits();
                }

                // Render goals when goals tab is opened
                if (sectionId === 'goals') {
                    renderGoals();
                }

                // Render clinic when clinic tab is opened
                if (sectionId === 'clinic') {
                    await syncClaudeAppointments();
                    renderClinic();
                }

                // Render tasks when tasks tab is opened
                if (sectionId === 'tasks') {
                    renderTasks();
                }

                // Render stories when stories tab is opened
                if (sectionId === 'stories') {
                    renderStorySuggestion();
                    renderStories();
                    await loadRoteirosCompletos();
                    // Prioriza roteiroDia se disponível, senão usa template genérico
                    if (roteiroDia) {
                        renderRoteiroDia();
                    } else {
                        renderWeeklyTab();
                    }
                    await loadScienceStudies();
                    renderScienceTab();
                }

                // Render ideas when ideas tab is opened
                if (sectionId === 'ideas') {
                    renderIdeas();
                }

                // Render humor/diário when journal tab is opened
                if (sectionId === 'journal') {
                    const journalDate = document.getElementById('journal-date');
                    if (journalDate && !journalDate.value) journalDate.value = formatDateStr(new Date());
                    renderMood();
                    renderJournalEntries();
                }
            }
        });
    });

    // Gamification Modal
    const pointsBadge = document.getElementById('points-badge');
    if (pointsBadge) {
        pointsBadge.addEventListener('click', openGamificationModal);
    }

    const closeGamificationModalBtn = document.getElementById('close-gamification-modal');
    if (closeGamificationModalBtn) {
        closeGamificationModalBtn.addEventListener('click', closeGamificationModal);
    }

    const gamificationModal = document.getElementById('gamification-modal');
    if (gamificationModal) {
        gamificationModal.addEventListener('click', (e) => {
            if (e.target === gamificationModal) {
                closeGamificationModal();
            }
        });
    }

    // Habits Modal
    const addHabitBtn = document.getElementById('add-habit-btn');
    if (addHabitBtn) {
        addHabitBtn.addEventListener('click', openHabitModal);
    }

    const closeHabitModalBtn = document.getElementById('close-habit-modal');
    if (closeHabitModalBtn) {
        closeHabitModalBtn.addEventListener('click', closeHabitModal);
    }

    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
        habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('habit-name').value;
            const description = document.getElementById('habit-description').value;
            const frequency = document.getElementById('habit-frequency').value;
            const category = document.getElementById('habit-category').value;
            const color = document.getElementById('habit-color').value;
            const time = document.getElementById('habit-time').value;
            const reminder = document.getElementById('habit-reminder').checked;

            let weeklyDays = [];
            let monthlyDay = '';

            if (frequency === 'weekly') {
                const checked = document.querySelectorAll('.day-checkbox:checked');
                weeklyDays = Array.from(checked).map(c => parseInt(c.value));
            } else if (frequency === 'monthly') {
                monthlyDay = document.getElementById('habit-monthly-day').value;
            }

            habitsManager.addHabit(name, description, frequency, category, color, time, reminder, weeklyDays, monthlyDay);

            // Request notification permission if enabled
            if (reminder && 'Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }

            renderHabits();
            renderToday();
            closeHabitModal();
        });
    }

    // Frequency selector - show/hide optional fields
    const frequencySelect = document.getElementById('habit-frequency');
    if (frequencySelect) {
        frequencySelect.addEventListener('change', (e) => {
            const weeklyGroup = document.getElementById('weekly-days-group');
            const monthlyGroup = document.getElementById('monthly-day-group');

            weeklyGroup.style.display = 'none';
            monthlyGroup.style.display = 'none';

            if (e.target.value === 'weekly') {
                weeklyGroup.style.display = 'block';
            } else if (e.target.value === 'monthly') {
                monthlyGroup.style.display = 'block';
            }
        });
    }

    // Weekly days selector
    document.querySelectorAll('.day-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checked = document.querySelectorAll('.day-checkbox:checked');
            const days = Array.from(checked).map(c => c.value).join(',');
            document.getElementById('habit-weekly-days').value = days;
        });
    });

    // Color picker
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            e.target.classList.add('selected');
            document.getElementById('habit-color').value = e.target.dataset.color;
        });
    });

    // Set first color as selected
    document.querySelector('[data-color="#E0B0FF"]')?.classList.add('selected');

    // Close modal when clicking outside
    const modal = document.getElementById('habit-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeHabitModal();
            }
        });
    }

    // Global tracker tabs
    document.querySelectorAll('#global-tracker .tracker-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const viewType = e.target.dataset.trackerView;

            document.querySelectorAll('#global-tracker .tracker-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            document.getElementById('tracker-content').innerHTML = renderTrackerView(viewType);

            // Re-attach circle listeners
            document.querySelectorAll('#tracker-content .tracker-circle').forEach(circle => {
                circle.addEventListener('click', (evt) => {
                    const habitId = parseInt(evt.currentTarget.dataset.habitId);
                    const date = new Date(evt.currentTarget.dataset.date);
                    habitsManager.toggleHabitDay(habitId, date);
                    renderHabits();
                });
            });
        });
    });

    // Goals Modal
    const addGoalBtn = document.getElementById('add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', openGoalModal);
    }

    const closeGoalModalBtn = document.getElementById('close-goal-modal');
    if (closeGoalModalBtn) {
        closeGoalModalBtn.addEventListener('click', closeGoalModal);
    }

    const goalForm = document.getElementById('goal-form');
    if (goalForm) {
        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('goal-name').value;
            const description = document.getElementById('goal-description').value;
            const startDate = document.getElementById('goal-start-date').value;
            const endDate = document.getElementById('goal-end-date').value;

            goalsManager.addGoal(name, description, startDate, endDate);
            renderGoals();
            closeGoalModal();
        });
    }

    const goalModal = document.getElementById('goal-modal');
    if (goalModal) {
        goalModal.addEventListener('click', (e) => {
            if (e.target === goalModal) {
                closeGoalModal();
            }
        });
    }

    // Clinic Modal
    const addClinicBtn = document.getElementById('add-clinic-btn');
    if (addClinicBtn) {
        addClinicBtn.addEventListener('click', openClinicModal);
    }

    const closeClinicModalBtn = document.getElementById('close-clinic-modal');
    if (closeClinicModalBtn) {
        closeClinicModalBtn.addEventListener('click', closeClinicModal);
    }

    const clinicForm = document.getElementById('clinic-form');
    if (clinicForm) {
        clinicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const patientName = document.getElementById('clinic-patient').value;
            const phone = document.getElementById('clinic-phone').value;
            const date = document.getElementById('clinic-date').value;
            const time = document.getElementById('clinic-time').value;
            const notes = document.getElementById('clinic-notes').value;

            clinicManager.addAppointment({ patientName, phone, date, time, notes });
            renderClinic();
            renderToday();
            closeClinicModal();
        });
    }

    const clinicModal = document.getElementById('clinic-modal');
    if (clinicModal) {
        clinicModal.addEventListener('click', (e) => {
            if (e.target === clinicModal) {
                closeClinicModal();
            }
        });
    }

    // Clinic Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            clinicFilter = e.target.dataset.filter;
            renderClinic();
        });
    });

    // Tasks Modal
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openTaskModal);
    }

    const closeTaskModalBtn = document.getElementById('close-task-modal');
    if (closeTaskModalBtn) {
        closeTaskModalBtn.addEventListener('click', closeTaskModal);
    }

    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('task-title').value;
            const description = document.getElementById('task-description').value;
            const date = document.getElementById('task-date').value;
            const time = document.getElementById('task-time').value;
            const category = document.getElementById('task-category').value;
            const priority = document.getElementById('task-priority').value;

            tasksManager.addTask({ title, description, date, time, category, priority });
            renderTasks();
            renderToday();
            closeTaskModal();
        });
    }

    const taskModal = document.getElementById('task-modal');
    if (taskModal) {
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) {
                closeTaskModal();
            }
        });
    }

    // Task Filters
    document.querySelectorAll('.task-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const group = e.target.closest('.task-filters');
            group.querySelectorAll('.task-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            taskFilters[e.target.dataset.filterType] = e.target.dataset.value;
            renderTasks();
        });
    });

    const onlyPendingToggle = document.getElementById('tasks-only-pending');
    if (onlyPendingToggle) {
        onlyPendingToggle.addEventListener('change', (e) => {
            taskFilters.onlyPending = e.target.checked;
            renderTasks();
        });
    }

    // Story Suggestion
    const regenerateSuggestionBtn = document.getElementById('regenerate-suggestion-btn');
    if (regenerateSuggestionBtn) {
        regenerateSuggestionBtn.addEventListener('click', renderStorySuggestion);
    }

    const useSuggestionBtn = document.getElementById('use-suggestion-btn');
    if (useSuggestionBtn) {
        useSuggestionBtn.addEventListener('click', () => {
            if (!currentSuggestion) return;
            storiesManager.addStory(currentSuggestion);
            renderStories();
            renderStorySuggestion();
        });
    }

    // Stories Modal
    const addStoryBtn = document.getElementById('add-story-btn');
    if (addStoryBtn) {
        addStoryBtn.addEventListener('click', openStoryModal);
    }

    const closeStoryModalBtn = document.getElementById('close-story-modal');
    if (closeStoryModalBtn) {
        closeStoryModalBtn.addEventListener('click', closeStoryModal);
    }

    const storyForm = document.getElementById('story-form');
    if (storyForm) {
        storyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('story-title').value;
            const category = document.getElementById('story-category').value;
            const platform = document.getElementById('story-platform').value;
            const opening = document.getElementById('story-opening').value;
            const transitions = document.getElementById('story-transitions').value;
            const closing = document.getElementById('story-closing').value;

            storiesManager.addStory({ title, category, platform, opening, transitions, closing });
            renderStories();
            closeStoryModal();
        });
    }

    const storyModal = document.getElementById('story-modal');
    if (storyModal) {
        storyModal.addEventListener('click', (e) => {
            if (e.target === storyModal) {
                closeStoryModal();
            }
        });
    }

    // Story Filters
    document.querySelectorAll('.story-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const group = e.target.closest('.task-filters');
            group.querySelectorAll('.story-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            storyFilters[e.target.dataset.filterType] = e.target.dataset.value;
            renderStories();
        });
    });

    // Story Tabs (Roteiros | Estudo Científico | Roteiro Semanal)
    document.querySelectorAll('#stories .story-tab-btn').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;

            // Toggle active state on tabs and content
            document.querySelectorAll('#stories .story-tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#stories .story-tab-content').forEach(c => c.classList.remove('active'));

            e.target.classList.add('active');
            const tabContent = document.getElementById(tabName);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // Close Science View Modal
    const closeScienceViewModalBtn = document.getElementById('close-science-view-modal');
    if (closeScienceViewModalBtn) {
        closeScienceViewModalBtn.addEventListener('click', closeScienceViewModal);
    }

    const scienceViewModal = document.getElementById('science-view-modal');
    if (scienceViewModal) {
        scienceViewModal.addEventListener('click', (e) => {
            if (e.target === scienceViewModal) {
                closeScienceViewModal();
            }
        });
    }

    // Use Science Hook Button - Open category/day selection modal
    const useScienceHookBtn = document.getElementById('use-science-hook-btn');
    if (useScienceHookBtn) {
        useScienceHookBtn.addEventListener('click', () => {
            if (activeScienceIndex === null) return;
            openUseGanchoModal();
        });
    }

    // Use Gancho Modal - Category buttons
    document.querySelectorAll('.category-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-choice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedGanchoCategory = btn.dataset.category;
            updateConfirmButtonState();
        });
    });

    // Use Gancho Modal - Weekday buttons
    document.querySelectorAll('.weekday-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.weekday-choice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedGanchoWeekday = parseInt(btn.dataset.weekday);
            updateConfirmButtonState();
        });
    });

    // Use Gancho Modal - Confirm button
    const confirmGanchoBtn = document.getElementById('confirm-use-gancho-btn');
    if (confirmGanchoBtn) {
        confirmGanchoBtn.addEventListener('click', confirmUseGancho);
    }

    // Use Gancho Modal - Cancel button
    const cancelGanchoBtn = document.getElementById('cancel-use-gancho-btn');
    if (cancelGanchoBtn) {
        cancelGanchoBtn.addEventListener('click', closeUseGanchoModal);
    }

    // Use Gancho Modal - Close button
    const closeGanchoBtn = document.getElementById('close-use-gancho-modal');
    if (closeGanchoBtn) {
        closeGanchoBtn.addEventListener('click', closeUseGanchoModal);
    }

    // Use Gancho Modal - Backdrop click
    const useGanchoModal = document.getElementById('use-science-gancho-modal');
    if (useGanchoModal) {
        useGanchoModal.addEventListener('click', (e) => {
            if (e.target === useGanchoModal) {
                closeUseGanchoModal();
            }
        });
    }

    // Story View Modal
    const closeStoryViewModalBtn = document.getElementById('close-story-view-modal');
    if (closeStoryViewModalBtn) {
        closeStoryViewModalBtn.addEventListener('click', closeStoryViewModal);
    }

    const storyViewModal = document.getElementById('story-view-modal');
    if (storyViewModal) {
        storyViewModal.addEventListener('click', (e) => {
            if (e.target === storyViewModal) {
                closeStoryViewModal();
            }
        });
    }

    const storyViewStatus = document.getElementById('story-view-status');
    if (storyViewStatus) {
        storyViewStatus.addEventListener('change', (e) => {
            if (activeStoryId !== null) {
                storiesManager.updateStatus(activeStoryId, e.target.value);
                renderStories();
            }
        });
    }

    const copyStoryBtn = document.getElementById('copy-story-btn');
    if (copyStoryBtn) {
        copyStoryBtn.addEventListener('click', () => {
            const story = storiesManager.stories.find(s => s.id === activeStoryId);
            if (!story) return;

            const fullText = [story.opening, story.transitions, story.closing]
                .filter(Boolean)
                .join('\n\n');

            navigator.clipboard.writeText(fullText).then(() => {
                copyStoryBtn.textContent = 'Copiado!';
                setTimeout(() => { copyStoryBtn.textContent = 'Copiar roteiro'; }, 1500);
            });
        });
    }

    // Gerar ideias da semana
    const generateWeeklyIdeasBtn = document.getElementById('generate-weekly-ideas-btn');
    if (generateWeeklyIdeasBtn) {
        generateWeeklyIdeasBtn.addEventListener('click', async () => {
            generateWeeklyIdeasBtn.disabled = true;
            generateWeeklyIdeasBtn.textContent = 'Gerando...';
            await generateWeeklyIdeas();
            renderIdeas();
            generateWeeklyIdeasBtn.disabled = false;
            generateWeeklyIdeasBtn.textContent = '✨ Gerar da semana';
        });
    }

    // Ideas Modal
    const addIdeaBtn = document.getElementById('add-idea-btn');
    if (addIdeaBtn) {
        addIdeaBtn.addEventListener('click', openIdeaModal);
    }

    const closeIdeaModalBtn = document.getElementById('close-idea-modal');
    if (closeIdeaModalBtn) {
        closeIdeaModalBtn.addEventListener('click', closeIdeaModal);
    }

    const ideaForm = document.getElementById('idea-form');
    if (ideaForm) {
        ideaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('idea-title').value;
            const description = document.getElementById('idea-description').value;
            const category = document.getElementById('idea-category').value;

            ideasManager.addIdea({ title, description, category });
            renderIdeas();
            closeIdeaModal();
        });
    }

    const ideaModal = document.getElementById('idea-modal');
    if (ideaModal) {
        ideaModal.addEventListener('click', (e) => {
            if (e.target === ideaModal) {
                closeIdeaModal();
            }
        });
    }

    // Idea Filters
    document.querySelectorAll('.idea-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const group = e.target.closest('.task-filters');
            group.querySelectorAll('.idea-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            ideaFilters[e.target.dataset.filterType] = e.target.dataset.value;
            renderIdeas();
        });
    });

    // Idea View Modal
    const closeIdeaViewModalBtn = document.getElementById('close-idea-view-modal');
    if (closeIdeaViewModalBtn) {
        closeIdeaViewModalBtn.addEventListener('click', closeIdeaViewModal);
    }

    const ideaViewModal = document.getElementById('idea-view-modal');
    if (ideaViewModal) {
        ideaViewModal.addEventListener('click', (e) => {
            if (e.target === ideaViewModal) {
                closeIdeaViewModal();
            }
        });
    }

    const ideaViewStatus = document.getElementById('idea-view-status');
    if (ideaViewStatus) {
        ideaViewStatus.addEventListener('change', (e) => {
            if (activeIdeaId !== null) {
                ideasManager.updateStatus(activeIdeaId, e.target.value);
                renderIdeas();
            }
        });
    }

    const convertIdeaTaskBtn = document.getElementById('convert-idea-task-btn');
    if (convertIdeaTaskBtn) {
        convertIdeaTaskBtn.addEventListener('click', () => {
            if (activeIdeaId !== null) convertIdeaToTask(activeIdeaId);
        });
    }

    const convertIdeaStoryBtn = document.getElementById('convert-idea-story-btn');
    if (convertIdeaStoryBtn) {
        convertIdeaStoryBtn.addEventListener('click', () => {
            if (activeIdeaId !== null) convertIdeaToStory(activeIdeaId);
        });
    }

    // Mood Check-in
    const saveMoodBtn = document.getElementById('save-mood-btn');
    if (saveMoodBtn) {
        saveMoodBtn.addEventListener('click', () => {
            if (!selectedMoodEmoji) return;
            const today = formatDateStr(new Date());
            const note = document.getElementById('mood-note').value;
            moodManager.setMood(today, selectedMoodEmoji, note);
            renderMoodWeek();
            saveMoodBtn.textContent = 'Salvo!';
            setTimeout(() => { saveMoodBtn.textContent = 'Salvar humor de hoje'; }, 1500);
        });
    }

    // Journal (Diário)
    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
        journalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = document.getElementById('journal-date').value;
            const text = document.getElementById('journal-text').value;

            journalManager.addEntry(date, text);
            journalForm.reset();
            document.getElementById('journal-date').value = formatDateStr(new Date());
            renderJournalEntries();
        });
    }

    const journalSearch = document.getElementById('journal-search');
    if (journalSearch) {
        journalSearch.addEventListener('input', (e) => {
            journalSearchQuery = e.target.value;
            renderJournalEntries();
        });
    }

    // Progress Modal
    const progressSlider = document.getElementById('progress-slider');
    if (progressSlider) {
        progressSlider.addEventListener('input', (e) => {
            document.getElementById('progress-value-label').textContent = e.target.value;
        });
    }

    const closeProgressModalBtn = document.getElementById('close-progress-modal');
    if (closeProgressModalBtn) {
        closeProgressModalBtn.addEventListener('click', closeProgressModal);
    }

    const progressForm = document.getElementById('progress-form');
    if (progressForm) {
        progressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (activeGoalId !== null) {
                const progress = parseInt(document.getElementById('progress-slider').value);
                goalsManager.updateProgress(activeGoalId, progress);
                renderGoals();
            }
            closeProgressModal();
        });
    }

    const progressModal = document.getElementById('progress-modal');
    if (progressModal) {
        progressModal.addEventListener('click', (e) => {
            if (e.target === progressModal) {
                closeProgressModal();
            }
        });
    }

    // Add Action Button -> abre modal de escolha
    const addActionBtn = document.getElementById('add-action-btn');
    if (addActionBtn) {
        addActionBtn.addEventListener('click', openActionChoiceModal);
    }

    const closeActionChoiceModalBtn = document.getElementById('close-action-choice-modal');
    if (closeActionChoiceModalBtn) {
        closeActionChoiceModalBtn.addEventListener('click', closeActionChoiceModal);
    }

    const actionChoiceModal = document.getElementById('action-choice-modal');
    if (actionChoiceModal) {
        actionChoiceModal.addEventListener('click', (e) => {
            if (e.target === actionChoiceModal) {
                closeActionChoiceModal();
            }
        });
    }

    // Plano de Rotina Modal
    const closeRoutinePlanModalBtn = document.getElementById('close-routine-plan-modal');
    if (closeRoutinePlanModalBtn) {
        closeRoutinePlanModalBtn.addEventListener('click', closeRoutinePlanModal);
    }

    const routinePlanModal = document.getElementById('routine-plan-modal');
    if (routinePlanModal) {
        routinePlanModal.addEventListener('click', (e) => {
            if (e.target === routinePlanModal) {
                closeRoutinePlanModal();
            }
        });
    }

    document.querySelectorAll('.routine-area-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const row = e.target.closest('.routine-area-row');
            row.querySelector('.routine-area-frequency').disabled = !e.target.checked;
            row.querySelector('.routine-area-focus').disabled = !e.target.checked;
        });
    });

    const routinePlanForm = document.getElementById('routine-plan-form');
    if (routinePlanForm) {
        routinePlanForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const areaConfigs = [];
            document.querySelectorAll('.routine-area-row').forEach(row => {
                const toggle = row.querySelector('.routine-area-toggle');
                if (!toggle.checked) return;
                areaConfigs.push({
                    area: toggle.dataset.area,
                    frequency: row.querySelector('.routine-area-frequency').value,
                    focus: row.querySelector('.routine-area-focus').value.trim()
                });
            });

            if (areaConfigs.length === 0) return;

            const created = generateRoutinePlan(areaConfigs);
            renderToday();

            const confirmation = document.getElementById('routine-plan-confirmation');
            confirmation.textContent = `Plano gerado! ${created} tarefa${created > 1 ? 's' : ''} adicionada${created > 1 ? 's' : ''} essa semana.`;
            confirmation.classList.remove('hidden');
        });
    }

    const ACTION_CHOICE_MAP = {
        habit: { section: 'habits', open: openHabitModal },
        task: { section: 'tasks', open: openTaskModal },
        clinic: { section: 'clinic', open: openClinicModal },
        goal: { section: 'goals', open: openGoalModal },
        story: { section: 'stories', open: openStoryModal },
        routine: { section: 'home', open: openRoutinePlanModal }
    };

    document.querySelectorAll('.action-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = ACTION_CHOICE_MAP[btn.dataset.choice];
            if (!choice) return;

            closeActionChoiceModal();

            const navItem = document.querySelector(`.nav-item[data-section="${choice.section}"]`);
            if (navItem && !navItem.classList.contains('active')) {
                navItem.click();
            }

            choice.open();
        });
    });

    // Calendar Navigation
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');

    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', () => {
            weekOffset--;
            renderCalendarWeek();
        });
    }

    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', () => {
            weekOffset++;
            renderCalendarWeek();
        });
    }

    // Schedule Edit Modal (agenda da semana inteira)
    const editScheduleBtn = document.getElementById('edit-schedule-btn');
    if (editScheduleBtn) {
        editScheduleBtn.addEventListener('click', openScheduleEditModal);
    }

    const closeScheduleEditModalBtn = document.getElementById('close-schedule-edit-modal');
    if (closeScheduleEditModalBtn) {
        closeScheduleEditModalBtn.addEventListener('click', closeScheduleEditModal);
    }

    const scheduleEditModal = document.getElementById('schedule-edit-modal');
    if (scheduleEditModal) {
        scheduleEditModal.addEventListener('click', (e) => {
            if (e.target === scheduleEditModal) {
                closeScheduleEditModal();
            }
        });
    }

    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    if (saveScheduleBtn) {
        saveScheduleBtn.addEventListener('click', saveScheduleWeek);
    }
});

function updateCurrentDate() {
    const dateElement = document.querySelector('.greeting p');
    if (dateElement) {
        const today = new Date();
        const dayName = today.toLocaleDateString('pt-BR', { weekday: 'long' });
        const monthDay = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
        dateElement.textContent = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${monthDay}`;
    }
}

// Initialize Home as default section
window.addEventListener('load', () => {
    const homeNav = document.querySelector('[data-section="home"]');
    if (homeNav) {
        homeNav.click();
    }

    // SYNC WITH SUPABASE
    setupSupabaseSync();
});

// Setup Supabase synchronization
async function setupSupabaseSync() {
    console.log('🔄 Iniciando sincronização com Supabase...');

    // Aguardar SupabaseData estar pronto
    let attempts = 0;
    while (!window.SupabaseData && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }

    if (!SupabaseData) {
        console.warn('⚠️ SupabaseData não carregou, sincronização desativada');
        return;
    }

    // MIGRAÇÃO: enviar dados do localStorage pro Supabase (primeira vez)
    console.log('🔄 Verificando se precisa migrar dados locais...');
    const migrationDone = localStorage.getItem('nutrirotina_migrated_to_supabase');
    if (!migrationDone) {
        const success = await SupabaseData.migrateLocalDataToSupabase({
            habits: habitsManager,
            tasks: tasksManager,
            goals: goalsManager,
            clinic: clinicManager,
            gamification: gamificationManager
        });
        if (success) {
            localStorage.setItem('nutrirotina_migrated_to_supabase', 'true');
        }
    }

    // Carregar dados do Supabase
    try {
        console.log('📥 Carregando dados do Supabase...');

        const [habits, tasks, goals, appointments, schedule, stories, ideas, moodCheckins, journalEntries, gamification] = await Promise.all([
            SupabaseData.loadHabits(),
            SupabaseData.loadTasks(),
            SupabaseData.loadGoals(),
            SupabaseData.loadClinicAppointments(),
            SupabaseData.loadSchedule(),
            SupabaseData.loadStories(),
            SupabaseData.loadIdeas(),
            SupabaseData.loadMoodCheckins(),
            SupabaseData.loadJournalEntries(),
            SupabaseData.loadGamification()
        ]);

        // Se houver dados no Supabase, usar eles
        if (habits.length > 0) {
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
            console.log('✅ Hábitos carregados do Supabase:', habits.length);
        }

        if (tasks.length > 0) {
            tasksManager.tasks = tasks.map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
                category: t.category,
                priority: t.priority,
                status: t.status,
                date: t.date,
                time: t.time,
                createdAt: t.created_at
            }));
            console.log('✅ Tarefas carregadas do Supabase:', tasks.length);
        }

        if (goals.length > 0) {
            goalsManager.goals = goals.map(g => ({
                id: g.id,
                name: g.name,
                description: g.description,
                startDate: g.start_date,
                endDate: g.end_date,
                progress: g.progress,
                status: g.status,
                createdAt: g.created_at,
                milestones: [],
                history: []
            }));
            console.log('✅ Metas carregadas do Supabase:', goals.length);
        }

        if (appointments.length > 0) {
            clinicManager.appointments = appointments.map(a => ({
                id: a.id,
                patientName: a.patient_name,
                phone: a.phone,
                date: a.date,
                time: a.time,
                notes: a.notes,
                createdAt: a.created_at
            }));
            console.log('✅ Consultório carregado do Supabase:', appointments.length);
        }

        if (gamification && gamification.points) {
            gamificationManager.data = {
                points: gamification.points || 0,
                history: gamification.history || []
            };
            console.log('✅ Gamificação carregada do Supabase');
        }

    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
    }

    // Agora, interceptar os saves para enviar pro Supabase
    const originalSaveHabits = habitsManager.saveHabits.bind(habitsManager);
    habitsManager.saveHabits = function() {
        originalSaveHabits();
        SupabaseData.saveHabits(this.habits).catch(console.error);
    };

    const originalSaveTasks = tasksManager.saveTasks.bind(tasksManager);
    tasksManager.saveTasks = function() {
        originalSaveTasks();
        SupabaseData.saveTasks(this.tasks).catch(console.error);
    };

    const originalSaveGoals = goalsManager.saveGoals.bind(goalsManager);
    goalsManager.saveGoals = function() {
        originalSaveGoals();
        SupabaseData.saveGoals(this.goals).catch(console.error);
    };

    const originalSaveAppointments = clinicManager.saveAppointments.bind(clinicManager);
    clinicManager.saveAppointments = function() {
        originalSaveAppointments();
        SupabaseData.saveClinicAppointments(this.appointments).catch(console.error);
    };

    const originalSaveGamification = gamificationManager.saveData.bind(gamificationManager);
    gamificationManager.saveData = function() {
        originalSaveGamification();
        SupabaseData.saveGamification(this.data).catch(console.error);
    };

    console.log('✅ Sincronização com Supabase ativada!');
}
