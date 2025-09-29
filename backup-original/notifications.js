// ===== MÓDULO DE NOTIFICAÇÕES =====
// Sistema de notificações toast

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Estilos melhorados
    Object.assign(notification.style, {
        position: 'fixed',
        top: '30px',
        right: '30px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        fontSize: '16px',
        fontWeight: '600',
        maxWidth: '400px',
        border: type === 'success' ? '2px solid #059669' : type === 'error' ? '2px solid #dc2626' : '2px solid #2563eb',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Animação de entrada com GSAP
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(notification, 
            { x: 400, opacity: 0, scale: 0.8 },
            { 
                x: 0, 
                opacity: 1, 
                scale: 1, 
                duration: 0.6, 
                ease: 'back.out(1.7)' 
            }
        );
        
        // Remover após 5 segundos com animação
        setTimeout(() => {
            gsap.to(notification, {
                x: 400,
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }
            });
        }, 5000);
    } else {
        // Fallback sem GSAP
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

function createConfetti() {
    const colors = ['#FFC107', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 50%;
            left: 50%;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animação GSAP se disponível
        if (typeof gsap !== 'undefined') {
            gsap.to(confetti, {
                x: (Math.random() - 0.5) * 1000,
                y: (Math.random() - 0.5) * 1000,
                rotation: Math.random() * 720,
                scale: Math.random() * 2,
                duration: 2 + Math.random() * 2,
                ease: 'power2.out',
                onComplete: () => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }
            });
        } else {
            // Fallback sem GSAP
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }
    }
}

// Disponibilizar funções globalmente
window.Notifications = {
    showNotification,
    getNotificationIcon,
    createConfetti
};