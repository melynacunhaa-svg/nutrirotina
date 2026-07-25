// NutriRotina — App Principal
// Gerencia navegação, renderização de páginas e estado

class NutriRotina {
    constructor() {
        this.currentPage = 'home';
        this.tasks = this.loadTasks();
        this.ideas = this.loadIdeas();
        this.plannings = this.loadPlannings();
        this.stories = this.loadStories();
        this.drafts = this.loadDrafts();
        this.habitos = this.loadHabitos();
        this.atividades = this.loadAtividades();
        this.feedbackStates = {};
        this.todayMood = null;
        this.agenda = this.generateFakeAgenda();
        this.initSequenceBank();

        // Fallback de trending topics (usado se API falhar)
        this.trendingTopicsFallback = [
            {
                icon: '💊',
                name: 'GLP-1',
                tag: 'Trending',
                pauta: 'Mitos e verdades sobre GLP-1',
                description: 'Esclareça as principais dúvidas sobre o uso de GLP-1 e seus efeitos reais na perda de peso. Compartilhe a diferença entre o hype e a realidade.',
                example: '"Não, GLP-1 não é só pra quem tem diabetes. Entenda quando faz sentido usar."'
            },
            {
                icon: '🦠',
                name: 'Intestino saudável',
                tag: 'Trending',
                pauta: 'Saúde intestinal e emagrecimento',
                description: 'Mostre como um intestino saudável é fundamental para emagrecer. Fale sobre microbioma, alimentos que alimentam bactérias boas.',
                example: '"Você sabia que seu intestino decide se você emagrece ou não?"'
            },
            {
                icon: '📉',
                name: 'Efeito rebote',
                tag: 'Trending',
                pauta: 'Como evitar o efeito rebote',
                description: 'Compartilhe estratégias para evitar recuperar peso após uma dieta. Fale sobre metabolismo, reeducação alimentar e mentalidade.',
                example: '"O efeito rebote não é destino, é falta de estratégia."'
            },
            {
                icon: '🧠',
                name: 'Saúde mental',
                tag: 'Trending',
                pauta: 'Emocional vs corpo no emagrecimento',
                description: 'Conecte saúde mental com emagrecimento. Fale sobre ansiedade, emocional eating, autossabotagem e como lidar.',
                example: '"Seu corpo reflete seu estado emocional. Que corpo você quer refletir?"'
            },
            {
                icon: '🌿',
                name: 'Detox natural',
                tag: 'Trending',
                pauta: 'Desintoxicação natural do corpo',
                description: 'Explique como o corpo se desintoxica naturalmente. Desmistifique detox radical e fale sobre abordagem fisiológica.',
                example: '"Você não precisa de suco de detox, seu corpo já é uma máquina de desintoxicação."'
            },
            {
                icon: '⏰',
                name: 'Jejum intermitente',
                tag: 'Trending',
                pauta: 'Jejum intermitente na prática',
                description: 'Tire dúvidas comuns sobre jejum intermitente. Fale sobre tipos, melhores horários e a quem não recomenda.',
                example: '"Jejum intermitente não é pra todo mundo. Descubra se é pra você."'
            }
        ];

        this.trendingTopics = [...this.trendingTopicsFallback];
        this.init();
    }

    init() {
        this.setupDOM();
        this.attachEventListeners();
        this.updateDate();
        this.loadTrendingTopics();
        this.navigateTo('home');
    }

    setupDOM() {
        this.contentElement = document.getElementById('content');
        this.navMenu = document.getElementById('navMenu');
        this.menuToggle = document.getElementById('menuToggle');
        this.homeTemplate = document.getElementById('home-template');
        this.tasksPageTemplate = document.getElementById('tasks-page-template');
        this.ideasPageTemplate = document.getElementById('ideas-page-template');
        this.planningPageTemplate = document.getElementById('planning-page-template');
        this.storiesPageTemplate = document.getElementById('stories-page-template');
        this.feedPageTemplate = document.getElementById('feed-page-template');
        this.feedbackPageTemplate = document.getElementById('feedback-page-template');
        this.weekPageTemplate = document.getElementById('week-page-template');
        this.heatmapPageTemplate = document.getElementById('heatmap-page-template');
        this.draftPageTemplate = document.getElementById('draft-page-template');
        this.draftsListTemplate = document.getElementById('drafts-list-template');
        this.pageTemplate = document.getElementById('page-template');
    }

    attachEventListeners() {
        try {
            // Menu toggle mobile
            if (this.menuToggle) {
                this.menuToggle.addEventListener('click', () => this.toggleMenu());
            }

            // Navegação
            document.querySelectorAll('[data-page]').forEach(link => {
                link.addEventListener('click', (e) => {
                    try {
                        e.preventDefault();
                        const page = e.currentTarget.dataset.page;
                        this.navigateTo(page);
                        this.closeMenu();
                    } catch (err) {
                        console.error('Erro ao navegar:', err);
                    }
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.app-header') && !e.target.closest('.app-nav')) {
                    this.closeMenu();
                }
            });
        } catch (error) {
            console.error('Erro ao anexar event listeners:', error);
        }
    }

    toggleMenu() {
        this.navMenu.classList.toggle('visible');
        this.menuToggle.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('visible');
        this.menuToggle.classList.remove('active');
    }

    navigateTo(page) {
        try {
            console.log('Navegando para:', page);
            this.currentPage = page;

            // Remove active de todas as páginas
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

            // Remove active de todos os nav links
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

            // Limpa conteúdo
            this.contentElement.innerHTML = '';

            // Define o nav link ativo
            document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

            // Renderiza a página
            if (page === 'home') {
                this.renderHome();
            } else if (page === 'tasks') {
                this.renderTasksPage();
            } else if (page === 'ideas') {
                this.renderIdeasPage();
            } else if (page === 'planning') {
                this.renderPlanningPage();
            } else if (page === 'feedback') {
                this.renderFeedbackPage();
            } else if (page === 'week') {
                this.renderWeekPage();
            } else if (page === 'heatmap') {
                this.renderHeatmapPage();
            } else if (page === 'stories') {
                this.renderStoriesPage();
            } else if (page === 'feed') {
                this.renderFeedPage();
            } else if (page === 'lifestyle') {
                this.renderLifestylePage();
            } else if (page.startsWith('draft-')) {
                const draftId = parseInt(page.replace('draft-', ''));
                this.renderDraftPage(draftId);
            } else if (page === 'drafts') {
                this.renderDraftsListPage();
            } else {
                this.renderPage(page);
            }
            console.log('Página renderizada com sucesso:', page);
        } catch (error) {
            console.error('Erro ao navegar para ' + page + ':', error);
        }
    }

    /* ===== HOME PAGE ===== */
    renderHome() {
        const clone = this.homeTemplate.content.cloneNode(true);
        const pageElement = clone.querySelector('.page-home');
        pageElement.classList.add('active');
        this.contentElement.appendChild(clone);

        // Renderiza hábitos (novo no topo)
        this.renderHabitos();

        // Renderiza timeline (nova feature)
        this.renderTimeline();

        // Renderiza agenda (pode ser removida depois, agora em segundo plano)
        // this.renderAgenda();

        // Renderiza tarefas
        this.renderHomeTasks();

        // Renderiza roteiro
        this.renderHomeRoteiro();

        // Debug
        console.log('=== DEBUG HOME ===');
        console.log('Data de hoje:', this.getTodayDateString());
        console.log('Total de atividades:', this.atividades.length);
        console.log('Atividades hoje:', this.getAtividadesToday().length);
    }

    renderHomeRoteiro() {
        const roteiroContent = this.contentElement.querySelector('#roteiro-content');
        roteiroContent.innerHTML = '';

        const todayRoteiro = this.getTodayRoteiro();
        if (!todayRoteiro) {
            roteiroContent.innerHTML = '<div class="placeholder-text">Ah, esqueceu de planejar ontem? Bora planejá-lo agora 😊</div>';
            return;
        }

        const roteiroList = document.createElement('div');
        roteiroList.className = 'roteiro-list';

        todayRoteiro.sequences.slice(0, 4).forEach((seq) => {
            const item = document.createElement('div');
            item.className = 'roteiro-item';
            item.innerHTML = `
                <div class="roteiro-number">${seq.numero || 1}</div>
                <div class="roteiro-details">
                    <div class="roteiro-category">${seq.objetivo}</div>
                    <div class="roteiro-title">${seq.texto_tela.substring(0, 60)}...</div>
                </div>
            `;
            roteiroList.appendChild(item);
        });

        roteiroContent.appendChild(roteiroList);
    }

    renderHabitos() {
        const greeting = this.contentElement.querySelector('.greeting-section');
        if (!greeting) return;

        const oldHabitos = this.contentElement.querySelector('.habitos-section');
        if (oldHabitos) oldHabitos.remove();

        const habitosSection = document.createElement('section');
        habitosSection.className = 'habitos-section';

        const habitosGrid = document.createElement('div');
        habitosGrid.className = 'habitos-grid';

        this.habitos.forEach(habito => {
            const card = document.createElement('div');
            card.className = `habito-card ${habito.completedToday ? 'completed' : ''}`;
            card.setAttribute('data-habito-id', habito.id);

            card.innerHTML = `
                <div class="habito-icon">${habito.icone}</div>
                <div class="habito-nome">${habito.nome}</div>
                <div class="habito-streak">${habito.streak} dias</div>
            `;

            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            card.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            card.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = currentX - startX;
                if (diff > 0) {
                    card.style.transform = `translateX(${diff}px)`;
                    card.style.opacity = Math.max(0, 1 - diff / 200);
                }
            });

            card.addEventListener('touchend', () => {
                const diff = currentX - startX;
                isDragging = false;
                if (diff > 80) {
                    card.style.transition = 'all 0.3s ease';
                    card.style.transform = 'translateX(100%)';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        this.toggleHabito(habito.id);
                    }, 150);
                } else {
                    card.style.transition = 'all 0.2s ease';
                    card.style.transform = 'translateX(0)';
                    card.style.opacity = '1';
                }
            });

            card.addEventListener('click', () => this.toggleHabito(habito.id));

