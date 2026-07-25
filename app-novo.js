// NutriRotina — Versão Simplificada com Supabase

class NutriRotina {
    constructor() {
        console.log('🚀 Inicializando NutriRotina...');
        this.currentPage = 'home';
        this.currentUser = null;
        this.tasks = [];
        this.ideas = [];
        this.init();
    }

    async init() {
        this.currentUser = await getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ Usuário não autenticado');
            return;
        }
        console.log('✅ Usuário:', this.currentUser.email);

        this.setupDOM();
        await this.loadData();
        this.attachEventListeners();
        this.render();
    }

    setupDOM() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="page-home active">
                <div class="greeting-section">
                    <h2>Seu dia hoje ✨</h2>
                    <p class="date-display" id="dateDisplay">📅 Hoje</p>
                </div>

                <!-- TAREFAS -->
                <section class="home-card">
                    <div class="card-header">
                        <h3>✅ Tarefas de hoje</h3>
                    </div>
                    <div class="card-content" id="tasks-content">
                        <div class="placeholder-text">Carregando...</div>
                    </div>
                    <div class="card-footer">
                        <input type="text" id="new-task" placeholder="Adicionar tarefa..." class="task-input">
                        <button onclick="nutriRotina.addTask()" class="btn-add">+ Adicionar</button>
                    </div>
                </section>

                <!-- IDEIAS -->
                <section class="home-card">
                    <div class="card-header">
                        <h3>💭 Ideias</h3>
                    </div>
                    <div class="card-content" id="ideas-content">
                        <div class="placeholder-text">Carregando...</div>
                    </div>
                    <div class="card-footer">
                        <input type="text" id="new-idea" placeholder="Anotar ideia..." class="task-input">
                        <button onclick="nutriRotina.addIdea()" class="btn-add">+ Adicionar</button>
                    </div>
                </section>
            </div>
        `;
    }

    async loadData() {
        console.log('📥 Carregando dados do Supabase...');

        // Carregar tarefas
        const tasksResult = await readData('tasks');
        if (tasksResult.success) {
            this.tasks = tasksResult.data || [];
            console.log('✅ Tarefas carregadas:', this.tasks.length);
        }

        // Carregar ideias
        const ideasResult = await readData('ideas');
        if (ideasResult.success) {
            this.ideas = ideasResult.data || [];
            console.log('✅ Ideias carregadas:', this.ideas.length);
        }
    }

    render() {
        this.renderTasks();
        this.renderIdeas();
        this.updateDate();
    }

    renderTasks() {
        const container = document.getElementById('tasks-content');
        if (this.tasks.length === 0) {
            container.innerHTML = '<div class="placeholder-text">Nenhuma tarefa. Adicione uma! 🚀</div>';
            return;
        }

        container.innerHTML = this.tasks.map(task => `
            <div class="task-item">
                <div class="task-text">
                    <strong>${task.title}</strong>
                    <span class="task-status">${task.status}</span>
                </div>
                <button onclick="nutriRotina.deleteTask('${task.id}')" class="btn-delete">❌</button>
            </div>
        `).join('');
    }

    renderIdeas() {
        const container = document.getElementById('ideas-content');
        if (this.ideas.length === 0) {
            container.innerHTML = '<div class="placeholder-text">Nenhuma ideia. Anote uma! 💡</div>';
            return;
        }

        container.innerHTML = this.ideas.map(idea => `
            <div class="idea-item">
                <div class="idea-text">${idea.text}</div>
                <button onclick="nutriRotina.deleteIdea('${idea.id}')" class="btn-delete">❌</button>
            </div>
        `).join('');
    }

    async addTask() {
        const input = document.getElementById('new-task');
        const title = input.value.trim();

        if (!title) {
            alert('⚠️ Digite o título da tarefa');
            return;
        }

        console.log('💾 Salvando tarefa:', title);
        const result = await insertData('tasks', {
            title: title,
            status: 'todo'
        });

        if (result.success) {
            this.tasks.push(result.data[0]);
            input.value = '';
            this.renderTasks();
            console.log('✅ Tarefa salva!');
        } else {
            alert('❌ Erro ao salvar: ' + result.error);
        }
    }

    async addIdea() {
        const input = document.getElementById('new-idea');
        const text = input.value.trim();

        if (!text) {
            alert('⚠️ Digite a ideia');
            return;
        }

        console.log('💾 Salvando ideia:', text);
        const result = await insertData('ideas', {
            text: text,
            status: 'nova'
        });

        if (result.success) {
            this.ideas.push(result.data[0]);
            input.value = '';
            this.renderIdeas();
            console.log('✅ Ideia salva!');
        } else {
            alert('❌ Erro ao salvar: ' + result.error);
        }
    }

    async deleteTask(id) {
        if (!confirm('Tem certeza?')) return;
        const result = await deleteData('tasks', id);
        if (result.success) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.renderTasks();
        }
    }

    async deleteIdea(id) {
        if (!confirm('Tem certeza?')) return;
        const result = await deleteData('ideas', id);
        if (result.success) {
            this.ideas = this.ideas.filter(i => i.id !== id);
            this.renderIdeas();
        }
    }

    updateDate() {
        const dateDisplay = document.getElementById('dateDisplay');
        if (dateDisplay) {
            const today = new Date();
            const formatted = today.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
            dateDisplay.textContent = `📅 ${formatted}`;
        }
    }

    attachEventListeners() {
        // Logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => authUI.logout());
        }
    }
}

// Estilos inline
const style = document.createElement('style');
style.textContent = `
    .page-home { padding: 20px; }
    .greeting-section { margin-bottom: 30px; }
    .greeting-section h2 { color: #e88ba3; margin: 0 0 10px 0; }
    .home-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card-header h3 { margin: 0 0 15px 0; color: #6b6b6b; }
    .card-content { min-height: 60px; }
    .placeholder-text { color: #999; text-align: center; padding: 20px; }
    .task-item, .idea-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #f0f0f0;
    }
    .task-text { flex: 1; }
    .task-status {
        display: inline-block;
        background: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-left: 10px;
    }
    .card-footer {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #f0f0f0;
    }
    .task-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-family: inherit;
    }
    .btn-add {
        padding: 10px 15px;
        background: #e88ba3;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
    }
    .btn-add:hover { background: #d67a92; }
    .btn-delete {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 4px 8px;
    }
`;
document.head.appendChild(style);
