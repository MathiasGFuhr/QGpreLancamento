// ===== ARQUIVO PRINCIPAL SEGURO =====
// Coordenação segura de todos os módulos do sistema

class SecureApp {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.initStartTime = performance.now();
        this.securityChecks = [];
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando QG da Aprovação - Sistema Seguro...');

        try {
            // Verificações de segurança iniciais
            await this.performSecurityChecks();

            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inicializar módulos em ordem de prioridade
            await this.initializeModules();

            // Configurar monitoramento
            this.setupMonitoring();

            // Finalizar inicialização
            this.finishInitialization();

        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.handleInitializationError(error);
        }
    }

    async performSecurityChecks() {
        console.log('🔒 Executando verificações de segurança...');

        // Verificar integridade do DOM
        this.securityChecks.push(this.checkDOMIntegrity());

        // Verificar se está em HTTPS (em produção)
        this.securityChecks.push(this.checkHTTPS());

        // Verificar se há scripts maliciosos
        this.securityChecks.push(this.checkMaliciousScripts());

        // Verificar se o usuário está banido
        this.securityChecks.push(this.checkUserBan());

        // Aguardar todas as verificações
        const results = await Promise.allSettled(this.securityChecks);
        
        const failed = results.filter(result => result.status === 'rejected');
        if (failed.length > 0) {
            console.warn('⚠️ Algumas verificações de segurança falharam:', failed);
        }

        console.log('✅ Verificações de segurança concluídas');
    }

    checkDOMIntegrity() {
        return new Promise((resolve, reject) => {
            // Verificar elementos essenciais
            const essentialElements = [
                '#signup-form',
                '.navbar',
                '.hero',
                '#benefits',
                '#about'
            ];

            const missing = essentialElements.filter(selector => !document.querySelector(selector));
            
            if (missing.length > 0) {
                reject(new Error(`Elementos essenciais não encontrados: ${missing.join(', ')}`));
            } else {
                resolve();
            }
        });
    }

    checkHTTPS() {
        return new Promise((resolve, reject) => {
            if (location.protocol !== 'https:' && 
                location.hostname !== 'localhost' && 
                location.hostname !== '127.0.0.1') {
                
                console.warn('⚠️ Site não está usando HTTPS');
                // Não rejeitar, apenas avisar
            }
            resolve();
        });
    }

    checkMaliciousScripts() {
        return new Promise((resolve, reject) => {
            const scripts = document.querySelectorAll('script');
            const allowedDomains = [
                'unpkg.com',
                'cdnjs.cloudflare.com',
                'fonts.googleapis.com',
                location.hostname
            ];

            for (const script of scripts) {
                if (script.src) {
                    const isAllowed = allowedDomains.some(domain => 
                        script.src.includes(domain) || script.src.startsWith('/')
                    );

                    if (!isAllowed) {
                        console.warn('⚠️ Script de domínio não autorizado:', script.src);
                        if (window.SecurityManager) {
                            window.SecurityManager.logSuspiciousActivity('unauthorized_script', {
                                src: script.src
                            });
                        }
                    }
                }
            }

            resolve();
        });
    }

    checkUserBan() {
        return new Promise((resolve, reject) => {
            if (window.SecurityManager && window.SecurityManager.isClientBanned()) {
                reject(new Error('Usuário temporariamente banido'));
            } else {
                resolve();
            }
        });
    }

    async initializeModules() {
        console.log('⚙️ Inicializando módulos...');

        const moduleInitializers = [
            { name: 'Performance', init: () => this.initPerformance() },
            { name: 'Notifications', init: () => this.initNotifications() },
            { name: 'Navigation', init: () => this.initNavigation() },
            { name: 'Animations', init: () => this.initAnimations() },
            { name: 'ThreeJS', init: () => this.initThreeJS() },
            { name: 'Forms', init: () => this.initForms() },
            { name: 'Analytics', init: () => this.initAnalytics() }
        ];

        for (const module of moduleInitializers) {
            try {
                console.log(`📦 Inicializando ${module.name}...`);
                await module.init();
                this.modules.set(module.name, { status: 'loaded', timestamp: Date.now() });
                console.log(`✅ ${module.name} inicializado`);
            } catch (error) {
                console.error(`❌ Erro ao inicializar ${module.name}:`, error);
                this.modules.set(module.name, { status: 'error', error, timestamp: Date.now() });
            }
        }
    }

    initPerformance() {
        return new Promise((resolve) => {
            if (window.Performance) {
                window.Performance.initPerformanceOptimizations();
            }
            resolve();
        });
    }

    initNotifications() {
        return new Promise((resolve) => {
            // Notificações já são inicializadas automaticamente
            resolve();
        });
    }

    initNavigation() {
        return new Promise((resolve) => {
            if (window.Navigation) {
                window.Navigation.initNavigation();
            }
            resolve();
        });
    }

    initAnimations() {
        return new Promise((resolve) => {
            if (window.Animations) {
                // Detectar preferência de movimento reduzido
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (!prefersReducedMotion) {
                    window.Animations.initAnimations();
                } else {
                    console.log('🎭 Animações desabilitadas (preferência do usuário)');
                }
            }
            resolve();
        });
    }

    initThreeJS() {
        return new Promise((resolve) => {
            // Verificar se deve carregar Three.js baseado na performance
            const performanceMode = window.Performance ? window.Performance.getPerformanceMode() : 'high';
            
            if (performanceMode !== 'low' && window.ThreeJS) {
                try {
                    window.ThreeJS.initThreeJS();
                } catch (error) {
                    console.warn('⚠️ Erro ao inicializar Three.js:', error);
                }
            } else {
                console.log('🎨 Three.js desabilitado (modo de baixa performance)');
            }
            resolve();
        });
    }

    initForms() {
        return new Promise((resolve) => {
            // Formulários seguros já são inicializados automaticamente
            resolve();
        });
    }

    initAnalytics() {
        return new Promise((resolve) => {
            // Inicializar analytics apenas se o usuário consentir
            if (this.hasAnalyticsConsent()) {
                this.setupAnalytics();
            }
            resolve();
        });
    }

    hasAnalyticsConsent() {
        // Verificar se o usuário consentiu com analytics
        return localStorage.getItem('analytics_consent') === 'true';
    }

    setupAnalytics() {
        // Configurar analytics de forma segura
        console.log('📊 Configurando analytics...');
        
        // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
        // Sempre respeitando a privacidade do usuário
    }

    setupMonitoring() {
        console.log('📈 Configurando monitoramento...');

        // Monitorar erros JavaScript
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'javascript_error', {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                message: event.message
            });
        });

        // Monitorar promises rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'unhandled_promise_rejection', {
                reason: event.reason
            });
        });

        // Monitorar performance
        this.setupPerformanceMonitoring();

        // Monitorar visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👁️ Página ficou oculta');
            } else {
                console.log('👁️ Página ficou visível');
            }
        });
    }

    setupPerformanceMonitoring() {
        // Monitorar métricas de performance
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('📊 LCP:', lastEntry.startTime);
            });

            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observer não suportado');
            }

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    console.log('📊 FID:', entry.processingStart - entry.startTime);
                });
            });

            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID observer não suportado');
            }
        }
    }

    handleError(error, type, details = {}) {
        console.error(`❌ ${type}:`, error, details);

        // Log para sistema de monitoramento
        if (window.SecurityManager) {
            window.SecurityManager.logSuspiciousActivity('application_error', {
                type,
                error: error.toString(),
                stack: error.stack,
                ...details
            });
        }

        // Em desenvolvimento, mostrar erro detalhado
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            console.error('Erro detalhado:', error);
        }
    }

    handleInitializationError(error) {
        console.error('❌ Falha crítica na inicialização:', error);

        // Mostrar mensagem de erro amigável
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ef4444;
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        errorMessage.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">
                Ops! Algo deu errado
            </h3>
            <p style="margin: 0 0 1rem 0; opacity: 0.9;">
                Ocorreu um erro ao carregar a página. 
                Tente recarregar ou entre em contato conosco.
            </p>
            <button onclick="location.reload()" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                font-weight: 600;
            ">
                Recarregar Página
            </button>
        `;

        document.body.appendChild(errorMessage);
    }

    finishInitialization() {
        const initTime = performance.now() - this.initStartTime;
        this.isInitialized = true;

        console.log('✅ QG da Aprovação inicializado com sucesso!');
        console.log(`⏱️ Tempo de inicialização: ${Math.round(initTime)}ms`);
        console.log('🎯 Sistema: QG da Aprovação - Landing Page');
        console.log('⚡ Tecnologias: Security + Three.js + GSAP + AOS + Supabase');
        console.log('💎 Desenvolvido por: Mathias Fuhr');

        // Estatísticas dos módulos
        console.group('📦 Status dos Módulos:');
        this.modules.forEach((status, name) => {
            const icon = status.status === 'loaded' ? '✅' : '❌';
            console.log(`${icon} ${name}: ${status.status}`);
        });
        console.groupEnd();

        // Verificar se há atualizações disponíveis
        this.checkForUpdates();

        // Mostrar banner de desenvolvimento (apenas em dev)
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            this.showDevelopmentBanner();
        }
    }

    checkForUpdates() {
        // Verificar se há atualizações do service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration) {
                    registration.update();
                }
            });
        }
    }

    showDevelopmentBanner() {
        console.log('%c🚧 MODO DE DESENVOLVIMENTO 🚧', 'background: #f59e0b; color: white; padding: 8px; border-radius: 4px; font-weight: bold;');
        console.log('Recursos de debug ativados. Não usar em produção.');
    }

    // Métodos públicos para interação
    getModuleStatus(moduleName) {
        return this.modules.get(moduleName);
    }

    getAllModulesStatus() {
        return Object.fromEntries(this.modules);
    }

    isReady() {
        return this.isInitialized;
    }

    restart() {
        console.log('🔄 Reiniciando aplicação...');
        location.reload();
    }
}

// Função para aguardar a aplicação estar pronta
function waitForApp(timeout = 10000) {
    return new Promise((resolve, reject) => {
        const checkReady = () => {
            if (window.SecureApp && window.SecureApp.isReady()) {
                resolve(window.SecureApp);
            } else {
                setTimeout(checkReady, 100);
            }
        };

        checkReady();

        // Timeout
        setTimeout(() => {
            reject(new Error('Timeout aguardando aplicação'));
        }, timeout);
    });
}

// Inicializar aplicação
const app = new SecureApp();

// Disponibilizar globalmente
window.SecureApp = app;
window.waitForApp = waitForApp;

// Adicionar estilos dinâmicos para melhor UX
const style = document.createElement('style');
style.textContent = `
    /* Loading states */
    .btn-loading {
        position: relative;
        color: transparent !important;
        pointer-events: none;
    }
    
    .btn-loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1rem;
        height: 1rem;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    /* Input states */
    .input-success {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
    
    .input-error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .input-error-message {
        display: none;
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    /* Accessibility improvements */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    /* Focus improvements */
    *:focus-visible {
        outline: 2px solid #fbbf24;
        outline-offset: 2px;
    }
    
    /* Smooth transitions */
    * {
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
    }
`;

document.head.appendChild(style);

console.log('🚀 Sistema principal carregado e pronto!');