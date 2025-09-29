// ===== MÓDULO DE NOTIFICAÇÕES SEGURO =====
// Sistema avançado de notificações com segurança e acessibilidade

class SecureNotificationSystem {
    constructor() {
        this.notifications = new Map();
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupAccessibility();
        console.log('🔔 Sistema de notificações seguro inicializado');
    }

    createContainer() {
        // Criar container para notificações
        this.container = document.createElement('div');
        this.container.id = 'notifications-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-label', 'Notificações do sistema');
        this.container.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            pointer-events: none;
            max-width: 400px;
        `;

        document.body.appendChild(this.container);

        // Responsividade mobile
        const mediaQuery = window.matchMedia('(max-width: 640px)');
        const updatePosition = (e) => {
            if (e.matches) {
                this.container.style.cssText = `
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    right: 1rem;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    pointer-events: none;
                    max-width: none;
                `;
            } else {
                this.container.style.cssText = `
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    pointer-events: none;
                    max-width: 400px;
                `;
            }
        };

        mediaQuery.addListener(updatePosition);
        updatePosition(mediaQuery);
    }

    setupAccessibility() {
        // Configurar anúncios para leitores de tela
        this.ariaLiveRegion = document.createElement('div');
        this.ariaLiveRegion.setAttribute('aria-live', 'assertive');
        this.ariaLiveRegion.setAttribute('aria-atomic', 'true');
        this.ariaLiveRegion.className = 'sr-only';
        document.body.appendChild(this.ariaLiveRegion);
    }

    show(message, type = 'info', options = {}) {
        // Sanitizar mensagem
        const sanitizedMessage = this.sanitizeMessage(message);
        
        // Validar tipo
        const validTypes = ['success', 'error', 'warning', 'info'];
        if (!validTypes.includes(type)) {
            console.warn(`Tipo de notificação inválido: ${type}`);
            type = 'info';
        }

        // Configurações padrão
        const config = {
            duration: options.duration || this.defaultDuration,
            persistent: options.persistent || false,
            actions: options.actions || [],
            icon: options.icon || this.getDefaultIcon(type),
            ...options
        };

        // Verificar limite de notificações
        if (this.notifications.size >= this.maxNotifications) {
            this.removeOldest();
        }

        // Criar notificação
        const notification = this.createNotification(sanitizedMessage, type, config);
        
        // Adicionar ao container
        this.container.appendChild(notification.element);
        this.notifications.set(notification.id, notification);

        // Anunciar para leitores de tela
        this.announceToScreenReader(sanitizedMessage, type);

        // Animação de entrada
        this.animateIn(notification.element);

        // Auto-remover se não for persistente
        if (!config.persistent) {
            setTimeout(() => {
                this.remove(notification.id);
            }, config.duration);
        }

        return notification.id;
    }

    createNotification(message, type, config) {
        const id = this.generateId();
        
        // Criar elemento
        const element = document.createElement('div');
        element.id = `notification-${id}`;
        element.className = `notification notification-${type}`;
        element.setAttribute('role', type === 'error' ? 'alert' : 'status');
        element.setAttribute('aria-labelledby', `notification-${id}-message`);
        element.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
            border: 1px solid ${this.getBorderColor(type)};
            pointer-events: auto;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            min-width: 300px;
            max-width: 100%;
        `;

