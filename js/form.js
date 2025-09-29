// ===== MÓDULO DE FORMULÁRIO SEGURO =====
// Sistema avançado de validação e segurança para formulários

class SecureFormHandler {
    constructor() {
        this.form = null;
        this.inputs = {};
        this.validators = {};
        this.isSubmitting = false;
        this.attemptCount = 0;
        this.maxAttempts = 5;
        this.honeypot = null;
        this.init();
    }

    init() {
        this.setupForm();
        this.setupValidators();
        this.setupHoneypot();
        this.setupRealTimeValidation();
        this.setupSecurityMeasures();
        console.log('🔒 Sistema de formulário seguro inicializado');
    }

    setupForm() {
        this.form = document.getElementById('signup-form');
        if (!this.form) {
            console.error('❌ Formulário não encontrado');
            return;
        }

        // Capturar inputs
        this.inputs = {
            name: this.form.querySelector('#name'),
            email: this.form.querySelector('#email')
        };

        // Event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Prevenir múltiplos submits
        this.form.addEventListener('submit', (e) => {
            if (this.isSubmitting) {
                e.preventDefault();
                return false;
            }
        });

        console.log('✅ Formulário configurado com segurança');
    }

    setupValidators() {
        this.validators = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-ZÀ-ÿ\s\-'\.]+$/,
                sanitize: true,
                validate: this.validateName.bind(this)
            },
            email: {
                required: true,
                maxLength: 254,
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                sanitize: true,
                validate: this.validateEmail.bind(this)
            }
        };
    }

    setupHoneypot() {
        // Criar campo honeypot invisível para detectar bots
        this.honeypot = document.createElement('input');
        this.honeypot.type = 'text';
        this.honeypot.name = 'website';
        this.honeypot.style.cssText = `
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            opacity: 0 !important;
            pointer-events: none !important;
        `;
        this.honeypot.setAttribute('tabindex', '-1');
        this.honeypot.setAttribute('autocomplete', 'off');
        this.honeypot.setAttribute('aria-hidden', 'true');
        
        this.form.appendChild(this.honeypot);
    }

    setupRealTimeValidation() {
        Object.keys(this.inputs).forEach(fieldName => {
            const input = this.inputs[fieldName];
            if (!input) return;

            // Validação em tempo real
            input.addEventListener('input', () => {
                this.debounce(() => {
                    this.validateField(fieldName);
                }, 300)();
            });

            // Validação ao perder foco
            input.addEventListener('blur', () => {
                this.validateField(fieldName);
            });

            // Sanitização em tempo real
            input.addEventListener('input', () => {
                this.sanitizeInput(input);
            });
        });
    }

    setupSecurityMeasures() {
        // Detectar tentativas de automação
        let userInteracted = false;
        
        ['mousedown', 'keydown', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                userInteracted = true;
            }, { once: true });
        });

        this.form.addEventListener('submit', (e) => {
            if (!userInteracted) {
                e.preventDefault();
                this.logSecurityEvent('bot_submission_attempt');
                this.showError('Erro de validação. Tente novamente.');
                return false;
            }
        });

        // Detectar preenchimento muito rápido (possível bot)
        this.formStartTime = Date.now();
        this.form.addEventListener('submit', (e) => {
            const fillTime = Date.now() - this.formStartTime;
            if (fillTime < 2000) { // Menos de 2 segundos
                e.preventDefault();
                this.logSecurityEvent('fast_form_fill', { fillTime });
                this.showError('Por favor, preencha o formulário com mais cuidado.');
                return false;
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    sanitizeInput(input) {
        const originalValue = input.value;
        let sanitized = originalValue;

        // Remove caracteres perigosos
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        sanitized = sanitized.replace(/data:/gi, '');
        sanitized = sanitized.replace(/vbscript:/gi, '');

        // Sanitização específica por tipo de campo
        if (input.type === 'email') {
            sanitized = sanitized.toLowerCase().trim();
        } else if (input.name === 'name') {
            // Remove números e caracteres especiais suspeitos
            sanitized = sanitized.replace(/[<>{}[\]\\\/]/g, '');
        }

        if (sanitized !== originalValue) {
            input.value = sanitized;
            this.logSecurityEvent('input_sanitized', {
                field: input.name,
                original: originalValue,
                sanitized: sanitized
            });
        }
    }

    validateField(fieldName) {
        const input = this.inputs[fieldName];
        const validator = this.validators[fieldName];
        
        if (!input || !validator) return true;

        const value = input.value.trim();
        const errors = [];

        // Limpar erros anteriores
        this.clearFieldError(fieldName);

        // Validação obrigatória
        if (validator.required && !value) {
            errors.push('Este campo é obrigatório');
        }

        // Validação de comprimento
        if (value && validator.minLength && value.length < validator.minLength) {
            errors.push(`Mínimo de ${validator.minLength} caracteres`);
        }

        if (value && validator.maxLength && value.length > validator.maxLength) {
            errors.push(`Máximo de ${validator.maxLength} caracteres`);
        }

        // Validação de padrão
        if (value && validator.pattern && !validator.pattern.test(value)) {
            if (fieldName === 'email') {
                errors.push('Por favor, insira um e-mail válido');
            } else if (fieldName === 'name') {
                errors.push('Nome deve conter apenas letras, espaços e acentos');
            }
        }

        // Validação customizada
        if (value && validator.validate) {
            const customError = validator.validate(value);
            if (customError) {
                errors.push(customError);
            }
        }

        // Mostrar erros
        if (errors.length > 0) {
            this.showFieldError(fieldName, errors[0]);
            return false;
        } else {
            this.showFieldSuccess(fieldName);
            return true;
        }
    }

    validateName(name) {
        // Verificações específicas para nome
        if (name.length < 2) return 'Nome muito curto';
        if (name.length > 100) return 'Nome muito longo';
        
        // Verificar se contém pelo menos um espaço (nome e sobrenome)
        if (!name.includes(' ')) {
            return 'Por favor, insira nome e sobrenome';
        }

        // Verificar caracteres suspeitos
        if (/\d/.test(name)) return 'Nome não deve conter números';
        if (/<|>|&|"|'/.test(name)) return 'Nome contém caracteres inválidos';
        
        // Verificar nomes muito genéricos ou suspeitos
        const suspiciousNames = ['test', 'admin', 'user', 'guest', 'demo', 'sample'];
        const lowerName = name.toLowerCase();
        if (suspiciousNames.some(suspicious => lowerName.includes(suspicious))) {
            this.logSecurityEvent('suspicious_name', { name });
            return 'Por favor, insira seu nome real';
        }

        return null;
    }

    validateEmail(email) {
        // Validações específicas para email
        if (email.length > 254) return 'E-mail muito longo';
        if (email.includes('..')) return 'E-mail inválido';
        
        // Verificar domínios suspeitos
        const suspiciousDomains = [
            'tempmail.org', '10minutemail.com', 'guerrillamail.com',
            'mailinator.com', 'throwaway.email', 'temp-mail.org',
            'fakeinbox.com', 'trashmail.com'
        ];
        
        const domain = email.split('@')[1];
        if (domain && suspiciousDomains.includes(domain.toLowerCase())) {
            this.logSecurityEvent('suspicious_email_domain', { email, domain });
            return 'Por favor, use um e-mail permanente';
        }

        // Verificar padrões suspeitos
        if (/test|fake|spam|temp|trash/i.test(email)) {
            this.logSecurityEvent('suspicious_email_pattern', { email });
            return 'Por favor, use um e-mail válido';
        }

        return null;
    }

    showFieldError(fieldName, message) {
        const input = this.inputs[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (input) {
            input.classList.add('input-error');
            input.classList.remove('input-success');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    showFieldSuccess(fieldName) {
        const input = this.inputs[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (input) {
            input.classList.remove('input-error');
            input.classList.add('input-success');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    clearFieldError(fieldName) {
        const input = this.inputs[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (input) {
            input.classList.remove('input-error', 'input-success');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Verificar se já está enviando
        if (this.isSubmitting) return;

        // Verificar rate limiting
        if (!window.SecurityManager.checkRateLimit('form_submission')) {
            this.showError('Muitas tentativas. Aguarde um momento antes de tentar novamente.');
            return;
        }

        // Verificar tentativas máximas
        this.attemptCount++;
        if (this.attemptCount > this.maxAttempts) {
            this.showError('Limite de tentativas excedido. Recarregue a página.');
            this.logSecurityEvent('max_attempts_exceeded');
            return;
        }

        // Verificar honeypot
        if (this.honeypot && this.honeypot.value) {
            this.logSecurityEvent('honeypot_filled');
            this.showError('Erro de validação. Tente novamente.');
            return;
        }

        // Validar todos os campos
        let isValid = true;
        Object.keys(this.inputs).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showError('Por favor, corrija os erros antes de continuar.');
            return;
        }

        // Preparar dados
        const formData = {
            name: this.inputs.name.value.trim(),
            email: this.inputs.email.value.trim().toLowerCase(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: `${screen.width}x${screen.height}`,
            sessionId: window.SecurityManager.getSessionId()
        };

        // Criptografar dados sensíveis se necessário
        try {
            await this.submitForm(formData);
        } catch (error) {
            console.error('Erro no envio:', error);
            this.showError('Erro no envio. Tente novamente.');
            this.isSubmitting = false;
        }
    }

    async submitForm(formData) {
        this.isSubmitting = true;
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // UI de loading
        submitButton.classList.add('btn-loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Processando...';

        try {
            // Verificar credenciais do Supabase
            const SUPABASE_URL = window.SUPABASE_CONFIG?.url;
            const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anonKey;

            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                throw new Error('Configuração do banco de dados não encontrada');
            }

            // Inicializar cliente Supabase
            const { createClient } = supabase;
            const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

            console.log('📡 Enviando dados para o banco...');

            // Inserir dados
            const { data, error } = await supabaseClient
                .from('lista_de_espera')
                .insert([{
                    nome: formData.name,
                    email: formData.email,
                    dados_adicionais: {
                        userAgent: formData.userAgent,
                        language: formData.language,
                        timezone: formData.timezone,
                        screen: formData.screen,
                        sessionId: formData.sessionId
                    }
                }]);

            if (error) {
                console.error('Erro do Supabase:', error);
                
                // Tratar erros específicos
                if (error.code === '23505') {
                    this.showError('Este e-mail já está cadastrado na nossa lista VIP!');
                } else if (error.message.includes('Invalid API key')) {
                    this.showError('Erro de configuração. Contate o suporte.');
                } else {
                    this.showError('Erro no servidor. Tente novamente em alguns instantes.');
                }
                return;
            }

            console.log('✅ Dados salvos com sucesso!');

            // Sucesso
            this.showSuccess();
            this.resetForm();
            this.attemptCount = 0;

        } catch (error) {
            console.error('Erro geral:', error);
            this.showError('Erro inesperado. Tente novamente.');
            this.logSecurityEvent('form_submission_error', { error: error.message });
        } finally {
            // Restaurar botão
            this.isSubmitting = false;
            submitButton.classList.remove('btn-loading');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    showSuccess() {
        // Mostrar notificação de sucesso
        if (window.Notifications) {
            window.Notifications.showNotification(
                'Parabéns! Você foi adicionado à lista VIP! 🎉', 
                'success'
            );
            window.Notifications.createConfetti();
        }

        // Esconder formulário e mostrar mensagem de sucesso
        const formCard = this.form.closest('.form-card');
        if (formCard) {
            formCard.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                    <h3 style="color: var(--success-600); font-size: 1.5rem; margin-bottom: 1rem;">
                        Parabéns! Você está na lista VIP!
                    </h3>
                    <p style="color: var(--neutral-600); margin-bottom: 2rem;">
                        Em breve você receberá um e-mail com todas as informações sobre o lançamento e seus bônus exclusivos.
                    </p>
                    <div style="background: var(--success-50); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--success-200);">
                        <p style="color: var(--success-700); font-weight: 600; margin: 0;">
                            ✅ Acesso antecipado garantido<br>
                            🎁 Bônus exclusivos reservados<br>
                            💎 Preço especial de lançamento
                        </p>
                    </div>
                </div>
            `;
        }
    }

    showError(message) {
        if (window.Notifications) {
            window.Notifications.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    resetForm() {
        this.form.reset();
        Object.keys(this.inputs).forEach(fieldName => {
            this.clearFieldError(fieldName);
        });
    }

    logSecurityEvent(type, details = {}) {
        if (window.SecurityManager) {
            window.SecurityManager.logSuspiciousActivity(type, {
                ...details,
                form: 'signup',
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new SecureFormHandler();
});

// Disponibilizar globalmente
window.SecureFormHandler = SecureFormHandler;