            habitosGrid.appendChild(card);
        });

        habitosSection.appendChild(habitosGrid);
        greeting.parentElement.insertBefore(habitosSection, greeting.nextElementSibling);
    }

    renderTimeline() {
        const firstCard = this.contentElement.querySelector('.home-card');
        if (!firstCard) return;

        const oldTimeline = this.contentElement.querySelector('.timeline-card');
        if (oldTimeline) oldTimeline.remove();

        const timeline = document.createElement('section');
        timeline.className = 'home-card timeline-card';
        timeline.innerHTML = `
            <div class="card-header">
                <h3>📅 Seu dia</h3>
            </div>
            <div class="card-content" id="timeline-content">
                <div class="placeholder-text">Carregando timeline...</div>
            </div>
        `;

        firstCard.parentElement.insertBefore(timeline, firstCard);

        const timelineContent = this.contentElement.querySelector('#timeline-content');
        timelineContent.innerHTML = '';

        const atividades = this.getAtividadesToday();
        if (atividades.length === 0) {
            timelineContent.innerHTML = '<div class="placeholder-text">Nenhuma atividade hoje 📝</div>';
            return;
        }

        const timelineVisual = document.createElement('div');
        timelineVisual.className = 'timeline-visual';

        atividades.forEach((atividade, index) => {
            const [horaI, minI] = atividade.horaInicio.split(':').map(Number);
            const [horaF, minF] = atividade.horaFim.split(':').map(Number);
            const duracao = (horaF - horaI) * 60 + (minF - minI);
            const duracaoText = duracao < 60 ? `${duracao}min` : `${Math.floor(duracao / 60)}h`;

            const item = document.createElement('div');
            item.className = 'timeline-item';

            const bgColor = this.getCategoryColor(atividade.categoria);
            const textColor = atividade.categoria === 'organizacao' ? '#6b6b6b' : '#ffffff';

            item.innerHTML = `
                <div class="timeline-hora">${atividade.horaInicio}</div>
                <div class="timeline-dot" style="background-color: ${bgColor};"></div>
                <div class="timeline-bloco" style="background-color: ${bgColor}; color: ${textColor};">
                    <div class="timeline-titulo">${atividade.titulo}</div>
                    <div class="timeline-duracao">${duracaoText}</div>
                </div>
            `;

            timelineVisual.appendChild(item);
        });

        timelineContent.appendChild(timelineVisual);
    }

    handleTimelineDragStart(e, atividade) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('atividadeId', atividade.id.toString());
    }

    handleTimelineDragEnd() {
        // Placeholder para futuro desenvolvimento
    }

    abrirFormularioAtividade() {
        const hora = prompt('Qual hora? (ex: 09:30)');
        if (!hora) return;

        const titulo = prompt('Título da atividade:');
        if (!titulo) return;

        const categoria = prompt('Categoria (pessoal/exercicio/presencial/online/conteudo/social/organizacao):') || 'pessoal';

        const [h, m] = hora.split(':');
        const horaFim = `${String(parseInt(h) + 1).padStart(2, '0')}:${(m || '00')}`;

        this.addAtividade(titulo, hora.padStart(5, '0'), horaFim.padStart(5, '0'), categoria);
        this.renderTimeline();
    }

    renderAgenda() {
        const agendaContent = this.contentElement.querySelector('#agenda-content');
        agendaContent.innerHTML = '';

        if (this.agenda.length === 0) {
            agendaContent.innerHTML = '<div class="placeholder-text">Nenhum evento hoje ✨</div>';
            return;
        }

        const agendaList = document.createElement('div');
        agendaList.className = 'agenda-list';

        this.agenda.forEach(event => {
            const item = document.createElement('div');
            item.className = 'agenda-item';
            item.innerHTML = `
                <div class="agenda-icon">${event.icon}</div>
                <div class="agenda-info">
                    <div class="agenda-time">${event.time}</div>
                    <div class="agenda-title">${event.title}</div>
                    <div class="agenda-location">${event.location}</div>
                </div>
            `;
            agendaList.appendChild(item);
        });

        agendaContent.appendChild(agendaList);
    }

    renderHomeTasks() {
        const tasksContent = this.contentElement.querySelector('#tasks-content');
        tasksContent.innerHTML = '';

        const today = this.getTodayDateString();
        const todayTasks = this.tasks.filter(t => {
            const taskDate = t.date || this.getTodayDateString();
            const isToday = taskDate === today;
            const isVisible = t.isVisibleInMyDay !== false; // default true
            return isToday && isVisible;
        });

        // Tarefas antigas não feitas
        const oldTasks = this.tasks.filter(t => {
            const taskDate = t.date || this.getTodayDateString();
            const isOld = taskDate < today;
            const isNotDone = t.status !== 'done';
            const isNotVisible = t.isVisibleInMyDay === false;
            return isOld && isNotDone && isNotVisible;
        });

        // Mostrar card de pendentes
        if (oldTasks.length > 0) {
            const pendingCard = document.createElement('div');
            pendingCard.className = 'old-tasks-card';
            pendingCard.innerHTML = `
                <div class="old-tasks-header">
                    <span>🤔 Você ainda precisa fazer isso?</span>
                </div>
            `;

            oldTasks.forEach(task => {
                const item = document.createElement('div');
                item.className = 'old-task-item';
                item.innerHTML = `
                    <div class="old-task-content">
                        <span class="old-task-text">${task.title}</span>
                        <span class="old-task-date">${this.formatDate(new Date(task.dueDate || task.date))}</span>
                    </div>
                    <div class="old-task-actions">
                        <button class="btn-yes" data-task-id="${task.id}" title="Sim, ainda preciso">Sim</button>
                        <button class="btn-no" data-task-id="${task.id}" title="Não, descarta">Não</button>
                    </div>
                `;
                pendingCard.appendChild(item);
            });

            tasksContent.appendChild(pendingCard);

            // Event listeners para tarefas antigas
            pendingCard.querySelectorAll('.btn-yes').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = e.currentTarget.dataset.taskId;
                    const task = this.tasks.find(t => t.id == taskId);
                    if (task) {
                        task.isVisibleInMyDay = true;
                        task.date = today;
                        this.saveTasks();
                        this.renderHomeTasks();
                    }
                });
            });

            pendingCard.querySelectorAll('.btn-no').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = e.currentTarget.dataset.taskId;
                    this.tasks = this.tasks.filter(t => t.id != taskId);
                    this.saveTasks();
                    this.renderHomeTasks();
                });
            });
        }

        if (todayTasks.length === 0 && oldTasks.length === 0) {
            tasksContent.innerHTML = '<div class="placeholder-text">Tá tudo em dia por agora 💖</div>';
            return;
        }

        const tasksList = document.createElement('div');
        tasksList.className = 'tasks-list';

        todayTasks.forEach((task) => {
            const item = document.createElement('div');
            item.className = `task-item-wrapper ${task.status === 'done' ? 'done' : ''}`;
            item.setAttribute('data-task-id', task.id);

            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const today = new Date();
            const isOverdue = dueDate && dueDate < today && task.status !== 'done';
            const dueDateStr = dueDate ? this.formatDate(dueDate) : 'Sem prazo';

            item.innerHTML = `
                <div class="task-checkbox ${task.status === 'done' ? 'checked' : ''}" data-task-id="${task.id}"></div>
                <div class="task-details">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <div class="task-status-badge ${task.status}">
                            ${this.getStatusLabel(task.status)}
                        </div>
                        <div class="task-duedate ${isOverdue ? 'overdue' : ''}">
                            📅 ${dueDateStr} ${isOverdue ? '⚠️ Atrasada' : ''}
                        </div>
                    </div>
                    <div class="task-status-menu">
                        <button class="status-btn ${task.status === 'todo' ? 'active' : ''}" data-task-id="${task.id}" data-status="todo">A fazer</button>
                        <button class="status-btn ${task.status === 'in-progress' ? 'active' : ''}" data-task-id="${task.id}" data-status="in-progress">Em andamento</button>
                        <button class="status-btn ${task.status === 'done' ? 'active' : ''}" data-task-id="${task.id}" data-status="done">✓ Concluída</button>
                    </div>
                </div>
            `;

            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            item.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            item.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = currentX - startX;
                if (diff > 0) {
                    item.style.transform = `translateX(${diff}px)`;
                    item.style.opacity = Math.max(0, 1 - diff / 200);
                }
            });

            item.addEventListener('touchend', () => {
                const diff = currentX - startX;
                isDragging = false;
                if (diff > 80) {
                    item.style.transition = 'all 0.3s ease';
                    item.style.transform = 'translateX(100%)';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        this.updateTaskStatus(task.id, 'done');
                    }, 150);
                } else {
                    item.style.transition = 'all 0.2s ease';
                    item.style.transform = 'translateX(0)';
                    item.style.opacity = '1';
                }
            });

            // Event: checkbox
            item.querySelector('.task-checkbox').addEventListener('click', () => {
                const newStatus = task.status === 'done' ? 'todo' : 'done';
                this.updateTaskStatus(task.id, newStatus);
            });

            // Events: status buttons
            item.querySelectorAll('.status-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const status = btn.dataset.status;
                    this.updateTaskStatus(task.id, status);
                });
            });

            tasksList.appendChild(item);
        });

        tasksContent.appendChild(tasksList);
    }

    /* ===== TASKS PAGE ===== */
    renderTasksPage() {
        try {
            const clone = this.tasksPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-tasks');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            // Setup do formulário
            const addTaskBtn = this.contentElement.querySelector('#addTaskBtn');
            const newTaskInput = this.contentElement.querySelector('#newTaskInput');
            const newTaskDate = this.contentElement.querySelector('#newTaskDate');

            if (!addTaskBtn || !newTaskInput || !newTaskDate) {
                console.error('Elementos do formulário não encontrados');
                return;
            }

            addTaskBtn.addEventListener('click', () => {
                const title = newTaskInput.value.trim();
                const dueDate = newTaskDate.value;

                if (title) {
                    this.addTask(title, dueDate);
                    newTaskInput.value = '';
                    newTaskDate.value = '';
                    this.renderTasksPageList();
                }
            });

            // Renderiza lista
            this.renderTasksPageList();
        } catch (error) {
            console.error('Erro ao renderizar página de tarefas:', error);
        }
    }

    renderTasksPageList() {
        try {
            const container = this.contentElement.querySelector('#tasks-list-container');
            if (!container) {
                console.error('Container de tarefas não encontrado');
                return;
            }

            container.innerHTML = '';

            if (this.tasks.length === 0) {
                container.innerHTML = '<div class="placeholder-text">Nenhuma tarefa ainda. Bora caprichar? 💖</div>';
                return;
            }

            // Agrupa por status
            const todoTasks = this.tasks.filter(t => t.status === 'todo');
            const inProgressTasks = this.tasks.filter(t => t.status === 'in-progress');
            const doneTasks = this.tasks.filter(t => t.status === 'done');

            const sections = [
                { title: '📌 A Fazer', tasks: todoTasks },
                { title: '⚙️ Em Andamento', tasks: inProgressTasks },
                { title: '✓ Concluídas', tasks: doneTasks }
            ];

            sections.forEach(section => {
                if (section.tasks.length === 0) return;

                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'tasks-list-section';

                const title = document.createElement('div');
                title.className = 'tasks-list-title';
                title.textContent = section.title;
                sectionDiv.appendChild(title);

                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'tasks-items';

                section.tasks.forEach(task => {
                    const item = document.createElement('div');
                    item.className = `task-full-item ${task.status === 'done' ? 'done' : ''}`;

                    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                    const today = new Date();
                    const isOverdue = dueDate && dueDate < today && task.status !== 'done';
                    const dueDateStr = dueDate ? this.formatDate(dueDate) : 'Sem prazo';

                    item.innerHTML = `
                        <div class="task-full-checkbox ${task.status === 'done' ? 'checked' : ''}" data-task-id="${task.id}"></div>
                        <div class="task-full-details">
                            <div class="task-full-title">${task.title}</div>
                            <div class="task-full-meta">
                                <div class="task-full-status ${task.status}">
                                    ${this.getStatusLabel(task.status)}
                                </div>
                                <div class="task-full-duedate ${isOverdue ? 'overdue' : ''}">
                                    📅 ${dueDateStr} ${isOverdue ? '⚠️ Atrasada' : ''}
                                </div>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="task-delete-btn" data-task-id="${task.id}" title="Deletar">🗑️</button>
                        </div>
                    `;

                    const checkbox = item.querySelector('.task-full-checkbox');
                    const deleteBtn = item.querySelector('.task-delete-btn');

                    if (checkbox) {
                        checkbox.addEventListener('click', () => {
                            const newStatus = task.status === 'done' ? 'todo' : 'done';
                            this.updateTaskStatus(task.id, newStatus);
                        });
                    }

                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', () => {
                            if (confirm('Tem certeza que quer deletar esta tarefa?')) {
                                this.deleteTask(task.id);
                            }
                        });
                    }

                    itemsDiv.appendChild(item);
                });

                sectionDiv.appendChild(itemsDiv);
                container.appendChild(sectionDiv);
            });
        } catch (error) {
            console.error('Erro ao renderizar lista de tarefas:', error);
        }
    }

    renderPage(page) {
        const pageNames = {
            'ideas': 'Ideias',
            'planning': 'Planejar noturno',
            'stories': 'Seus stories'
        };

        const clone = this.pageTemplate.content.cloneNode(true);
        const pageElement = clone.querySelector('.page');
        pageElement.classList.add('active');
        clone.querySelector('#pageTitle').textContent = pageNames[page] || page;
        this.contentElement.appendChild(clone);
    }

    updateDate() {
        const today = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        const dateString = today.toLocaleDateString('pt-BR', options);
        const dateElement = document.getElementById('dateDisplay');
        if (dateElement) {
            dateElement.textContent = `📅 ${dateString}`;
        }
    }

    /* ===== TASK MANAGEMENT ===== */
    
    formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }

    getStatusLabel(status) {
        const labels = {
            'todo': '📌 A Fazer',
            'in-progress': '⚙️ Em Andamento',
            'done': '✓ Concluída'
        };
        return labels[status] || status;
    }

    generateFakeAgenda() {
        return [
            {
                icon: '👩‍⚕️',
                time: '09:00 AM',
                title: 'Consulta - Maria Silva',
                location: 'Consultório, Porto Alegre'
            },
            {
                icon: '👩‍⚕️',
                time: '10:30 AM',
                title: 'Consulta - João Santos',
                location: 'Consultório, Porto Alegre'
            },
            {
                icon: '📹',
                time: '02:00 PM',
                title: 'Gravação de conteúdo',
                location: 'Casa'
            }
        ];
    }

    initSequenceBank() {
        this.sequenceBank = {
            conexao: [
                { objetivo: 'Conexão · Lifestyle', o_que_mostrar: 'Café da manhã, caminho pro consultório', texto_tela: 'Sexta-feira chegou. Dia de conteúdo novo e histórias novas.', o_que_falar: 'Algo leve sobre como está o dia' },
                { objetivo: 'Bastidor clínico', o_que_mostrar: 'Caderno, computador, diário alimentar', texto_tela: 'Revisando cardápios antes das consultas. Cada paciente tem uma história diferente.', o_que_falar: 'Mostrar que você se prepara com cuidado' },
                { objetivo: 'Gancho · Dor', o_que_mostrar: 'Você de frente, expressão curiosa', texto_tela: 'Você sabe quantos gramas de fibra você come por dia? (A maioria consome menos da metade do ideal)', o_que_falar: 'Deixar a pergunta no ar, sem responder ainda' },
                { objetivo: 'Educação leve', o_que_mostrar: 'Foto de feijão, aveia, fruta', texto_tela: 'Esses 3 alimentos juntos já entregam sua meta diária de fibra. Sem suplemento.', o_que_falar: 'Falar sobre o quanto é simples quando se sabe o que olhar' },
                { objetivo: 'Autoridade clínica', o_que_mostrar: 'Você falando de frente, tom seguro', texto_tela: 'Ontem uma paciente tomava 3 suplementos de fibra mas não comia feijão há semanas.', o_que_falar: 'Contar que foi exatamente isso que vocês resolveram juntas' },
                { objetivo: 'Interação', o_que_mostrar: 'Enquete simples', texto_tela: 'Você acha que come fibra suficiente? ✅ Sim · ❌ Provavelmente não', o_que_falar: 'Pedir pra votar e dizer que vai responder quem votar não' },
                { objetivo: 'Posicionamento', o_que_mostrar: 'Você de frente, fundo limpo', texto_tela: 'Nutrição que funciona não é a mais restritiva. É a que você consegue manter.', o_que_falar: 'Falar sobre resultado sustentável vs ciclos de dieta' },
                { objetivo: 'CTA suave', o_que_mostrar: 'Você sorrindo, tom leve', texto_tela: 'Se você votou "provavelmente não", me conta no direct. Pode ser mais simples do que você imagina.', o_que_falar: 'Abrir a porta pra conversa — sem pressão' }
            ],
            venda: [
                { objetivo: 'Conexão', o_que_mostrar: 'Seu dia começando', texto_tela: 'Essa é uma semana importante pra resolver isso de uma vez.', o_que_falar: 'Tom seguro, confiante' },
                { objetivo: 'Bastidor', o_que_mostrar: 'Você preparando a consulta', texto_tela: 'Consultório pronto, agenda cheia, pacientes com histórias reais de transformação.', o_que_falar: 'Mostrar dedicação' },
                { objetivo: 'Prova Social', o_que_mostrar: 'Foto de sucesso de paciente (sem identificação)', texto_tela: 'Essa paciente passou de 2 a 8 consultas por mês porque os resultados falavam por si.', o_que_falar: 'Compartilhar transformação real' },
                { objetivo: 'Educação', o_que_mostrar: 'Infográfico ou foto simples', texto_tela: 'Não é só reduzir calorias. É mudar hábitos.', o_que_falar: 'Explicar método' },
                { objetivo: 'Objeção', o_que_mostrar: 'Você respondendo', texto_tela: 'Consultoria é cara? Sim. Ficar na mesma por 5 anos é mais caro ainda.', o_que_falar: 'Quebrar resistência' },
                { objetivo: 'Interação', o_que_mostrar: 'Enquete de confiança', texto_tela: 'Você confia em nutricionista ou acha que é só dieta?', o_que_falar: 'Gerar engajamento' },
                { objetivo: 'Depoimento', o_que_mostrar: 'Você falando com segurança', texto_tela: 'A melhor decisão que você pode tomar hoje é começar a trabalhar comigo.', o_que_falar: 'Tom direto e seguro' },
                { objetivo: 'CTA forte', o_que_mostrar: 'Link nos stories ou convite', texto_tela: 'Vagas abertas pra consultoria este mês. Me chama no direct!', o_que_falar: 'Criar urgência sem pressão' }
            ],
            identificacao: [
                { objetivo: 'Diagnóstico', o_que_mostrar: 'Você reflexiva', texto_tela: 'Qual é o seu maior problema com alimentação?', o_que_falar: 'Fazer 3-4 perguntas diferentes' },
                { objetivo: 'Bastidor', o_que_mostrar: 'Sala de atendimento', texto_tela: 'Aqui a gente descobre qual é realmente o problema. Dica: nem sempre é o que a gente pensa.', o_que_falar: 'Criar curiosidade' },
                { objetivo: 'Identificação', o_que_mostrar: 'Você apontando algo', texto_tela: 'Você também sofre com [problema específico]? Eu identifiquei exatamente isso em 3 pacientes essa semana.', o_que_falar: 'Conectar emocionalmente' },
                { objetivo: 'Educação', o_que_mostrar: 'Foto do problema', texto_tela: 'O que causa [problema] é geralmente o oposto do que tentamos fazer.', o_que_falar: 'Revelar insight' },
                { objetivo: 'Autoridade', o_que_mostrar: 'Você confiante', texto_tela: 'Eu vejo isso 10x por semana e tem uma solução que funciona.', o_que_falar: 'Reforçar experiência' },
                { objetivo: 'Validação', o_que_mostrar: 'Você empatizando', texto_tela: 'Você não é fraco. Você só tava seguindo a receita errada.', o_que_falar: 'Desculpabilizar' },
                { objetivo: 'Solução', o_que_mostrar: 'Você mostrando o caminho', texto_tela: 'Aqui é onde a gente muda a abordagem completamente.', o_que_falar: 'Oferecer esperança' },
                { objetivo: 'CTA', o_que_mostrar: 'Você no direct', texto_tela: 'Quer descobrir exatamente o que te bloqueia? Chama no direct.', o_que_falar: 'Convidando pra conversa profunda' }
            ],
            ensinamento: [
                { objetivo: 'Abertura', o_que_mostrar: 'Você pegando em algo', texto_tela: 'Vou te mostrar exatamente por que a maioria falha em emagrecimento.', o_que_falar: 'Criar expectativa' },
                { objetivo: 'Contexto', o_que_mostrar: 'Seu dia, seu consultório', texto_tela: 'Estudei nutrição por 10 anos e descobri algo que ninguém ensina.', o_que_falar: 'Validar experiência' },
                { objetivo: 'Conceito 1', o_que_mostrar: 'Infográfico ou você explicando', texto_tela: 'Primeiro: o corpo não entende calorias. Entende sinais.', o_que_falar: 'Explicar primeiro conceito' },
                { objetivo: 'Conceito 2', o_que_mostrar: 'Exemplo prático', texto_tela: 'Segundo: você só muda hábito quando resolve o gatilho emocional.', o_que_falar: 'Segundo conceito' },
                { objetivo: 'Conceito 3', o_que_mostrar: 'Aplicação real', texto_tela: 'Terceiro: resultado vem depois que você muda a mentalidade.', o_que_falar: 'Terceiro conceito' },
                { objetivo: 'Validação', o_que_mostrar: 'Depoimento visual', texto_tela: 'Isso funcionou com 200+ pacientes. Vai funcionar com você também.', o_que_falar: 'Comprovar com social proof' },
                { objetivo: 'Aplicação', o_que_mostrar: 'Você mostrando ferramenta', texto_tela: 'Quer aprender isso passo a passo? Tem um método que funciona.', o_que_falar: 'Introduzir método' },
                { objetivo: 'CTA', o_que_mostrar: 'Você convitando', texto_tela: 'Esse conhecimento te espera. Vem pra cá aprender.', o_que_falar: 'Chamar pra ação educacional' }
            ]
        };
    }

    loadTrendingTopics() {
        const cached = localStorage.getItem('nutrirotina_feed');
        const cacheDate = localStorage.getItem('nutrirotina_feed_date');
        const today = this.getTodayDateString();

        // Se tiver cache de hoje, usa ele
        if (cached && cacheDate === today) {
            try {
                this.trendingTopics = JSON.parse(cached);
                console.log('📰 Feed carregado do cache');
                return;
            } catch (e) {
                console.error('Erro ao parsear cache:', e);
            }
        }

        // Busca da API NewsAPI
        const apiKey = 'aa0eba3d4dc54ae4814dbe850b43bb38';
        const query = 'emagrecimento OR Ozempic OR Monjaro OR intestino OR microbioma OR nutrição OR estilo de vida OR metabolismo OR digestão';
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=pt&pageSize=6&apiKey=${apiKey}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.articles && data.articles.length > 0) {
                    this.trendingTopics = data.articles.slice(0, 6).map((article, idx) => ({
                        icon: ['📰', '🔬', '💡', '🎯', '📊', '✨'][idx] || '📰',
                        name: article.title,
                        pauta: article.title,
                        description: article.description || article.content || article.title,
                        example: `"${(article.title || '').substring(0, 80)}..."`,
                        tag: 'Trending'
                    }));

                    // Salva no cache
                    localStorage.setItem('nutrirotina_feed', JSON.stringify(this.trendingTopics));
                    localStorage.setItem('nutrirotina_feed_date', today);
                    console.log('📰 Feed atualizado da API:', this.trendingTopics.length, 'artigos');
                } else {
                    console.warn('Nenhum artigo retornado da API');
                    this.trendingTopics = [...this.trendingTopicsFallback];
                }
            })
            .catch(err => {
                console.error('❌ Erro ao carregar feed:', err.message);
                this.trendingTopics = [...this.trendingTopicsFallback];
            });
    }

    loadTasks() {
        const stored = localStorage.getItem('nutrirotina_tasks');
        return stored ? JSON.parse(stored) : [
            {
                id: 1,
                title: 'Gravar story sobre proteína',
                status: 'todo',
                dueDate: this.getTodayDateString(),
                date: this.getTodayDateString()
            },
            {
                id: 2,
                title: 'Responder mensagens dos clientes',
                status: 'in-progress',
                dueDate: this.getTodayDateString(),
                date: this.getTodayDateString()
            },
            {
                id: 3,
                title: 'Editar vídeo da semana',
                status: 'todo',
                dueDate: this.getDateString(1),
                date: this.getTodayDateString()
            }
        ];
    }

    saveTasks() {
        localStorage.setItem('nutrirotina_tasks', JSON.stringify(this.tasks));
    }

    addTask(title, dueDate) {
        const newTask = {
            id: Date.now(),
            title: title,
            status: 'todo',
            dueDate: dueDate || '',
            date: this.getTodayDateString()
        };
        this.tasks.unshift(newTask);
        this.saveTasks();
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            this.saveTasks();
            
            // Re-renderiza a página atual
            if (this.currentPage === 'home') {
                this.renderHomeTasks();
            } else if (this.currentPage === 'tasks') {
                this.renderTasksPageList();
            }
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasksPageList();
    }

    /* ===== IDEAS PAGE ===== */
    renderIdeasPage() {
        try {
            const clone = this.ideasPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-ideas');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            const addIdeaBtn = this.contentElement.querySelector('#addIdeaBtn');
            const newIdeaInput = this.contentElement.querySelector('#newIdeaInput');

            if (!addIdeaBtn || !newIdeaInput) {
                console.error('Elementos do formulário de ideias não encontrados');
                return;
            }

            addIdeaBtn.addEventListener('click', () => {
                const text = newIdeaInput.value.trim();
                if (text) {
                    this.addIdea(text);
                    newIdeaInput.value = '';
                    this.renderIdeasList();
                    newIdeaInput.focus();
                }
            });

            newIdeaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    addIdeaBtn.click();
                }
            });

            this.renderIdeasList();
        } catch (error) {
            console.error('Erro ao renderizar página de ideias:', error);
        }
    }

    renderIdeasList() {
        try {
            const container = this.contentElement.querySelector('#ideas-list-container');
            if (!container) {
                console.error('Container de ideias não encontrado');
                return;
            }

            container.innerHTML = '';

            if (this.ideas.length === 0) {
                container.innerHTML = '<div class="placeholder-text">Nenhuma ideia cadastrada ainda. Comece a capturar! 💡</div>';
                return;
            }

            const ideasList = document.createElement('div');
            ideasList.className = 'ideas-list-section';

            this.ideas.forEach(idea => {
                const item = document.createElement('div');
                item.className = `idea-item ${idea.status === 'usada' ? 'used' : ''}`;

                const createdDate = new Date(idea.createdAt);
                const dateStr = this.formatDate(createdDate);

                item.innerHTML = `
                    <div class="idea-details">
                        <div class="idea-text">${idea.text}</div>
                        <div class="idea-meta">
                            <div class="idea-date">📅 ${dateStr}</div>
                            <div class="idea-status ${idea.status}">
                                ${idea.status === 'nova' ? '✨ Nova' : '✓ Usada'}
                            </div>
                        </div>
                    </div>
                    <div class="idea-actions">
                        <button class="idea-draft-btn" data-idea-id="${idea.id}" title="Gerar rascunho">📝</button>
                        <button class="idea-delete-btn" data-idea-id="${idea.id}" title="Deletar">🗑️</button>
                    </div>
                `;

                const draftBtn = item.querySelector('.idea-draft-btn');
                const deleteBtn = item.querySelector('.idea-delete-btn');

                draftBtn.addEventListener('click', () => {
                    const draft = this.generateContentDraft(idea.text, 'educacao');
                    draftBtn.textContent = '✓';
                    draftBtn.disabled = true;
                    setTimeout(() => {
                        this.navigateTo(`draft-${draft.id}`);
                    }, 300);
                });

                deleteBtn.addEventListener('click', () => {
                    if (confirm('Tem certeza que quer deletar esta ideia?')) {
                        this.deleteIdea(idea.id);
                    }
                });

                ideasList.appendChild(item);
            });

            container.appendChild(ideasList);
        } catch (error) {
            console.error('Erro ao renderizar lista de ideias:', error);
        }
    }

    loadIdeas() {
        const stored = localStorage.getItem('nutrirotina_ideas');
        return stored ? JSON.parse(stored) : [];
    }

    saveIdeas() {
        localStorage.setItem('nutrirotina_ideas', JSON.stringify(this.ideas));
    }

    addIdea(text) {
        const newIdea = {
            id: Date.now(),
            text: text,
            status: 'nova',
            createdAt: new Date().toISOString()
        };
        this.ideas.unshift(newIdea);
        this.saveIdeas();
    }

    deleteIdea(ideaId) {
        this.ideas = this.ideas.filter(i => i.id !== ideaId);
        this.saveIdeas();
        this.renderIdeasList();
    }

    /* ===== FEED PAGE ===== */
    renderFeedPage() {
        try {
            const clone = this.feedPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-feed');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            this.renderFeedItems();
        } catch (error) {
            console.error('Erro ao renderizar página de feed:', error);
        }
    }

    renderFeedItems() {
        try {
            const container = this.contentElement.querySelector('#feed-container');
            container.innerHTML = '';

            this.trendingTopics.forEach((topic, index) => {
                const feedItem = document.createElement('div');
                feedItem.className = 'feed-item';

                feedItem.innerHTML = `
                    <div class="feed-header">
                        <div class="feed-icon">${topic.icon}</div>
                        <div class="feed-topic">
                            <div class="feed-topic-name">${topic.name}</div>
                            <span class="feed-topic-tag">🔥 ${topic.tag}</span>
                        </div>
                    </div>
                    <div class="feed-pauta">
                        <div class="feed-pauta-title">📋 Pauta pronta:</div>
                        <div class="feed-pauta-text">${topic.description}</div>
                        <div class="feed-pauta-example">Exemplo de abertura: ${topic.example}</div>
                    </div>
                    <div class="feed-actions">
                        <button class="feed-save-btn" data-topic-index="${index}">
                            💾 Salvar como ideia
                        </button>
                        <button class="feed-draft-btn" data-topic-index="${index}">
                            📝 Gerar rascunho
                        </button>
                    </div>
                `;

                const saveBtn = feedItem.querySelector('.feed-save-btn');
                const draftBtn = feedItem.querySelector('.feed-draft-btn');

                saveBtn.addEventListener('click', () => {
                    const ideaText = `${topic.name}: ${topic.description}`;
                    this.addIdea(ideaText);

                    saveBtn.textContent = '✓ Salvo!';
                    saveBtn.classList.add('saved');
                    saveBtn.disabled = true;

                    setTimeout(() => {
                        saveBtn.textContent = '💾 Salvar como ideia';
                        saveBtn.classList.remove('saved');
                        saveBtn.disabled = false;
                    }, 2000);
                });

                draftBtn.addEventListener('click', () => {
                    const draft = this.generateContentDraft(topic.name, 'educacao');
                    draftBtn.textContent = '✓ Rascunho gerado!';
                    draftBtn.disabled = true;
                    setTimeout(() => {
                        this.navigateTo(`draft-${draft.id}`);
                    }, 500);
                });

                container.appendChild(feedItem);
            });
        } catch (error) {
            console.error('Erro ao renderizar itens do feed:', error);
        }
    }

    /* ===== LIFESTYLE CONTENT PAGE ===== */
    renderLifestylePage() {
        try {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page active';
            pageDiv.innerHTML = `
                <div class="page-header">
                    <h2>🎬 Content Lifestyle</h2>
                    <p class="page-subtitle">Ideias prontas baseadas no seu dia</p>
                </div>
                <div id="lifestyle-content"></div>
            `;
            this.contentElement.appendChild(pageDiv);

            const contentContainer = pageDiv.querySelector('#lifestyle-content');

            const tomorrow = this.getDateString(1);
            const todayPlanning = this.plannings.find(p => p.date === tomorrow);

            if (!todayPlanning) {
                contentContainer.innerHTML = '<div class="placeholder-text">Planeje seu dia para ver sugestões de Lifestyle Content 📅</div>';
                return;
            }

            const suggestions = this.generateLifestyleContent(todayPlanning);

            if (suggestions.length === 0) {
                contentContainer.innerHTML = '<div class="placeholder-text">Nenhuma sugestão de content para amanhã 🤷</div>';
                return;
            }

            let html = `
                <div style="padding: 20px 0;">
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                        📍 ${todayPlanning.local} · 👩‍⚕️ ${todayPlanning.consultas} consultas · 🏃 ${todayPlanning.exerciseTime}
                    </p>
            `;

            suggestions.forEach((suggestion, idx) => {
                html += `
                    <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 4px;">${suggestion.titulo}</div>
                            <div style="font-size: 12px; color: #e88ba3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${suggestion.categoria}</div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px;">📸 O que mostrar</div>
                            <div style="font-size: 14px; color: #333; line-height: 1.5;">${suggestion.o_que_mostrar}</div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px;">🎤 O que falar</div>
                            <div style="font-size: 14px; color: #333; line-height: 1.6; padding: 12px; background: #f9f9f9; border-left: 3px solid #e88ba3; border-radius: 4px;">
                                "${suggestion.o_que_falar}"
                            </div>
                        </div>

                        <div style="font-size: 12px; color: #999;">
                            🎯 Objetivo: ${suggestion.objetivo}
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            contentContainer.innerHTML = html;

        } catch (error) {
            console.error('Erro ao renderizar página de lifestyle:', error);
        }
    }

    /* ===== DRAFT PAGES ===== */
    renderDraftsListPage() {
        try {
            const clone = this.draftsListTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-drafts');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            this.renderDraftsList();
        } catch (error) {
            console.error('Erro ao renderizar página de rascunhos:', error);
        }
    }

    renderDraftsList() {
        try {
            const container = this.contentElement.querySelector('#drafts-list-container');
            if (!container) return;

            container.innerHTML = '';

            if (this.drafts.length === 0) {
                container.innerHTML = '<div class="placeholder-text">Nenhum rascunho gerado ainda. Gera um a partir do Feed ou das Ideias! 💡</div>';
                return;
            }

            this.drafts.forEach(draft => {
                const item = document.createElement('div');
                item.className = 'draft-item';

                const criadoEm = new Date(draft.criadoEm);
                const dateStr = this.formatDate(criadoEm);

                item.innerHTML = `
                    <div class="draft-header">
                        <div class="draft-title">${draft.roteiro.titulo}</div>
                        <div class="draft-type">${draft.tipo}</div>
                    </div>
                    <div class="draft-meta">
                        <div class="draft-tema">🎯 ${draft.tema}</div>
                        <div class="draft-date">📅 ${dateStr}</div>
                    </div>
                    <div class="draft-actions">
                        <button class="draft-btn open" data-draft-id="${draft.id}">✏️ Editar</button>
                        <button class="draft-btn delete" data-draft-id="${draft.id}">🗑️ Deletar</button>
                    </div>
                `;

                const openBtn = item.querySelector('.open');
                const deleteBtn = item.querySelector('.delete');

                openBtn.addEventListener('click', () => {
                    this.navigateTo(`draft-${draft.id}`);
                });

                deleteBtn.addEventListener('click', () => {
                    if (confirm('Tem certeza que quer deletar este rascunho?')) {
                        this.deleteDraft(draft.id);
                    }
                });

                container.appendChild(item);
            });
        } catch (error) {
            console.error('Erro ao renderizar lista de rascunhos:', error);
        }
    }

    renderDraftPage(draftId) {
        try {
            const draft = this.drafts.find(d => d.id === draftId);
            if (!draft) {
                this.navigateTo('drafts');
                return;
            }

            const clone = this.draftPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-draft');
            pageElement.classList.add('active');

            const subtitle = clone.querySelector('.page-subtitle');
            subtitle.textContent = `${draft.tema} · Tipo: ${draft.tipo}`;

            this.contentElement.appendChild(clone);

            const content = this.contentElement.querySelector('#draft-content');
            this.renderDraftContent(content, draft);
        } catch (error) {
            console.error('Erro ao renderizar página de rascunho:', error);
        }
    }

    renderDraftContent(container, draft) {
        const r = draft.roteiro;

        let html = `
            <div class="draft-workspace">

                <!-- SEÇÃO: Título e Capa -->
                <div class="draft-section">
                    <div class="draft-section-title">🎬 Título e Capa</div>
                    <div class="draft-field">
                        <label>Título do Vídeo</label>
                        <input type="text" class="draft-input" value="${r.titulo}" data-field="titulo" />
                    </div>
                    <div class="draft-field">
                        <label>Frase de Impacto (Capa)</label>
                        <input type="text" class="draft-input" value="${r.capa}" data-field="capa" />
                    </div>
                </div>

                <!-- SEÇÃO: Timeline -->
                <div class="draft-section">
                    <div class="draft-section-title">⏱️ Roteiro do Vídeo (Timeline)</div>
                    <div id="draft-timeline-container">
                        ${r.timeline.map((item, idx) => `
                            <div class="draft-timeline-item">
                                <div class="timeline-header">
                                    <span class="timeline-time">${item.tempo}</span>
                                    <span class="timeline-secao">${item.secao}</span>
                                </div>
                                <textarea class="draft-textarea" data-field="timeline" data-index="${idx}">${item.conteudo}</textarea>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- SEÇÃO: CTA do Vídeo -->
                <div class="draft-section">
                    <div class="draft-section-title">📢 Chamada para Ação (Vídeo)</div>
                    <div class="draft-field">
                        <textarea class="draft-textarea" data-field="ctaVideo">${r.ctaVideo}</textarea>
                    </div>
                </div>

                <!-- SEÇÃO: Legenda Instagram -->
                <div class="draft-section">
                    <div class="draft-section-title">📱 Legenda do Instagram</div>
                    <div class="draft-field">
                        <textarea class="draft-textarea large" data-field="legendaInstagram">${r.legendaInstagram}</textarea>
                    </div>
                </div>

                <!-- SEÇÃO: Stories de Divulgação -->
                <div class="draft-section">
                    <div class="draft-section-title">✨ Stories de Divulgação</div>
                    <div id="draft-stories-container">
                        ${r.stories.map((story, idx) => `
                            <div class="draft-story-item">
                                <div class="story-header-draft">
                                    <span class="story-num-draft">${story.numero}</span>
                                </div>
                                <textarea class="draft-textarea" data-field="stories" data-index="${idx}">${story.o_que_falar}</textarea>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- SEÇÃO: Estratégia de Viralização -->
                <div class="draft-section">
                    <div class="draft-section-title">🔥 Estratégia de Viralização</div>
                    <div class="draft-field">
                        <label>Potencial de Viralização (0-10)</label>
                        <input type="number" class="draft-input" value="${r.viralizacao.potencial}" data-field="potencial" min="0" max="10" />
                    </div>
                    <div class="draft-field">
                        <label>Gatilho Emocional</label>
                        <input type="text" class="draft-input" value="${r.viralizacao.gatilho}" data-field="gatilho" />
                    </div>
                    <div class="draft-field">
                        <label>Frase com Maior Chance de Retenção</label>
                        <textarea class="draft-textarea" data-field="fraseRetencao">${r.viralizacao.fraseRetencao}</textarea>
                    </div>
                    <div class="draft-field">
                        <label>Trecho Mais Compartilhável</label>
                        <textarea class="draft-textarea" data-field="compartilhavel">${r.viralizacao.compartilhavel}</textarea>
                    </div>
                    <div class="draft-field">
                        <label>Possíveis Riscos</label>
                        <textarea class="draft-textarea" data-field="riscos">${r.viralizacao.riscos}</textarea>
                    </div>
                    <div class="draft-field">
                        <label>Como Melhorar</label>
                        <textarea class="draft-textarea" data-field="melhorias">${r.viralizacao.melhorias}</textarea>
                    </div>
                </div>

                <!-- BOTÕES DE AÇÃO -->
                <div class="draft-actions-footer">
                    <button class="btn btn-primary" id="saveDraftBtn">💾 Salvar Alterações</button>
                    <button class="btn btn-secondary" id="backToDraftsBtn">← Voltar</button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Listeners para edição
        container.querySelectorAll('.draft-input, .draft-textarea').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateDraftField(draft.id, e.target);
            });
        });

        container.querySelector('#saveDraftBtn').addEventListener('click', () => {
            alert('Rascunho salvo! 💾');
        });

        container.querySelector('#backToDraftsBtn').addEventListener('click', () => {
            this.navigateTo('drafts');
        });
    }

    updateDraftField(draftId, input) {
        const draft = this.drafts.find(d => d.id === draftId);
        if (!draft) return;

        const field = input.dataset.field;
        const value = input.value;
        const index = input.dataset.index;

        if (field === 'titulo') draft.roteiro.titulo = value;
        else if (field === 'capa') draft.roteiro.capa = value;
        else if (field === 'ctaVideo') draft.roteiro.ctaVideo = value;
        else if (field === 'legendaInstagram') draft.roteiro.legendaInstagram = value;
        else if (field === 'timeline' && index !== undefined) draft.roteiro.timeline[parseInt(index)].conteudo = value;
        else if (field === 'stories' && index !== undefined) draft.roteiro.stories[parseInt(index)].o_que_falar = value;
        else if (field === 'potencial') draft.roteiro.viralizacao.potencial = parseInt(value);
        else if (field === 'gatilho') draft.roteiro.viralizacao.gatilho = value;
        else if (field === 'fraseRetencao') draft.roteiro.viralizacao.fraseRetencao = value;
        else if (field === 'compartilhavel') draft.roteiro.viralizacao.compartilhavel = value;
        else if (field === 'riscos') draft.roteiro.viralizacao.riscos = value;
        else if (field === 'melhorias') draft.roteiro.viralizacao.melhorias = value;

        this.saveDrafts();
    }

    deleteDraft(draftId) {
        this.drafts = this.drafts.filter(d => d.id !== draftId);
        this.saveDrafts();
        this.renderDraftsList();
    }

    /* ===== PLANNING & STORIES PAGES ===== */
    renderPlanningPage() {
        try {
            const clone = this.planningPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-planning');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            // Renderizar pendentes primeiro
            const today = this.getTodayDateString();
            const pageHeader = this.contentElement.querySelector('.page-header');

            const pendingTasks = this.tasks.filter(t => t.date === today && !t.completed);
            const pendingIdeas = this.ideas.filter(i => i.date === today && !i.used);

            if (pendingTasks.length > 0 || pendingIdeas.length > 0) {
                const pendingSection = document.createElement('div');
                pendingSection.className = 'pending-section';
                pendingSection.innerHTML = `
                    <div class="pending-header">
                        <h3>⚠️ Você tem pendências</h3>
                        <p>O que fazer com esses itens?</p>
                    </div>
                    <div id="pending-items-container"></div>
                `;

                pageHeader.parentElement.insertBefore(pendingSection, pageHeader.nextElementSibling);

                const pendingContainer = this.contentElement.querySelector('#pending-items-container');

                pendingTasks.forEach(task => {
                    const item = document.createElement('div');
                    item.className = 'pending-item';
                    item.innerHTML = `
                        <div class="pending-item-content">
                            <span class="pending-icon">📝</span>
                            <span class="pending-text">${task.text}</span>
                        </div>
                        <div class="pending-actions">
                            <button class="pending-btn-keep" data-type="task" data-id="${task.id}" title="Levar para amanhã">
                                ➜ Amanhã
                            </button>
                            <button class="pending-btn-discard" data-type="task" data-id="${task.id}" title="Descartar">
                                ✕ Descartar
                            </button>
                        </div>
                    `;
                    pendingContainer.appendChild(item);
                });

                pendingIdeas.forEach(idea => {
                    const item = document.createElement('div');
                    item.className = 'pending-item';
                    item.innerHTML = `
                        <div class="pending-item-content">
                            <span class="pending-icon">💭</span>
                            <span class="pending-text">${idea.text}</span>
                        </div>
                        <div class="pending-actions">
                            <button class="pending-btn-keep" data-type="idea" data-id="${idea.id}" title="Levar para amanhã">
                                ➜ Amanhã
                            </button>
                            <button class="pending-btn-discard" data-type="idea" data-id="${idea.id}" title="Descartar">
                                ✕ Descartar
                            </button>
                        </div>
                    `;
                    pendingContainer.appendChild(item);
                });

                // Event listeners para pendentes
                pendingContainer.querySelectorAll('.pending-btn-keep').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const type = e.currentTarget.dataset.type;
                        const id = e.currentTarget.dataset.id;
                        const tomorrow = this.getDateString(1);

                        if (type === 'task') {
                            const task = this.tasks.find(t => t.id == id);
                            if (task) task.date = tomorrow;
                            this.saveTasks();
                        } else if (type === 'idea') {
                            const idea = this.ideas.find(i => i.id == id);
                            if (idea) idea.date = tomorrow;
                            this.saveIdeas();
                        }

                        e.currentTarget.parentElement.parentElement.remove();
                    });
                });

                pendingContainer.querySelectorAll('.pending-btn-discard').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const type = e.currentTarget.dataset.type;
                        const id = e.currentTarget.dataset.id;

                        if (type === 'task') {
                            this.tasks = this.tasks.filter(t => t.id != id);
                            this.saveTasks();
                        } else if (type === 'idea') {
                            this.ideas = this.ideas.filter(i => i.id != id);
                            this.saveIdeas();
                        }

                        e.currentTarget.parentElement.parentElement.remove();
                    });
                });
            }

            const planBtn = this.contentElement.querySelector('#planBtn');
            const localSelect = this.contentElement.querySelector('#planningLocal');
            const typeSelect = this.contentElement.querySelector('#planningType');
            const themeInput = this.contentElement.querySelector('#planningTheme');
            const consultasInput = this.contentElement.querySelector('#planningConsultas');
            const minusBtn = this.contentElement.querySelector('#minusBtn');
            const plusBtn = this.contentElement.querySelector('#plusBtn');
            const exerciseTimeInput = this.contentElement.querySelector('#planningExerciseTime');
            const notesInput = this.contentElement.querySelector('#planningNotes');

            if (!planBtn || !localSelect) {
                console.error('Elementos do formulário de planejamento não encontrados');
                return;
            }

            minusBtn.addEventListener('click', () => {
                const current = parseInt(consultasInput.value);
                if (current > 0) consultasInput.value = current - 1;
            });

            plusBtn.addEventListener('click', () => {
                const current = parseInt(consultasInput.value);
                if (current < 10) consultasInput.value = current + 1;
            });

            planBtn.addEventListener('click', () => {
                const local = localSelect.value;
                const type = typeSelect?.value || 'conexao';
                const theme = themeInput?.value.trim() || '';
                const consultas = parseInt(consultasInput.value);
                const exerciseTime = exerciseTimeInput.value;
                const notes = notesInput.value.trim();

                if (!local || !exerciseTime) {
                    alert('Por favor, preencha local e horário do exercício');
                    return;
                }

                this.addPlanning(local, consultas, exerciseTime, notes, type, theme);
                this.generateStoriesRoteiro(local, consultas, exerciseTime, type, theme);

                planBtn.disabled = true;
                planBtn.textContent = '✓ Planejado!';

                const successMsg = this.contentElement.querySelector('#planning-success-message');
                successMsg.style.display = 'block';

                setTimeout(() => {
                    this.navigateTo('stories');
                }, 2000);
            });
        } catch (error) {
            console.error('Erro ao renderizar página de planejamento:', error);
        }
    }

    renderStoriesPage() {
        try {
            const clone = this.storiesPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-stories');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            const todayRoteiro = this.getTodayRoteiro();
            const container = this.contentElement.querySelector('#stories-container');

            if (!todayRoteiro) {
                console.log('Nenhum roteiro encontrado. Procurando por:', this.getTodayDateString());
                console.log('Stories disponíveis:', this.stories);
                if (container) {
                    container.innerHTML = '<div class="placeholder-text">Nenhum roteiro gerado ainda. Planeje seu dia à noite! 🌙</div>';
                }
                return;
            }

            console.log('Roteiro encontrado:', todayRoteiro);
            container.innerHTML = '';

            todayRoteiro.sequences.forEach((seq, index) => {
                const storyDiv = document.createElement('div');
                storyDiv.className = 'story-sequence';

                const originClass = seq.origin.toLowerCase().replace(/\s+/g, '');
                const originEmoji = seq.origin === 'Seu dia' ? '🌞' : seq.origin === 'Trending' ? '🔥' : '📋';

                storyDiv.innerHTML = `
                    <div class="story-header">
                        <div class="story-number">${String(seq.numero).padStart(2, '0')}</div>
                        <div class="story-objective">
                            <div class="story-categoria">${seq.categoria || seq.objetivo}</div>
                            ${seq.titulo ? `<div class="story-titulo">${seq.titulo}</div>` : ''}
                            <div class="story-objective-name">${seq.objetivo}</div>
                        </div>
                    </div>

                    <div class="story-content-section">
                        <div class="story-field">
                            <label class="story-field-label">📸 O que mostrar</label>
                            <div class="story-field-value">${seq.o_que_mostrar}</div>
                        </div>

                        <div class="story-field">
                            <label class="story-field-label">📝 Texto na tela</label>
                            <div class="story-field-value story-text">${seq.texto_tela}</div>
                        </div>

                        <div class="story-field">
                            <label class="story-field-label">🎤 O que falar</label>
                            <div class="story-field-value">${seq.o_que_falar}</div>
                        </div>
                    </div>

                    <div class="story-origin ${originClass}">
                        ${originEmoji} ${seq.origin}
                    </div>

                    <div class="story-actions">
                        <button class="story-btn posted" data-seq-index="${index}">✅ Postei</button>
                        <button class="story-btn not-posted" data-seq-index="${index}">❌ Não postei</button>
                    </div>
                    <div class="story-reason" data-seq-index="${index}">
                        <textarea placeholder="Por que não postou?" class="reason-input"></textarea>
                    </div>
                `;

                const postedBtn = storyDiv.querySelector('.posted');
                const notPostedBtn = storyDiv.querySelector('.not-posted');
                const reasonDiv = storyDiv.querySelector('.story-reason');
                const reasonInput = storyDiv.querySelector('.reason-input');

                postedBtn.addEventListener('click', () => {
                    this.updateStoryStatus(index, 'postei', '');
                    postedBtn.style.opacity = '0.5';
                    notPostedBtn.style.opacity = '1';
                    reasonDiv.classList.remove('show');
                });

                notPostedBtn.addEventListener('click', () => {
                    reasonDiv.classList.add('show');
                    notPostedBtn.style.opacity = '0.5';
                    postedBtn.style.opacity = '1';
                });

                container.appendChild(storyDiv);
            });
        } catch (error) {
            console.error('Erro ao renderizar página de stories:', error);
        }
    }

    generateLifestyleContent(planning) {
        const { local, consultas, exerciseTime, notes, type, theme } = planning;
        const [hours] = exerciseTime.split(':');
        const exerciseHour = parseInt(hours);
        const isMorning = exerciseHour < 12;

        const suggestions = [];

        // 1. Rotina matinal (se exercício de manhã ou antes das consultas)
        if (isMorning || local === 'casa') {
            suggestions.push({
                titulo: '🌅 Rotina Matinal',
                categoria: 'Lifestyle · Bastidor',
                o_que_mostrar: 'Seu café da manhã, preparação, ambiente',
                o_que_falar: `Acordei cedo hoje. Café quentinho, me preparando pro dia. ${theme ? `Hoje o foco é ${theme}.` : ''}`,
                objetivo: 'Humanização + autenticidade',
                tipo: 'lifestyle_morning'
            });
        }

        // 2. Treino / Exercício
        if (exerciseTime) {
            suggestions.push({
                titulo: '💪 Rotina de Treino',
                categoria: 'Lifestyle · Movimento',
                o_que_mostrar: 'Você se exercitando, suor, energia',
                o_que_falar: `Aqui vem meu exercício de ${hours}h. Nada de fancy, só consistência mesmo. Alguns dias é leve, outros é pesado, mas todo dia tem movimento.`,
                objetivo: 'Mostrar hábito, não perfeição',
                tipo: 'lifestyle_exercise'
            });
        }

        // 3. Refeição pós-treino
        if (exerciseTime) {
            suggestions.push({
                titulo: '🍽️ Refeição Pós-Treino',
                categoria: 'Lifestyle · Nutrição',
                o_que_mostrar: 'Seu prato real, direto do blender ou da panela',
                o_que_falar: `Depois do treino vem essa refeição aqui. Proteína, carboidrato, gordura. Balanceado mesmo. Isso que sustenta o resultado.`,
                objetivo: 'Provar que nutrição não é restrição',
                tipo: 'lifestyle_meal'
            });
        }

        // 4. Bastidor do consultório (se tiver consultas)
        if (consultas > 0) {
            const periodoConsultas = isMorning ? 'pela manhã' : 'à tarde';
            suggestions.push({
                titulo: `📋 Bastidor do Consultório (${consultas} consultas)`,
                categoria: 'Lifestyle · Profissional',
                o_que_mostrar: 'Seu desk, agenda, café, pacientes (discretamente)',
                o_que_falar: `${consultas} consultas ${periodoConsultas}. Aqui é onde acontece a magia, sabe? Cada consulta é uma história diferente. Cada pessoa precisa de uma abordagem única.`,
                objetivo: 'Autoridade + empatia',
                tipo: 'lifestyle_work'
            });
        }

        // 5. Snack / Café da tarde (se tiver tempo)
        suggestions.push({
            titulo: '☕ Pausa do Dia',
            categoria: 'Lifestyle · Pausa',
            o_que_mostrar: 'Um café, um snack, você respirando',
            o_que_falar: `Pausa do dia. Café quentinho, um momento pra respirar. Isso também é importante. Não é só trabalho, é equilíbrio.`,
            objetivo: 'Mostrar que você cuida de si mesma',
            tipo: 'lifestyle_pause'
        });

        // 6. Finalização do dia
        suggestions.push({
            titulo: '🌙 Encerramento do Dia',
            categoria: 'Lifestyle · Reflexão',
            o_que_mostrar: 'Você no final do dia, reflexivo, cansado (real)',
            o_que_falar: `Fim de mais um dia. ${consultas > 0 ? `${consultas} histórias de pacientes, ` : ''}${theme ? `focado em ${theme}, ` : ''}movimento, aprendizado. Esses dias que constroem resultado.`,
            objetivo: 'Positividade + realidade',
            tipo: 'lifestyle_closing'
        });

        return suggestions;
    }

    generateStoriesRoteiro(local, consultas, exerciseTime, type = 'conexao', theme = '') {
        const [hours] = exerciseTime.split(':');
        const exerciseHour = parseInt(hours);
        const isMorning = exerciseHour < 12;

        // Banco de stories bem estruturados por tipo
        const storyTemplates = {
            conexao: [
                {
                    numero: 1,
                    categoria: 'Lifestyle · Conexão',
                    titulo: 'Começo de dia real',
                    o_que_mostrar: 'Sua manhã — café, rotina, qualquer coisa autêntica. Não precisa ser perfeita.',
                    texto_tela: 'Bom dia. Que comece esse dia com intenção 🌿',
                    o_que_falar: 'Bom dia! Aqui estou tendo meu café da manhã, começando esse dia com energia. Já tô com fome, né? Acordei cedo e já tô me preparando pra tudo que vem pela frente. Vem comigo nesse dia!',
                    objetivo: 'Gerar identificação e mostrar que você é pessoa real'
                },
                {
                    numero: 2,
                    categoria: 'Bastidor da rotina',
                    titulo: 'Almoço ou refeição do dia',
                    o_que_mostrar: 'Foto ou vídeo rápido do que você está comendo — prato real, não produção.',
                    texto_tela: 'Almoço de nutricionista na vida real 👀',
                    o_que_falar: 'Então galera, almoço de nutricionista é bem assim, tá vendo? Tem proteína, tem vegetais, tem carboidrato. Eu criei esse prato porque sou nutricionista mas também sou pessoa, entendeu? Eu preciso comer de verdade, não é comida de supermercado não. Prato feito em casa, fresquinho, porque eu sou a prova viva de que isso funciona mesmo.',
                    objetivo: 'Mostrar que alimentação saudável é prática e alcançável'
                },
                {
                    numero: 3,
                    categoria: 'Dor · Gancho',
                    titulo: 'A lacuna que você tem',
                    o_que_mostrar: 'Texto em fundo limpo ou você falando pra câmera — sério e direto.',
                    texto_tela: theme ? `O maior medo que vejo no consultório: ${theme}` : 'Algo que ninguém explica direito',
                    o_que_falar: `Sabe o que eu vejo toda semana no consultório? Pessoas que tentam emagrecer sozinhas, fazem tudo certinho, mas não conseguem resultado. E você sabe por quê? Porque falta uma coisa que ninguém explica. Falta exatamente isso ${theme ? 'que estamos falando hoje' : 'que vou revelar nos próximos stories'}. Fica aqui comigo pra descobrir.`,
                    objetivo: 'Criar curiosidade e reter para o próximo story'
                },
                {
                    numero: 4,
                    categoria: 'Educação prática',
                    titulo: 'A verdade que ninguém conta',
                    o_que_mostrar: 'Você falando ou texto animado',
                    texto_tela: 'A maioria faz completamente errado. Mas tem algo tão simples...',
                    o_que_falar: 'Então, a maioria das pessoas que vêm aqui pra mim já tentou de tudo. Dieta da moda, academia, suplemento, tudo. Mas sabe o que ninguém tinha falado pra elas? Que resultado sustentável vem quando você entende como o seu corpo funciona, não quando você sofre. Quando você descobre isso, literalmente tudo muda. A partir daqui você vai vendo a diferença.',
                    objetivo: 'Educar de forma simples e gerar o "eu não sabia disso"'
                },
                {
                    numero: 5,
                    categoria: 'Autoridade clínica',
                    titulo: 'No consultório é diferente',
                    o_que_mostrar: 'Você no consultório, escrevendo, ou foto discreta do ambiente.',
                    texto_tela: 'Aqui no consultório a gente faz diferente. E funciona.',
                    o_que_falar: 'Aqui no consultório é onde a magia acontece, sabe? Porque aqui a gente não só passa informação, a gente acompanha cada detalhe. Cada paciente é diferente, cada corpo é diferente. Essa paciente que você viu ter resultado, ela teve porque a gente personalizou tudo pra ela. Não é fórmula pronta, é estratégia pensada.',
                    objetivo: 'Posicionamento de autoridade sem forçar'
                },
                {
                    numero: 6,
                    categoria: 'Interação',
                    titulo: 'Enquete: Como você faz?',
                    o_que_mostrar: 'Enquete com duas opções',
                    texto_tela: 'Você já tentou fazer isso do jeito que a maioria faz? Sim · Não',
                    o_que_falar: 'Vota aí! Você já tentou fazer desse jeito que a maioria tenta? Quero saber a realidade de vocês. Isso vai me ajudar a entender melhor o que você precisa.',
                    objetivo: 'Aumentar engajamento e entender perfil da audiência'
                },
                {
                    numero: 7,
                    categoria: 'Posicionamento',
                    titulo: 'O que eu acredito',
                    o_que_mostrar: 'Você falando — confiante, sem roteiro formal.',
                    texto_tela: 'Essa transformação não é mágica. É estratégia.',
                    o_que_falar: 'Eu acredito que resultado vem quando você entende o porquê de fazer cada coisa. Não é castigação, não é dieta restritiva que mata de fome. É você aprendendo como funciona e aplicando no seu dia a dia. Quando você faz assim, o resultado é duradouro. É o tipo de coisa que você carrega pro resto da vida.',
                    objetivo: 'Diferenciação. Mostrar seus valores'
                },
                {
                    numero: 8,
                    categoria: 'CTA leve',
                    titulo: 'Convite para conversar',
                    o_que_mostrar: 'Foto sua sorrindo, fundo neutro — acolhedor.',
                    texto_tela: 'Se você quer entender o que está acontecendo — vem falar comigo 💬',
                    o_que_falar: 'Se você quer entender o que está bloqueando você nessa história toda de emagrecimento, meu direct tá aberto. A gente marca uma conversa e eu te ajudo a ver exatamente por onde começar. Sem compromisso, só uma conversa real mesmo.',
                    objetivo: 'Gerar contato direto sem pressão'
                }
            ],
            venda: [
                {
                    numero: 1,
                    categoria: 'Humanização',
                    titulo: 'Começando o dia',
                    o_que_mostrar: 'Seu dia começando de verdade',
                    texto_tela: 'Essa semana é importante pra resolver isso.',
                    o_que_falar: 'Oi pessoal! Aqui é mais um dia de consultório, e hoje eu quero falar sobre algo que vai mudar a sua vida. Muita gente tá achando que é impossível, mas eu já ajudei centenas de pessoas nessa mesma situação. Quer ver como? Fica aqui comigo.',
                    objetivo: 'Gerar identificação desde o início'
                },
                {
                    numero: 2,
                    categoria: 'Bastidor clínico',
                    titulo: 'Antes das consultas',
                    o_que_mostrar: 'Você preparando a consulta',
                    texto_tela: 'Consultório pronto, agenda cheia, pacientes com histórias reais.',
                    o_que_falar: 'Aqui no consultório a gente faz diferente. Cada consulta que você vê ali, é uma história de transformação. Essas pessoas não vieram aqui porque tavam afim só de bater papo. Vieram porque conseguem resultado. E resultado não vem do nada, vem de acompanhamento de verdade.',
                    objetivo: 'Criar percepção de qualidade e profissionalismo'
                },
                {
                    numero: 3,
                    categoria: 'Prova Social',
                    titulo: 'Resultados reais',
                    o_que_mostrar: 'Foto de sucesso (sem identificação)',
                    texto_tela: 'Essa paciente transformou ela mesma quando começou a entender.',
                    o_que_falar: 'Esse resultado que você tá vendo? Não é sorte. Essa paciente entrou aqui do mesmo jeito que você tá agora, e 6 meses depois tá assim. Porque ela teve um plano, teve orientação de verdade, teve acompanhamento. Não foi mágica, foi estratégia.',
                    objetivo: 'Gerar desejo pelo resultado'
                },
                {
                    numero: 4,
                    categoria: 'Educação',
                    titulo: 'Por que não funciona sozinho',
                    o_que_mostrar: 'Infográfico ou você explicando',
                    texto_tela: 'Não é só reduzir calorias. É mudar hábitos.',
                    o_que_falar: 'Você já tentou sozinho, né? Fez dieta, foi na academia, cortou tudo. Mas depois volta igual. Sabe por quê? Porque não é só sobre calorias. É sobre entender por que você come, é sobre mudar hábito, é sobre reeducar seu corpo inteiro. Isso só funciona com ajuda profissional mesmo.',
                    objetivo: 'Posicionar a necessidade de ajuda profissional'
                },
                {
                    numero: 5,
                    categoria: 'Quebra de Objeção',
                    titulo: 'Sobre o investimento',
                    o_que_mostrar: 'Você respondendo com segurança',
                    texto_tela: 'Sim, consultoria é um investimento. Ficar igual é mais caro.',
                    o_que_falar: 'Olha, a gente sabe que consultoria custa dinheiro. É investimento mesmo. Mas sabe o que custa mais ainda? Ficar do mesmo jeito por 5 anos, tentando sozinho, sem resultado. Isso sim é caro. Aqui você investe uma vez e consegue resultado que dura pra vida toda.',
                    objetivo: 'Desconstruir objetos financeiros'
                },
                {
                    numero: 6,
                    categoria: 'Depoimento',
                    titulo: 'Quem eu ajudo',
                    o_que_mostrar: 'Você falando com segurança',
                    texto_tela: 'Eu trabalho com quem quer resultado de verdade.',
                    o_que_falar: 'Eu não trabalho com todo mundo. Eu trabalho com pessoas que realmente querem mudar, que tão cansadas de tentar sozinhas, que sabem que precisam de ajuda profissional. Se você é assim, a gente vai dar muito certo junto.',
                    objetivo: 'Criar sensação de pertencimento'
                },
                {
                    numero: 7,
                    categoria: 'Autoridade',
                    titulo: 'Por que funciona aqui',
                    o_que_mostrar: 'Você no consultório ou com seu material',
                    texto_tela: 'Resultado não é acaso. É porque eu sei exatamente como funciona.',
                    o_que_falar: 'Aqui funciona porque eu não sou só nutricionista. Eu acompanho cada detalhe, cada passo que você dá. Cada pessoa é diferente, cada corpo é diferente. Aqui a gente descobre exatamente o que funciona pra você e só faz aquilo.',
                    objetivo: 'Reforçar expertise'
                },
                {
                    numero: 8,
                    categoria: 'CTA Forte',
                    titulo: 'Vagas abertas',
                    o_que_mostrar: 'Você sorrindo, tom de convite',
                    texto_tela: 'Vagas abertas pra consultoria este mês. Me chama no direct! 📲',
                    o_que_falar: 'Eu tenho vagas abertas pra esse mês pra quem quer começar agora mesmo. Se você quer parar de tentar sozinho, quer ter alguém de verdade te orientando, me chama no direct. Vamos conversar, vou entender sua história e te mostrar exatamente como funciona.',
                    objetivo: 'Gerar leads qualificados'
                }
            ],
            identificacao: [
                {
                    numero: 1,
                    categoria: 'Diagnóstico',
                    titulo: 'Qual é seu maior problema?',
                    o_que_mostrar: 'Você reflexiva e acessível',
                    texto_tela: 'Qual é o seu maior bloqueio agora?',
                    o_que_falar: 'Oi! Eu quero fazer uma pergunta pra você que vem acompanhando meu conteúdo. Qual é o seu maior problema agora com alimentação? É resistência? É não conseguir parar de comer certos alimentos? É a fome que bate de noite? Me conta aí.',
                    objetivo: 'Abrir conversa sobre o problema'
                },
                {
                    numero: 2,
                    categoria: 'Normalização',
                    titulo: 'Você não é o único',
                    o_que_mostrar: 'Foto da sua sala de atendimento',
                    texto_tela: 'Aqui descubro qual é o problema real. Dica: nem sempre é óbvio.',
                    o_que_falar: 'Sabe aquilo que você tá achando que é estranho, que é só com você? Aqui no consultório eu vejo padrões. Vejo as mesmas coisas repetindo, as mesmas dificuldades. Você não tá sozinho nisso, viu? Mas o problema real geralmente é diferente do que a pessoa acha.',
                    objetivo: 'Validar que o problema é comum'
                },
                {
                    numero: 3,
                    categoria: 'Identificação',
                    titulo: 'Eu vejo isso toda semana',
                    o_que_mostrar: 'Você apontando algo ou mostrando padrão',
                    texto_tela: theme ? `Você também sofre com ${theme}? Vejo isso em 3 pacientes por semana.` : 'Você também tem esse padrão? Identifiquei em vários pacientes.',
                    o_que_falar: `Sabe o que é engraçado? Essa situação que você tá vivendo, eu vejo em mais de 3 pacientes por semana. ${theme ? 'Exatamente: ' + theme : ''} É a mesma coisa. A mesma frustração, a mesma dificuldade. E quando a gente identifica qual é o problema real, aí muda tudo.`,
                    objetivo: 'Gerar sensação de que você entende'
                },
                {
                    numero: 4,
                    categoria: 'Educação',
                    titulo: 'A causa real',
                    o_que_mostrar: 'Você explicando ou texto animado',
                    texto_tela: 'O que causa isso é geralmente o oposto do que a gente tenta.',
                    o_que_falar: 'Mas aqui tá o problema: a maioria das pessoas tenta resolver isso do jeito errado. Tipo, você tá tentando fazer uma coisa que na verdade tá piorando. O que você precisa é fazer completamente o oposto. É diferente, é contra-intuitivo, mas é assim que funciona de verdade.',
                    objetivo: 'Criar o "aha moment"'
                },
                {
                    numero: 5,
                    categoria: 'Autoridade',
                    titulo: 'Tenho solução pra isso',
                    o_que_mostrar: 'Você confiante',
                    texto_tela: 'Eu vejo isso 10x por semana e tem uma abordagem que funciona.',
                    o_que_falar: 'Mas calma, porque eu vejo isso direto. E mais importante: eu tenho uma abordagem que funciona. Quando a gente faz desse jeito certo, a pessoa consegue resultado de verdade. Não é fórmula pronta, é personalizado pro problema dela.',
                    objetivo: 'Gerar esperança'
                },
                {
                    numero: 6,
                    categoria: 'Desculpabilização',
                    titulo: 'Você não é fraco',
                    o_que_mostrar: 'Você empatizando',
                    texto_tela: 'Você não falhou. Você só estava seguindo a receita errada.',
                    o_que_falar: 'E olha, se você não conseguiu até agora, não é porque você é fraco. Não é porque você não tem disciplina. É porque você tava seguindo a receita errada. A culpa não é sua. A gente descobre qual é a abordagem certa e aí tudo muda.',
                    objetivo: 'Criar abertura emocional'
                },
                {
                    numero: 7,
                    categoria: 'Solução',
                    titulo: 'Aqui é onde muda',
                    o_que_mostrar: 'Você mostrando o caminho',
                    texto_tela: 'Aqui a gente muda a abordagem completamente.',
                    o_que_falar: 'A partir de aqui, a gente faz diferente. A gente personaliza tudo pra você. A gente descobre qual é o seu gatilho, qual é o seu bloqueio, e trabalha em cima disso. Quando a gente faz assim, você consegue resultado que dura.',
                    objetivo: 'Virar para a solução'
                },
                {
                    numero: 8,
                    categoria: 'CTA',
                    titulo: 'Quer descobrir?',
                    o_que_mostrar: 'Você no direct',
                    texto_tela: 'Quer descobrir exatamente o que te bloqueia? Chama no direct 💬',
                    o_que_falar: 'Se você quer descobrir qual é exatamente o seu bloqueio, qual é a abordagem que funciona pra você, me chama no direct. A gente tem uma conversa e eu te mostro por onde começar. Sem compromisso, só pra gente entender sua história.',
                    objetivo: 'Gerar contato para diagnóstico'
                }
            ],
            ensinamento: [
                {
                    numero: 1,
                    categoria: 'Abertura',
                    titulo: 'Descoberta importante',
                    o_que_mostrar: 'Você pegando em algo relevante',
                    texto_tela: 'Vou te mostrar por que a maioria falha em emagrecimento.',
                    o_que_falar: 'Oi! Você já parou pra pensar por que a maioria das pessoas que tentam emagrecer falha? Tem uma razão. E hoje eu vou te revelar essa razão. Vem comigo que você vai entender por que a maioria tá fazendo tudo errado.',
                    objetivo: 'Capturar atenção com promise'
                },
                {
                    numero: 2,
                    categoria: 'Contexto',
                    titulo: 'Minha experiência',
                    o_que_mostrar: 'Seu dia, seu consultório, seus estudos',
                    texto_tela: 'Estudei nutrição por anos e descobri algo que ninguém ensina.',
                    o_que_falar: 'Eu estudei nutrição durante anos, fiz meu acompanhamento, lia pesquisas, tudo. E em algum momento eu comecei a perceber um padrão. Todos os meus pacientes que conseguem resultado de verdade seguem um método que ninguém tá ensinando por aí. E eu quero compartilhar isso com você.',
                    objetivo: 'Estabelecer autoridade'
                },
                {
                    numero: 3,
                    categoria: 'Conceito 1',
                    titulo: 'A primeira verdade',
                    o_que_mostrar: 'Infográfico ou você explicando',
                    texto_tela: 'Primeiro: o corpo não entende calorias. Entende sinais.',
                    o_que_falar: 'Primeira coisa que você precisa entender: o seu corpo não funciona com contagem de calorias. Isso é mito mesmo. O corpo entende sinais. Hormônios, neurotransmissores, tudo isso. Quando você manda o sinal certo pro seu corpo, ele responde. Quando você manda o sinal errado, ele bloqueia. É assim que funciona.',
                    objetivo: 'Desafiar crença comum'
                },
                {
                    numero: 4,
                    categoria: 'Conceito 2',
                    titulo: 'A segunda verdade',
                    o_que_mostrar: 'Exemplo prático do seu dia',
                    texto_tela: 'Segundo: você só muda hábito quando resolve o gatilho emocional.',
                    o_que_falar: 'Segunda coisa: você não muda hábito só com força de vontade. Hábito muda quando você resolve o gatilho emocional por trás dele. Tipo, você come por ansiedade? Então a solução não é comer menos. É resolver a ansiedade. Quando você faz assim, o comportamento muda naturalmente.',
                    objetivo: 'Conectar corpo e mente'
                },
                {
                    numero: 5,
                    categoria: 'Conceito 3',
                    titulo: 'A terceira verdade',
                    o_que_mostrar: 'Aplicação real ou transformação visual',
                    texto_tela: 'Terceiro: resultado vem depois que você muda a mentalidade.',
                    o_que_falar: 'E terceira coisa, a mais importante: resultado de verdade vem quando você muda a mentalidade. Quando você deixa de ver comida como inimiga e começa a ver como ferramenta. Quando você deixa de ver seu corpo como problema e começa a ver como máquina que funciona. Essa mudança de mindset muda tudo.',
                    objetivo: 'Completar o framework'
                },
                {
                    numero: 6,
                    categoria: 'Prova Social',
                    titulo: 'Prova que funciona',
                    o_que_mostrar: 'Depoimento visual ou resultado',
                    texto_tela: 'Isso funcionou com 200+ pacientes. Vai funcionar com você também.',
                    o_que_falar: 'Essas três coisas aí? Eu apliquei com mais de 200 pacientes. E todas conseguem resultado que dura. Não é resultado de um mês, é resultado que a pessoa carrega pro resto da vida. Porque a abordagem é diferente. É em cima da verdade de como o corpo funciona.',
                    objetivo: 'Gerar confiança na metodologia'
                },
                {
                    numero: 7,
                    categoria: 'Método',
                    titulo: 'Como aprender isso',
                    o_que_mostrar: 'Você mostrando a ferramenta ou estrutura',
                    texto_tela: 'Tem um método passo a passo que eu aplico no consultório.',
                    o_que_falar: 'Agora, como você aplica isso na sua vida? Tem um método que eu uso aqui no consultório. São 3 passos simples mas que precisam ser feitos na ordem certa. Se você quer aprender esse método, eu vou mostrar pra você. Vou detalhar tudo.',
                    objetivo: 'Abrir porta para próximo step'
                },
                {
                    numero: 8,
                    categoria: 'CTA',
                    titulo: 'Vem aprender',
                    o_que_mostrar: 'Você convitando com entusiasmo',
                    texto_tela: 'Esse conhecimento te espera. Vem pra cá aprender 🚀',
                    o_que_falar: 'Esse conhecimento vai mudar a forma como você vê nutrição, como você vê seu corpo, como você vê emagrecimento. Vem comigo aprender isso de verdade. Me chama, a gente conversa e eu passo pra você tudo que você precisa saber.',
                    objetivo: 'Gerar inscrição ou lead educacional'
                }
            ]
        };

        const templates = storyTemplates[type] || storyTemplates.conexao;
        const sequences = templates.map(story => ({
            numero: story.numero,
            categoria: story.categoria,
            titulo: story.titulo,
            objetivo: story.objetivo,
            o_que_mostrar: story.o_que_mostrar,
            texto_tela: story.texto_tela.replace(/\${theme}/g, theme || 'seu tema'),
            o_que_falar: story.o_que_falar.replace(/\${theme}/g, theme || 'seu tema'),
            origin: 'Roteiro estruturado'
        }));

        const today = this.getTodayDateString();
        const roteiro = {
            id: Date.now(),
            date: today,
            type: type,
            theme: theme,
            sequences: sequences,
            statuses: Array(8).fill(''),
            reasons: Array(8).fill(''),
            createdAt: new Date().toISOString()
        };

        this.stories = this.stories.filter(s => s.date !== today);
        this.stories.push(roteiro);
        this.saveStories();
    }

    getTodayRoteiro() {
        const today = this.getTodayDateString();
        return this.stories.find(s => s.date === today);
    }

    generateContentDraft(tema, tipo = 'educacao') {
        const temaLimpo = tema.replace(/^.*:\s*/, '').trim();

        const templates = {
            educacao: {
                titulo: `O que ninguém te conta sobre ${temaLimpo}`,
                capa: '🔬 A verdade que você precisa saber',
                timeline: [
                    { tempo: '0-3s', secao: 'Gancho', conteudo: `Você acha que sabe como ${temaLimpo.toLowerCase()} funciona no seu corpo? Deixa eu te mostrar algo que pode mudar tudo.` },
                    { tempo: '3-15s', secao: 'Dor', conteudo: `A maioria dos meus pacientes acreditava que ${temaLimpo.toLowerCase()} era simples. Mas quando comecei a investigar, descobri que a maioria tá fazendo totalmente errado.` },
                    { tempo: '15-40s', secao: 'Explicação', conteudo: `Um estudo recente mostrou que ${temaLimpo.toLowerCase()} tem um efeito muito maior do que imaginamos. Pesquisadores descobriram que a forma como você faz isso afeta diretamente seus resultados.` },
                    { tempo: '40-65s', secao: 'Quebra', conteudo: `Você provavelmente acreditava que era só questão de quantidade. Mas a ciência mostra que a qualidade, o momento e como você combina tudo faz a diferença real.` },
                    { tempo: '65-85s', secao: 'Metáfora', conteudo: `Pense em ${temaLimpo.toLowerCase()} como uma chave. Se você tem a chave certa, mas abre a porta errada, de nada adianta ter a melhor chave do mundo.` },
                    { tempo: '85-110s', secao: 'Aplicação', conteudo: `Aqui no consultório, quando a gente alinha isso tudo - quantidade, timing, combinação - é quando vejo meus pacientes transformarem seus resultados. Não é mágica, é estratégia.` },
                    { tempo: '110-130s', secao: 'Fechamento', conteudo: `A pergunta agora é: você vai continuar fazendo do jeito que sempre fez e esperando resultados diferentes? Ou está pronto para tentar uma abordagem que realmente funciona?` }
                ],
                ctaVideo: 'Comenta "sim" se você quer descobrir exatamente como fazer isso direito.',
                legendaInstagram: `Sou nutricionista e trabalho com ${temaLimpo.toLowerCase()} há anos. Descobri algo importante que a maioria não sabe.\n\nA verdade é que ${temaLimpo.toLowerCase()} funciona de um jeito completamente diferente do que a maioria acredita. Um estudo recente confirmou o que vejo na prática: quando você entende o mecanismo correto, tudo muda.\n\nSe você quer resultados reais e sustentáveis, precisa saber disso.\n\nVocê já sabia dessa diferença? Comenta aí! 👇`,
                stories: [
                    { numero: 1, o_que_falar: `Você acha que sabe como ${temaLimpo.toLowerCase()} funciona? Descubra o que você tá fazendo errado nos próximos stories.` },
                    { numero: 2, o_que_falar: `A maioria acredita que é só questão de quantidade. Mas tem algo que ninguém te conta.` },
                    { numero: 3, o_que_falar: `Um estudo recente mostrou que ${temaLimpo.toLowerCase()} funciona completamente diferente do que você imagina.` },
                    { numero: 4, o_que_falar: `Aqui no consultório eu vejo isso o tempo todo: pacientes que conseguem resultado quando alinhamos tudo certo.` },
                    { numero: 5, o_que_falar: `Quer saber exatamente como funciona e como aplicar? Assiste meu vídeo no feed (link nos stories).` },
                    { numero: 6, o_que_falar: `[ENQUETE] Você faz ${temaLimpo.toLowerCase()} do jeito certo ou do jeito que a maioria faz?` }
                ],
                viralizacao: {
                    potencial: 8,
                    gatilho: 'Curiosidade + identificação com erro comum',
                    fraseRetencao: `Você acha que sabe como ${temaLimpo.toLowerCase()} funciona? Deixa eu te mostrar algo que pode mudar tudo.`,
                    compartilhavel: 'A verdade que ninguém te conta sobre esse erro comum',
                    riscos: 'Parecer muito técnico. Solução: manter linguagem simples.',
                    melhorias: 'Adicionar depoimento de paciente real se tiver disponível'
                }
            },
            lifestyle: {
                titulo: `Dia de ${temaLimpo}`,
                capa: '🌟 Um dia diferente na rotina',
                timeline: [
                    { tempo: '0-3s', secao: 'Gancho', conteudo: `Hoje eu te mostro como é um dia meu trabalhando com ${temaLimpo.toLowerCase()}.` },
                    { tempo: '3-15s', secao: 'Contexto', conteudo: `Muita gente pensa que nutricionista é só consulta. Mas a verdade é que tem muito mais por trás.` },
                    { tempo: '15-40s', secao: 'Bastidor', conteudo: `De manhã eu já tô pensando em ${temaLimpo.toLowerCase()}. Revisando casos, estudando o que há de novo, preparando abordagens.` },
                    { tempo: '40-65s', secao: 'Ação', conteudo: `Quando você entende de verdade o que faz ${temaLimpo.toLowerCase()} funcionar, tudo fica mais fácil. Pra mim e pros meus pacientes.` },
                    { tempo: '65-85s', secao: 'Resultado', conteudo: `Aqui está o legal: quando eu dedico esse tempo todo de preparação, meus pacientes conseguem resultados muito melhores.` },
                    { tempo: '85-110s', secao: 'Reflexão', conteudo: `Isso não é acaso. É porque eu realmente acredito que ${temaLimpo.toLowerCase()} deve ser feito com propósito e estratégia.` },
                    { tempo: '110-130s', secao: 'Convite', conteudo: `Quer fazer parte de quem realmente funciona as coisas? Deixa eu te ajudar também.` }
                ],
                ctaVideo: 'Comenta "quero" se você quer fazer parte desse trabalho sério também.',
                legendaInstagram: `Um dia meu é assim: estudando, analisando casos, preparando estratégias.\n\nMuita gente acha que nutrição é só "não coma isso" e "coma aquilo". Mas é muito mais.\n\nCom ${temaLimpo.toLowerCase()}, quando você realmente entende o mecanismo e prepara tudo com propósito, é quando as transformações acontecem.\n\nÉ por isso que meus pacientes conseguem resultados. Não é sorte, é estratégia.\n\nVocê quer funcionar as coisas do jeito certo também? Me chama. 💪`,
                stories: [
                    { numero: 1, o_que_falar: `Hoje é dia de ${temaLimpo.toLowerCase()} aqui no consultório. Quer ver como é?` },
                    { numero: 2, o_que_falar: `Começa lá pela manhã estudando, analisando, preparando tudo com cuidado.` },
                    { numero: 3, o_que_falar: `Não é só consulta. É entender cada detalhe de como ${temaLimpo.toLowerCase()} funciona no corpo de cada pessoa.` },
                    { numero: 4, o_que_falar: `Quando você prepara tudo assim, seus pacientes conseguem resultados reais.` },
                    { numero: 5, o_que_falar: `Quer conhecer meu método? Tá tudo no vídeo do feed.` },
                    { numero: 6, o_que_falar: `[CAIXA] Como você faz ${temaLimpo.toLowerCase()} atualmente? Me conta!` }
                ],
                viralizacao: {
                    potencial: 7,
                    gatilho: 'Bastidor + humanização',
                    fraseRetencao: 'Um dia meu é assim: estudando, analisando, preparando estratégias',
                    compartilhavel: 'O que tem por trás de uma nutricionista que realmente funciona as coisas',
                    riscos: 'Parecer arrogante. Solução: tom humilde + foco em ajudar.',
                    melhorias: 'Mostrar o rosto durante o bastidor para maior conexão'
                }
            },
            autoridade: {
                titulo: `${temaLimpo}: O que a ciência diz (e o que ninguém comenta)`,
                capa: '🧬 A verdade científica por trás disso',
                timeline: [
                    { tempo: '0-3s', secao: 'Gancho', conteudo: `Você conhece o estudo sobre ${temaLimpo.toLowerCase()}? Provavelmente não. Deixa eu te mostrar o que a ciência realmente diz.` },
                    { tempo: '3-15s', secao: 'Contexto', conteudo: `Tem muita informação errada por aí sobre ${temaLimpo.toLowerCase()}. Eu leio pesquisas o tempo todo e vejo pessoas citando estudos de forma errada.` },
                    { tempo: '15-40s', secao: 'Estudo', conteudo: `Um estudo que saiu recentemente analisou exatamente como ${temaLimpo.toLowerCase()} afeta o seu corpo. Os resultados são mais interessantes do que você imagina.` },
                    { tempo: '40-65s', secao: 'Interpretação', conteudo: `Mas aqui está o detalhe que a maioria não vê: o estudo mostra que ${temaLimpo.toLowerCase()} funciona melhor quando você considera esses fatores específicos.` },
                    { tempo: '65-85s', secao: 'Conexão', conteudo: `Isso muda completamente como a gente trabalha com ${temaLimpo.toLowerCase()} aqui no consultório. Cada paciente é diferente.` },
                    { tempo: '85-110s', secao: 'Aplicação', conteudo: `Por isso quando eu recomendo algo sobre ${temaLimpo.toLowerCase()}, eu baseio em evidências científicas e na prática com meus pacientes.` },
                    { tempo: '110-130s', secao: 'Fechamento', conteudo: `A ciência não é estática. Por isso eu estou sempre estudando pra dar a melhor orientação. Você quer trabalhar com alguém que realmente estuda?` }
                ],
                ctaVideo: 'Comenta se você quer saber mais sobre isso ou tem perguntas sobre o estudo.',
                legendaInstagram: `Sou nutricionista e estou sempre lendo pesquisas. Recentemente achei um estudo que muda completamente como a gente vê ${temaLimpo.toLowerCase()}.\n\nMas aqui está o problema: a maioria cita esse tipo de pesquisa errado. Pegam apenas uma parte e tiram conclusões que o estudo nem chegou.\n\nA verdade é mais interessante.\n\n${temaLimpo} funciona assim: [resumo breve da descoberta]. Isso muda tudo quando você trabalha com propósito.\n\nPor isso meus pacientes conseguem resultados que parecem "mágica" pra quem tá de fora. Não é mágica. É ciência bem feita.\n\nVocê quer entender melhor como isso funciona no seu corpo? Me chama. 🧬`,
                stories: [
                    { numero: 1, o_que_falar: `Tem um estudo novo sobre ${temaLimpo.toLowerCase()} que ninguém tá comentando direito.` },
                    { numero: 2, o_que_falar: `A maioria cita a pesquisa errado. Deixa eu mostrar o que ela realmente diz.` },
                    { numero: 3, o_que_falar: `O principal resultado é que ${temaLimpo.toLowerCase()} funciona de um jeito muito mais interessante do que se fala.` },
                    { numero: 4, o_que_falar: `Aqui no consultório a gente aplica isso todo dia. Muda completamente os resultados.` },
                    { numero: 5, o_que_falar: `Quer saber como aplicar isso na sua vida? Assiste meu vídeo completo.` },
                    { numero: 6, o_que_falar: `[ENQUETE] Você confiava na informação errada sobre ${temaLimpo.toLowerCase()}?` }
                ],
                viralizacao: {
                    potencial: 9,
                    gatilho: 'Quebra de crença + autoridade científica',
                    fraseRetencao: 'A maioria cita esse tipo de pesquisa errado. Deixa eu mostrar o que ela realmente diz.',
                    compartilhavel: 'O que a ciência realmente diz sobre um assunto que todos falam errado',
                    riscos: 'Parecer pedante. Solução: manter tom conversacional e acessível.',
                    melhorias: 'Citar fonte ou nome do estudo se tiver (pode ser fictício aqui)'
                }
            }
        };

        const template = templates[tipo] || templates.educacao;

        const draft = {
            id: Date.now(),
            tema: temaLimpo,
            tipo: tipo,
            criadoEm: new Date().toISOString(),
            roteiro: {
                titulo: template.titulo,
                capa: template.capa,
                timeline: template.timeline,
                ctaVideo: template.ctaVideo,
                legendaInstagram: template.legendaInstagram,
                stories: template.stories,
                viralizacao: template.viralizacao
            }
        };

        this.drafts.unshift(draft);
        this.saveDrafts();
        return draft;
    }

    updateStoryStatus(seqIndex, status, reason) {
        const today = this.getTodayDateString();
        const roteiro = this.stories.find(s => s.date === today);
        if (roteiro) {
            roteiro.statuses[seqIndex] = status;
            roteiro.reasons[seqIndex] = reason;
            this.saveStories();
        }
    }

    loadPlannings() {
        const stored = localStorage.getItem('nutrirotina_plannings');
        return stored ? JSON.parse(stored) : [];
    }

    savePlannings() {
        localStorage.setItem('nutrirotina_plannings', JSON.stringify(this.plannings));
    }

    addPlanning(local, consultas, exerciseTime, notes, type = 'conexao', theme = '') {
        const tomorrow = this.getDateString(1);
        const planning = {
            id: Date.now(),
            date: tomorrow,
            local,
            consultas,
            exerciseTime,
            notes,
            type,
            theme,
            createdAt: new Date().toISOString()
        };
        this.plannings.push(planning);
        this.savePlannings();
    }

    /* ===== FEEDBACK (FASE 3) ===== */

    renderFeedbackPage() {
        try {
            const clone = document.getElementById('feedback-page-template').content.cloneNode(true);
            const pageElement = clone.querySelector('.page-feedback');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            const today = this.getTodayDateString();
            const todayActivities = this.atividades.filter(a => a.date === today);
            const feedbackContent = this.contentElement.querySelector('#feedback-content');
            const moodSelector = this.contentElement.querySelector('#mood-selector');

            let selectedMood = null;
            const feedbackStates = {};

            // Setup mood selector
            moodSelector.querySelectorAll('.mood-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    moodSelector.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    selectedMood = parseInt(e.currentTarget.dataset.mood);
                    this.todayMood = selectedMood;
                });
            });

            if (todayActivities.length === 0) {
                feedbackContent.innerHTML = '<div class="placeholder-text">Nenhuma atividade registrada hoje 🌙</div>';
                return;
            }

            todayActivities.forEach(activity => {
                const item = document.createElement('div');
                item.className = 'feedback-activity-item';
                item.innerHTML = `
                    <div class="feedback-activity-title">📌 ${activity.titulo}</div>
                    <div class="feedback-activity-time">${activity.horaInicio} — ${activity.horaFim}</div>
                    <div class="feedback-buttons">
                        <button class="feedback-btn posted" data-activity-id="${activity.id}" data-state="posted" title="Fiz">
                            🟢 Fiz
                        </button>
                        <button class="feedback-btn missed" data-activity-id="${activity.id}" data-state="missed" title="Não fiz">
                            🔴 Não fiz
                        </button>
                        <button class="feedback-btn conscious" data-activity-id="${activity.id}" data-state="conscious_skip" title="Meia boca">
                            🟡 Meia boca
                        </button>
                    </div>
                `;
                feedbackContent.appendChild(item);
            });

            feedbackContent.querySelectorAll('.feedback-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const activityId = e.currentTarget.dataset.activityId;
                    const state = e.currentTarget.dataset.state;
                    const allBtns = feedbackContent.querySelectorAll(`[data-activity-id="${activityId}"]`);

                    allBtns.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    feedbackStates[activityId] = state;
                });
            });

            this.feedbackStates = feedbackStates;
            this.todayMood = selectedMood;
        } catch (error) {
            console.error('Erro ao renderizar página de feedback:', error);
        }
    }

    /* ===== SEMANA (FASE 7) ===== */

    renderWeekPage() {
        try {
            const clone = this.weekPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-week');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            let currentWeekOffset = 0;

            const renderWeek = (offset) => {
                const weekGrid = this.contentElement.querySelector('#week-grid');
                const weekRange = this.contentElement.querySelector('#week-range');
                weekGrid.innerHTML = '';

                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay() + (offset * 7));
                startOfWeek.setHours(0, 0, 0, 0);

                const weekDays = [];
                for (let i = 0; i < 7; i++) {
                    const day = new Date(startOfWeek);
                    day.setDate(startOfWeek.getDate() + i);
                    weekDays.push(day);
                }

                const rangeStart = this.formatDate(weekDays[0]);
                const rangeEnd = this.formatDate(weekDays[6]);
                weekRange.textContent = `${rangeStart} — ${rangeEnd}`;

                weekDays.forEach(day => {
                    const dayStr = day.toISOString().split('T')[0];
                    const dayActivities = this.atividades.filter(a => a.date === dayStr);
                    const dayTasks = this.tasks.filter(t => t.date === dayStr && t.status === 'done');

                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'week-day';

                    const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][day.getDay()];
                    const dayNum = day.getDate();

                    let dots = '';
                    const hasStories = dayActivities.some(a => a.categoria === 'conteudo');
                    const hasExercise = dayActivities.some(a => a.categoria === 'exercicio');
                    const hasTasksDone = dayTasks.length > 0;

                    if (hasStories) dots += '<span class="dot" style="background: #e88ba3;" title="Postei stories"></span>';
                    if (hasExercise) dots += '<span class="dot" style="background: #a8d5a8;" title="Treinei"></span>';
                    if (hasTasksDone) dots += '<span class="dot" style="background: #a8c5d5;" title="Cumpri tarefas"></span>';
                    if (!hasStories && !hasExercise && !hasTasksDone) dots += '<span class="dot" style="background: #e0e0e0;" title="Sem atividades"></span>';

                    dayDiv.innerHTML = `
                        <div class="week-day-header">
                            <span class="week-day-name">${dayName}</span>
                            <span class="week-day-num">${dayNum}</span>
                        </div>
                        <div class="week-dots">${dots}</div>
                    `;

                    weekGrid.appendChild(dayDiv);
                });
            };

            renderWeek(0);

            const prevBtn = this.contentElement.querySelector('#week-prev');
            const nextBtn = this.contentElement.querySelector('#week-next');

            prevBtn.addEventListener('click', () => {
                currentWeekOffset--;
                renderWeek(currentWeekOffset);
            });

            nextBtn.addEventListener('click', () => {
                currentWeekOffset++;
                renderWeek(currentWeekOffset);
            });
        } catch (error) {
            console.error('Erro ao renderizar página de semana:', error);
        }
    }

    renderHeatmapPage() {
        try {
            const clone = this.heatmapPageTemplate.content.cloneNode(true);
            const pageElement = clone.querySelector('.page-heatmap');
            pageElement.classList.add('active');
            this.contentElement.appendChild(clone);

            const container = this.contentElement.querySelector('#heatmap-container');

            // Calcula 365 dias retroativos
            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setDate(today.getDate() - 364);
            oneYearAgo.setHours(0, 0, 0, 0);

            // Agrupa dias em semanas (Sunday = 0)
            const weeks = [];
            let currentWeek = [];

            for (let i = 0; i < 365; i++) {
                const date = new Date(oneYearAgo);
                date.setDate(oneYearAgo.getDate() + i);

                if (currentWeek.length > 0 && date.getDay() === 0) {
                    weeks.push([...currentWeek]);
                    currentWeek = [];
                }
                currentWeek.push(date);
            }
            if (currentWeek.length > 0) {
                weeks.push(currentWeek);
            }

            const heatmapGrid = document.createElement('div');
            heatmapGrid.className = 'heatmap-grid';

            weeks.forEach(week => {
                const weekColumn = document.createElement('div');
                weekColumn.className = 'heatmap-week';

                week.forEach(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayActivities = this.atividades.filter(a => a.date === dateStr);
                    const activityCount = dayActivities.length;

                    let color = '#f0f0f0';
                    if (activityCount === 1) color = '#f5d5de';
                    else if (activityCount === 2) color = '#eb9bb1';
                    else if (activityCount >= 3) color = '#e88ba3';

                    const daySquare = document.createElement('div');
                    daySquare.className = 'heatmap-day';
                    daySquare.style.background = color;
                    daySquare.title = `${date.toLocaleDateString('pt-BR')}: ${activityCount} atividades`;
                    weekColumn.appendChild(daySquare);
                });

                heatmapGrid.appendChild(weekColumn);
            });

            container.appendChild(heatmapGrid);
        } catch (error) {
            console.error('Erro ao renderizar heatmap:', error);
        }
    }

    loadStories() {
        const stored = localStorage.getItem('nutrirotina_stories');
        return stored ? JSON.parse(stored) : [];
    }

    saveStories() {
        localStorage.setItem('nutrirotina_stories', JSON.stringify(this.stories));
    }

    loadDrafts() {
        const stored = localStorage.getItem('nutrirotina_drafts');
        return stored ? JSON.parse(stored) : [];
    }

    saveDrafts() {
        localStorage.setItem('nutrirotina_drafts', JSON.stringify(this.drafts));
    }

    /* ===== HÁBITOS ===== */

    loadHabitos() {
        const stored = localStorage.getItem('nutrirotina_habitos');
        if (stored) return JSON.parse(stored);
        return this.getDefaultHabitos();
    }

    getDefaultHabitos() {
        const today = this.getTodayDateString();
        return [
            { id: 'postei', nome: 'Postei stories', icone: '💖', completedToday: false, streak: 0, lastCompletedDate: null },
            { id: 'agua', nome: 'Bebi água', icone: '💧', completedToday: false, streak: 0, lastCompletedDate: null },
            { id: 'treino', nome: 'Treinei', icone: '🌿', completedToday: false, streak: 0, lastCompletedDate: null },
            { id: 'dieta', nome: 'Segui a dieta', icone: '🥗', completedToday: false, streak: 0, lastCompletedDate: null },
            { id: 'tarefas', nome: 'Cumpri tarefas', icone: '✨', completedToday: false, streak: 0, lastCompletedDate: null },
            { id: 'planejamento', nome: 'Planejei amanhã', icone: '📋', completedToday: false, streak: 0, lastCompletedDate: null }
        ];
    }

    saveHabitos() {
        localStorage.setItem('nutrirotina_habitos', JSON.stringify(this.habitos));
    }

    toggleHabito(habitoId) {
        const habito = this.habitos.find(h => h.id === habitoId);
        if (!habito) return;

        const today = this.getTodayDateString();
        const yesterday = this.getDateString(-1);

        if (habito.completedToday) {
            // Desmarcar
            habito.completedToday = false;
        } else {
            // Marcar como feito hoje
            habito.completedToday = true;

            // Atualizar streak
            if (habito.lastCompletedDate === yesterday) {
                habito.streak += 1;
            } else if (habito.lastCompletedDate !== today) {
                habito.streak = 1;
            }
            habito.lastCompletedDate = today;
        }

        this.saveHabitos();
        this.renderHabitos();
    }

    /* ===== TIMELINE / ATIVIDADES ===== */

    loadAtividades() {
        const stored = localStorage.getItem('nutrirotina_atividades');
        return stored ? JSON.parse(stored) : this.getDefaultAtividades();
    }

    saveAtividades() {
        localStorage.setItem('nutrirotina_atividades', JSON.stringify(this.atividades));
    }

    getDefaultAtividades() {
        const today = this.getTodayDateString();
        return [
            { id: 1, titulo: 'Acordar', horaInicio: '06:00', horaFim: '06:10', categoria: 'pessoal', date: today },
            { id: 2, titulo: 'Banho', horaInicio: '06:10', horaFim: '06:40', categoria: 'pessoal', date: today },
            { id: 3, titulo: 'Criar conteúdo', horaInicio: '07:00', horaFim: '09:00', categoria: 'conteudo', date: today },
            { id: 4, titulo: 'Atendimento presencial', horaInicio: '09:00', horaFim: '12:00', categoria: 'presencial', date: today },
            { id: 5, titulo: 'Pausa almoço', horaInicio: '12:00', horaFim: '13:00', categoria: 'pessoal', date: today },
            { id: 6, titulo: 'Atendimento online', horaInicio: '14:00', horaFim: '16:00', categoria: 'online', date: today },
            { id: 7, titulo: 'Treino', horaInicio: '18:00', horaFim: '19:00', categoria: 'exercicio', date: today },
            { id: 8, titulo: 'Feedback noturno', horaInicio: '21:00', horaFim: '21:30', categoria: 'organizacao', date: today }
        ];
    }

    getAtividadesToday() {
        const today = this.getTodayDateString();
        return this.atividades.filter(a => a.date === today).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    }

    addAtividade(titulo, horaInicio, horaFim, categoria) {
        const today = this.getTodayDateString();
        const novaAtividade = {
            id: Date.now(),
            titulo,
            horaInicio,
            horaFim,
            categoria,
            date: today
        };
        this.atividades.push(novaAtividade);
        this.saveAtividades();
        return novaAtividade;
    }

    updateAtividade(id, updates) {
        const atividade = this.atividades.find(a => a.id === id);
        if (atividade) {
            Object.assign(atividade, updates);
            this.saveAtividades();
        }
    }

    deleteAtividade(id) {
        this.atividades = this.atividades.filter(a => a.id !== id);
        this.saveAtividades();
    }

    getCategoryColor(categoria) {
        const colors = {
            'pessoal': '#9b9b9b',
            'exercicio': '#a8d5a8',
            'presencial': '#a8c5d5',
            'online': '#b8d5e8',
            'conteudo': '#e88ba3',
            'social': '#f0d9a8',
            'organizacao': '#ffffff'
        };
        return colors[categoria] || '#e0e0e0';
    }

    getCategoryBorder(categoria) {
        return categoria === 'organizacao' ? '2px solid #e88ba3' : 'none';
    }

    getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    getDateString(daysOffset) {
        const date = new Date();
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split('T')[0];
    }
}

// Inicializa o app
function initNutriRotina() {
    try {
        console.log('🚀 Inicializando NutriRotina...');
        window.nutriRotina = new NutriRotina();
        console.log('✅ NutriRotina inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar NutriRotina:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNutriRotina);
} else {
    initNutriRotina();
}