        // Conteúdo
        element.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <div style="flex-shrink: 0; font-size: 1.25rem; margin-top: 0.125rem;">
                    ${config.icon}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div id="notification-${id}-message" style="font-weight: 600; font-size: 0.875rem; line-height: 1.4; word-wrap: break-word;">
                        ${message}
                    </div>
                    ${config.actions.length > 0 ? this.createActions(config.actions, id) : ''}
                </div>
                <button type="button" 
                        class="notification-close" 
                        onclick="window.NotificationSystem.remove('${id}')"
                        aria-label="Fechar notificação"
                        style="
                            background: transparent;
                            border: none;
                            color: currentColor;
                            cursor: pointer;
                            padding: 0.25rem;
                            border-radius: 0.25rem;
                            opacity: 0.7;
                            transition: opacity 0.2s;
                            flex-shrink: 0;
                            font-size: 1rem;
                            line-height: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 1.5rem;
                            height: 1.5rem;
                        "
                        onmouseover="this.style.opacity='1'"
                        onmouseout="this.style.opacity='0.7'">
                    ×
                </button>
            </div>
            ${this.createProgressBar(config.duration, config.persistent)}
        `;

        return { id, element, type, config };
    }

    createActions(actions, notificationId) {
        const actionsHtml = actions.map(action => {
            const actionId = `action-${notificationId}-${this.generateId()}`;
            return `
                <button type="button" 
                        id="${actionId}"
                        class="notification-action"
                        onclick="${action.handler}"
                        style="
                            background: rgba(255, 255, 255, 0.2);
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            color: white;
                            padding: 0.375rem 0.75rem;
                            border-radius: 0.375rem;
                            font-size: 0.75rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                            margin-right: 0.5rem;
                            margin-top: 0.5rem;
                        "
                        onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'"
                        onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                    ${this.sanitizeMessage(action.label)}
                </button>
            `;
        }).join('');

        return `<div style="margin-top: 0.5rem;">${actionsHtml}</div>`;
    }

    createProgressBar(duration, persistent) {
        if (persistent) return '';

        return `
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.2);
                overflow: hidden;
            ">
                <div style="
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: translateX(-100%);
                    animation: progressBar ${duration}ms linear;
                "></div>
            </div>
            <style>
                @keyframes progressBar {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0%); }
                }
            </style>
        `;
    }

    animateIn(element) {
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    animateOut(element) {
        return new Promise(resolve => {
            element.style.transform = 'translateX(100%)';
            element.style.opacity = '0';
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                resolve();
            }, 300);
        });
    }

    async remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        await this.animateOut(notification.element);
        this.notifications.delete(id);
    }

    removeOldest() {
        const oldest = this.notifications.keys().next().value;
        if (oldest) {
            this.remove(oldest);
        }
    }

    clear() {
        const promises = Array.from(this.notifications.keys()).map(id => this.remove(id));
        return Promise.all(promises);
    }

    // Métodos de conveniência
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { ...options, duration: 8000 });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    // Utilitários
    sanitizeMessage(message) {
        if (typeof message !== 'string') {
            message = String(message);
        }

        // Escapar HTML
        const div = document.createElement('div');
        div.textContent = message;
        return div.innerHTML;
    }

    getDefaultIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    getBackgroundColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }

    getBorderColor(type) {
        const colors = {
            success: '#059669',
            error: '#dc2626',
            warning: '#d97706',
            info: '#2563eb'
        };
        return colors[type] || '#2563eb';
    }

    announceToScreenReader(message, type) {
        const announcement = `${type === 'error' ? 'Erro: ' : ''}${message}`;
        
        // Limpar anúncio anterior
        this.ariaLiveRegion.textContent = '';
        
        // Adicionar novo anúncio
        setTimeout(() => {
            this.ariaLiveRegion.textContent = announcement;
        }, 100);

        // Limpar após anúncio
        setTimeout(() => {
            this.ariaLiveRegion.textContent = '';
        }, 1000);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Sistema de confetes melhorado
class SecureConfettiSystem {
    constructor() {
        this.activeConfetti = [];
        this.maxConfetti = 100;
    }

    create(options = {}) {
        const config = {
            count: options.count || 50,
            colors: options.colors || ['#FFC107', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
            duration: options.duration || 3000,
            spread: options.spread || 1000,
            ...options
        };

        // Limitar confetes para performance
        const count = Math.min(config.count, this.maxConfetti - this.activeConfetti.length);

        for (let i = 0; i < count; i++) {
            this.createConfettiPiece(config);
        }

        // Limpar confetes antigos
        setTimeout(() => {
            this.cleanup();
        }, config.duration + 1000);
    }

    createConfettiPiece(config) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const size = 4 + Math.random() * 8;
        
        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            top: 50%;
            left: 50%;
            z-index: 10000;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            transform: translate(-50%, -50%);
        `;

        document.body.appendChild(confetti);
        this.activeConfetti.push(confetti);

        // Animação
        const animation = confetti.animate([
            {
                transform: 'translate(-50%, -50%) rotate(0deg) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${(Math.random() - 0.5) * config.spread}px, ${(Math.random() - 0.5) * config.spread}px) rotate(${Math.random() * 720}deg) scale(0)`,
                opacity: 0
            }
        ], {
            duration: config.duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
            this.removeFromActive(confetti);
        };
    }

    removeFromActive(confetti) {
        const index = this.activeConfetti.indexOf(confetti);
        if (index > -1) {
            this.activeConfetti.splice(index, 1);
        }
    }

    cleanup() {
        this.activeConfetti.forEach(confetti => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        });
        this.activeConfetti = [];
    }
}

// Inicializar sistemas
const notificationSystem = new SecureNotificationSystem();
const confettiSystem = new SecureConfettiSystem();

// Disponibilizar globalmente
window.NotificationSystem = notificationSystem;
window.ConfettiSystem = confettiSystem;

// Compatibilidade com código antigo
window.Notifications = {
    showNotification: (message, type, options) => notificationSystem.show(message, type, options),
    createConfetti: (options) => confettiSystem.create(options)
};

console.log('🎉 Sistemas de notificação e confetes seguros inicializados');