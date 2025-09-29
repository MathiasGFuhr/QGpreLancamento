// ===== MÓDULO DE SEGURANÇA =====
// Sistema avançado de segurança e proteção

class SecurityManager {
    constructor() {
        this.rateLimiter = new Map();
        this.bannedIPs = new Set();
        this.sessionTokens = new Map();
        this.csrfTokens = new Map();
        this.init();
    }

    init() {
        this.setupCSP();
        this.setupSecurityHeaders();
        this.initializeRateLimiting();
        this.setupInputSanitization();
        this.monitorSuspiciousActivity();
        console.log('🔒 Sistema de segurança inicializado');
    }

    // Content Security Policy
    setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
        document.head.appendChild(meta);
    }

    // Headers de segurança
    setupSecurityHeaders() {
        // X-Frame-Options
        const frameOptions = document.createElement('meta');
        frameOptions.httpEquiv = 'X-Frame-Options';
        frameOptions.content = 'DENY';
        document.head.appendChild(frameOptions);

        // X-Content-Type-Options
        const contentType = document.createElement('meta');
        contentType.httpEquiv = 'X-Content-Type-Options';
        contentType.content = 'nosniff';
        document.head.appendChild(contentType);

        // Referrer Policy
        const referrer = document.createElement('meta');
        referrer.name = 'referrer';
        referrer.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(referrer);
    }

    // Rate Limiting
    initializeRateLimiting() {
        this.rateLimits = {
            form_submission: { max: 3, window: 60000 }, // 3 tentativas por minuto
            page_load: { max: 100, window: 60000 }, // 100 carregamentos por minuto
            api_call: { max: 10, window: 60000 } // 10 chamadas de API por minuto
        };
    }

    checkRateLimit(action, identifier = this.getClientId()) {
        const now = Date.now();
        const key = `${action}_${identifier}`;
        const limit = this.rateLimits[action];

        if (!limit) return true;

        if (!this.rateLimiter.has(key)) {
            this.rateLimiter.set(key, []);
        }

        const attempts = this.rateLimiter.get(key);
        
        // Remove tentativas antigas
        const validAttempts = attempts.filter(time => now - time < limit.window);
        
        if (validAttempts.length >= limit.max) {
            this.logSuspiciousActivity('rate_limit_exceeded', { action, identifier });
            return false;
        }

        validAttempts.push(now);
        this.rateLimiter.set(key, validAttempts);
        return true;
    }

    // Sanitização de entrada
    setupInputSanitization() {
        // Interceptar todos os formulários
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.sanitizeFormData(e);
            }
        });

        // Interceptar inputs em tempo real
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.sanitizeInput(e.target);
            }
        });
    }

    sanitizeInput(input) {
        const value = input.value;
        let sanitized = value;

        // Remove scripts maliciosos
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // Remove eventos JavaScript
        sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        
        // Remove javascript: URLs
        sanitized = sanitized.replace(/javascript:/gi, '');
        
        // Escape caracteres HTML especiais
        if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
            sanitized = this.escapeHtml(sanitized);
        }

        if (sanitized !== value) {
            input.value = sanitized;
            this.logSuspiciousActivity('input_sanitized', { 
                original: value, 
                sanitized: sanitized,
                element: input.name || input.id
            });
        }
    }

    sanitizeFormData(event) {
        const formData = new FormData(event.target);
        let hasChanges = false;

        for (let [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                const sanitized = this.sanitizeString(value);
                if (sanitized !== value) {
                    const input = event.target.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = sanitized;
                        hasChanges = true;
                    }
                }
            }
        }

        if (hasChanges) {
            this.logSuspiciousActivity('form_data_sanitized', { form: event.target.id });
        }
    }

    sanitizeString(str) {
        if (typeof str !== 'string') return str;

        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/data:/gi, '')
            .replace(/vbscript:/gi, '')
            .trim();
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Validação avançada
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(email)) return false;
        if (email.length > 254) return false;
        if (email.includes('..')) return false;
        
        // Lista de domínios suspeitos
        const suspiciousDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
        const domain = email.split('@')[1];
        if (suspiciousDomains.includes(domain)) {
            this.logSuspiciousActivity('suspicious_email_domain', { email, domain });
            return false;
        }

        return true;
    }

    validateName(name) {
        if (typeof name !== 'string') return false;
        if (name.length < 2 || name.length > 50) return false;
        
        // Apenas letras, espaços, hífens e acentos
        const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
        if (!nameRegex.test(name)) return false;
        
        // Não permitir números ou caracteres especiais suspeitos
        if (/\d/.test(name) || /<|>|&|"|'/.test(name)) {
            this.logSuspiciousActivity('suspicious_name_format', { name });
            return false;
        }

        return true;
    }

    // Criptografia de dados sensíveis
    async encryptData(data, key = null) {
        if (!key) {
            key = await this.generateKey();
        }

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: window.crypto.getRandomValues(new Uint8Array(12)) },
            key,
            dataBuffer
        );

        return {
            encrypted: Array.from(new Uint8Array(encrypted)),
            key: await window.crypto.subtle.exportKey('raw', key)
        };
    }

    async generateKey() {
        return await window.crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    }

    // Monitoramento de atividades suspeitas
    monitorSuspiciousActivity() {
        // Monitorar tentativas de manipulação do DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.checkSuspiciousElement(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });

        // Monitorar tentativas de acesso ao console
        this.protectConsole();

        // Monitorar eventos suspeitos
        this.monitorSuspiciousEvents();
    }

    checkSuspiciousElement(element) {
        // Verificar elementos script maliciosos
        if (element.tagName === 'SCRIPT') {
            const src = element.src;
            const content = element.textContent;
            
            if (src && !this.isAllowedScript(src)) {
                this.logSuspiciousActivity('unauthorized_script', { src });
                element.remove();
                return;
            }

            if (content && this.containsSuspiciousCode(content)) {
                this.logSuspiciousActivity('suspicious_script_content', { content });
                element.remove();
                return;
            }
        }

        // Verificar iframes maliciosos
        if (element.tagName === 'IFRAME') {
            this.logSuspiciousActivity('unauthorized_iframe', { src: element.src });
            element.remove();
        }
    }

    isAllowedScript(src) {
        const allowedDomains = [
            'unpkg.com',
            'cdnjs.cloudflare.com',
            'cdn.jsdelivr.net',
            'fonts.googleapis.com'
        ];
        
        return allowedDomains.some(domain => src.includes(domain));
    }

    containsSuspiciousCode(code) {
        const suspiciousPatterns = [
            /eval\s*\(/,
            /Function\s*\(/,
            /document\.write/,
            /innerHTML\s*=/,
            /outerHTML\s*=/,
            /document\.cookie/,
            /localStorage\./,
            /sessionStorage\./,
            /XMLHttpRequest/,
            /fetch\s*\(/
        ];

        return suspiciousPatterns.some(pattern => pattern.test(code));
    }

    protectConsole() {
        // Desabilitar console em produção
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            const noop = () => {};
            const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
            
            methods.forEach(method => {
                console[method] = noop;
            });
        }

        // Detectar tentativas de uso do console
        let devToolsOpen = false;
        const threshold = 160;

        const detectDevTools = () => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    this.logSuspiciousActivity('devtools_opened');
                }
            } else {
                devToolsOpen = false;
            }
        };

        window.addEventListener('resize', detectDevTools);
        detectDevTools();
    }

    monitorSuspiciousEvents() {
        // Monitorar tentativas de cópia de dados
        document.addEventListener('copy', (e) => {
            const selection = window.getSelection().toString();
            if (selection.length > 100) {
                this.logSuspiciousActivity('large_data_copy', { length: selection.length });
            }
        });

        // Monitorar tentativas de cola maliciosa
        document.addEventListener('paste', (e) => {
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            if (this.containsSuspiciousCode(pastedData)) {
                e.preventDefault();
                this.logSuspiciousActivity('suspicious_paste_blocked', { data: pastedData });
            }
        });

        // Monitorar cliques suspeitos
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                const href = e.target.href;
                if (href && !this.isAllowedLink(href)) {
                    e.preventDefault();
                    this.logSuspiciousActivity('suspicious_link_blocked', { href });
                }
            }
        });
    }

    isAllowedLink(href) {
        try {
            const url = new URL(href);
            const allowedProtocols = ['http:', 'https:', 'mailto:'];
            return allowedProtocols.includes(url.protocol);
        } catch {
            return false;
        }
    }

    // Sistema de log de segurança
    logSuspiciousActivity(type, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            clientId: this.getClientId(),
            sessionId: this.getSessionId()
        };

        // Log local (desenvolvimento)
        console.warn('🚨 Atividade suspeita detectada:', logEntry);

        // Em produção, enviar para sistema de monitoramento
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            this.sendSecurityLog(logEntry);
        }

        // Incrementar contador de atividades suspeitas
        this.incrementSuspiciousActivity();
    }

    async sendSecurityLog(logEntry) {
        try {
            // Aqui você pode enviar para seu sistema de monitoramento
            // Exemplo com Supabase ou outro serviço
            await fetch('/api/security-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCSRFToken()
                },
                body: JSON.stringify(logEntry)
            });
        } catch (error) {
            console.error('Erro ao enviar log de segurança:', error);
        }
    }

    incrementSuspiciousActivity() {
        const clientId = this.getClientId();
        const count = (localStorage.getItem(`suspicious_${clientId}`) || 0) + 1;
        localStorage.setItem(`suspicious_${clientId}`, count);

        // Banir temporariamente após muitas atividades suspeitas
        if (count >= 10) {
            this.temporaryBan(clientId);
        }
    }

    temporaryBan(clientId) {
        const banTime = Date.now() + (30 * 60 * 1000); // 30 minutos
        localStorage.setItem(`banned_${clientId}`, banTime);
        
        this.showSecurityWarning('Atividade suspeita detectada. Acesso temporariamente restrito.');
        
        // Desabilitar funcionalidades
        this.disableInteractions();
    }

    disableInteractions() {
        document.body.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';
        
        setTimeout(() => {
            location.reload();
        }, 5000);
    }

    showSecurityWarning(message) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(220, 38, 38, 0.95);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            z-index: 999999;
            text-align: center;
            padding: 20px;
        `;
        warning.textContent = message;
        document.body.appendChild(warning);
    }

    // Utilitários
    getClientId() {
        let clientId = localStorage.getItem('client_id');
        if (!clientId) {
            clientId = this.generateUUID();
            localStorage.setItem('client_id', clientId);
        }
        return clientId;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = this.generateUUID();
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    getCSRFToken() {
        let token = this.csrfTokens.get('form');
        if (!token) {
            token = this.generateUUID();
            this.csrfTokens.set('form', token);
        }
        return token;
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Verificar se cliente está banido
    isClientBanned() {
        const clientId = this.getClientId();
        const banTime = localStorage.getItem(`banned_${clientId}`);
        
        if (banTime && Date.now() < parseInt(banTime)) {
            return true;
        }
        
        return false;
    }

    // Limpar dados de segurança
    clearSecurityData() {
        const clientId = this.getClientId();
        localStorage.removeItem(`suspicious_${clientId}`);
        localStorage.removeItem(`banned_${clientId}`);
    }
}

// Inicializar sistema de segurança
const securityManager = new SecurityManager();

// Disponibilizar globalmente
window.SecurityManager = securityManager;

// Verificar se cliente está banido ao carregar
if (securityManager.isClientBanned()) {
    securityManager.showSecurityWarning('Acesso temporariamente restrito devido a atividade suspeita.');
    securityManager.disableInteractions();
}