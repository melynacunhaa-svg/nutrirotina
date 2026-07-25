// ===== NOTIFICAÇÕES PUSH =====
// Gerencia inscrição, permissões e recebimento de notificações

class NotificationManager {
    constructor() {
        this.subscription = null;
        this.vapidPublicKey = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        console.log('🔔 Inicializando gerenciador de notificações...');

        // Verificar se o navegador suporta service workers e notifications
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('⚠️ Notificações push não suportadas neste navegador');
            return;
        }

        // Obter usuário atual
        this.currentUser = await getCurrentUser();
        if (!this.currentUser) {
            console.log('⏳ Esperando usuário estar logado...');
            return;
        }

        // Registrar service worker
        try {
            const registration = await navigator.serviceWorker.register('sw.js', {
                scope: '/'
            });
            console.log('✅ Service Worker registrado');
            this.setupNotificationButton();
        } catch (error) {
            console.error('❌ Erro ao registrar Service Worker:', error);
        }
    }

    setupNotificationButton() {
        // Criar botão de notificação no header
        const header = document.querySelector('.app-header');
        if (!header) return;

        // Verificar se já existe
        if (document.querySelector('.notification-btn')) return;

        const notifBtn = document.createElement('button');
        notifBtn.className = 'notification-btn';
        notifBtn.innerHTML = '🔔';
        notifBtn.title = 'Ativar notificações';
        notifBtn.onclick = () => this.requestNotificationPermission();

        // Inserir antes do botão de logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.parentNode.insertBefore(notifBtn, logoutBtn);
        } else {
            header.appendChild(notifBtn);
        }

        console.log('✅ Botão de notificações adicionado ao header');
    }

    async requestNotificationPermission() {
        console.log('📲 Pedindo permissão de notificações...');

        // Verificar permissão atual
        if (Notification.permission === 'granted') {
            console.log('✅ Já tem permissão de notificações');
            this.subscribeUser();
            return;
        }

        if (Notification.permission === 'denied') {
            alert('❌ Permissão de notificações foi negada. Ative nas configurações do navegador.');
            return;
        }

        // Pedir permissão
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('✅ Permissão concedida!');
            alert('✅ Notificações ativadas! Você receberá alertas sobre novos itens.');
            this.subscribeUser();
        } else {
            console.log('❌ Permissão negada');
            alert('Você pode ativar notificações depois nas configurações.');
        }
    }

    async subscribeUser() {
        console.log('📝 Inscrevendo usuário para notificações...');

        try {
            const registration = await navigator.serviceWorker.ready;

            // Aqui você precisa da VAPD public key (gerada na Etapa 3)
            // Por enquanto, vamos usar uma placeholder
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'BMG2qT7L0_0yGxEEHPXQv0s2J0fmTqXY7EFbKXBxyLSBT2HXD-mQXKvx_4YOyVPBIYhfSTJFv9o0xLqMLBrQQ_A'
                )
            });

            console.log('✅ Usuário inscrito:', subscription);
            this.subscription = subscription;

            // Salvar inscrição no banco (Etapa 2)
            await this.saveSub scriptionToDatabase(subscription);

        } catch (error) {
            console.error('❌ Erro ao inscrever:', error);
        }
    }

    async saveSubscriptionToDatabase(subscription) {
        console.log('💾 Salvando inscrição no banco...');

        if (!this.currentUser) {
            console.error('❌ Usuário não autenticado');
            return;
        }

        const result = await insertData('push_subscriptions', {
            user_id: this.currentUser.id,
            endpoint: subscription.endpoint,
            auth: subscription.getKey('auth').toString(),
            p256dh: subscription.getKey('p256dh').toString()
        });

        if (result.success) {
            console.log('✅ Inscrição salva no banco!');
            this.updateNotificationButtonStatus();
        } else {
            console.error('❌ Erro ao salvar:', result.error);
        }
    }

    updateNotificationButtonStatus() {
        const btn = document.querySelector('.notification-btn');
        if (btn) {
            btn.innerHTML = '🔔✅';
            btn.title = 'Notificações ativadas';
            btn.disabled = true;
        }
    }

    // Converter VAPD key de base64 para Uint8Array
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Inicializar quando o usuário estiver logado
let notificationManager;
supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        console.log('👤 Usuário logado, inicializando notificações...');
        notificationManager = new NotificationManager();
    } else {
        console.log('👤 Usuário deslogado');
    }
});
