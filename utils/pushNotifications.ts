/**
 * Push Notification Manager
 * Handles browser push notifications for real-time updates
 */

interface NotificationOptions {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    actions?: Array<{ action: string; title: string }>;
}

class PushNotificationManager {
    private static instance: PushNotificationManager;
    private registration: ServiceWorkerRegistration | null = null;

    private constructor() { }

    static getInstance(): PushNotificationManager {
        if (!PushNotificationManager.instance) {
            PushNotificationManager.instance = new PushNotificationManager();
        }
        return PushNotificationManager.instance;
    }

    /**
     * Initialize push notifications
     */
    async initialize(): Promise<boolean> {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push notifications not supported');
            return false;
        }

        try {
            // Register service worker
            this.registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered for push notifications');
            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    /**
     * Request permission for notifications
     */
    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.warn('Notifications not supported');
            return 'denied';
        }

        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('Notification permission granted');
        }

        return permission;
    }

    /**
     * Subscribe to push notifications
     */
    async subscribe(): Promise<PushSubscription | null> {
        if (!this.registration) {
            await this.initialize();
        }

        try {
            const subscription = await this.registration?.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    process.env.VITE_VAPID_PUBLIC_KEY || ''
                ),
            });

            // Send subscription to server
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription),
            });

            return subscription || null;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return null;
        }
    }

    /**
     * Show a local notification
     */
    async showNotification(options: NotificationOptions): Promise<void> {
        const permission = await this.requestPermission();

        if (permission !== 'granted') {
            console.warn('Notification permission denied');
            return;
        }

        if (!this.registration) {
            await this.initialize();
        }

        const notificationOptions: NotificationOptions = {
            body: options.body,
            icon: options.icon || '/icon-192.png',
            badge: options.badge || '/badge-72.png',
            tag: options.tag || 'default',
            data: options.data,
            actions: options.actions || [],
            ...options,
        };

        await this.registration?.showNotification(options.title, notificationOptions);
    }

    /**
     * Predefined notification templates
     */
    async notifyAppointmentReady(vehicleMake: string, vehicleModel: string): Promise<void> {
        await this.showNotification({
            title: '🚗 Votre Véhicule est Prêt!',
            body: `Votre ${vehicleMake} ${vehicleModel} est prêt à être récupéré.`,
            tag: 'appointment-ready',
            actions: [
                { action: 'view', title: 'Voir Détails' },
                { action: 'dismiss', title: 'Plus Tard' },
            ],
        });
    }

    async notifyAppointmentReminder(date: string, service: string): Promise<void> {
        await this.showNotification({
            title: '📅 Rappel de Rendez-vous',
            body: `N'oubliez pas votre rendez-vous demain: ${service}`,
            tag: 'appointment-reminder',
        });
    }

    async notifyQuoteApproved(quoteNumber: string, amount: number): Promise<void> {
        await this.showNotification({
            title: '✅ Soumission Approuvée',
            body: `Votre soumission #${quoteNumber} de $${amount} a été approuvée!`,
            tag: 'quote-approved',
        });
    }

    async notifyMaintenanceDue(vehicleName: string, service: string): Promise<void> {
        await this.showNotification({
            title: '⚠️ Entretien Recommandé',
            body: `Votre ${vehicleName} nécessite: ${service}`,
            tag: 'maintenance-due',
            actions: [
                { action: 'book', title: 'Prendre RDV' },
                { action: 'later', title: 'Me Rappeler' },
            ],
        });
    }

    async notifyLoyaltyReward(points: number): Promise<void> {
        await this.showNotification({
            title: '🎁 Nouveaux Points!',
            body: `Vous avez gagné ${points} points de fidélité!`,
            tag: 'loyalty-reward',
        });
    }

    /**
     * Helper to convert VAPID key
     */
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }
}

export default PushNotificationManager.getInstance();
