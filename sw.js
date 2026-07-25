// Service Worker — Recebe e mostra notificações push

console.log('🔔 Service Worker carregado');

// Evento quando recebe uma notificação push
self.addEventListener('push', (event) => {
    console.log('📬 Push recebido:', event);

    if (!event.data) {
        console.log('⚠️ Sem dados na notificação');
        return;
    }

    try {
        const data = event.data.json();
        console.log('📦 Dados:', data);

        const options = {
            body: data.body || 'Nova notificação',
            icon: '📅',
            badge: '📅',
            tag: 'nutrirotina-notification',
            requireInteraction: false,
            data: data.data || {}
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'NutriRotina', options)
        );
    } catch (error) {
        console.error('❌ Erro ao processar notificação:', error);
    }
});

// Evento quando o usuário clica na notificação
self.addEventListener('notificationclick', (event) => {
    console.log('👆 Notificação clicada:', event.notification.tag);

    event.notification.close();

    // Abrir a janela do app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Se a janela tá aberta, foca nela
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Se não tá aberta, abre
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Evento quando o usuário fecha a notificação
self.addEventListener('notificationclose', (event) => {
    console.log('❌ Notificação fechada:', event.notification.tag);
});
