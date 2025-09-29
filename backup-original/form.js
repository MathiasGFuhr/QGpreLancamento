// ===== MÓDULO DE FORMULÁRIO =====
// Gerenciamento de formulários e integração com Supabase

function initFormHandling() {
    console.log('🔍 Procurando formulário...');
    const form = document.getElementById('signup-form');
    
    if (form) {
        console.log('✅ Formulário encontrado e configurado!');
        form.addEventListener('submit', handleFormSubmit);
        
        // Configurar inputs
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
            input.addEventListener('input', handleInputChange);
        });
    } else {
        console.error('❌ Formulário não encontrado!');
    }
}

async function handleFormSubmit(e) {
    console.log('🚀 FORMULÁRIO SUBMETIDO - Função chamada!');
    e.preventDefault();
    
    // Obter credenciais da configuração simples
    const SUPABASE_URL = window.SUPABASE_CONFIG?.url;
    const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anonKey;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        showNotification('Erro: Credenciais do Supabase não encontradas. Recarregue a página.', 'error');
        return;
    }
    
    // Inicializar cliente Supabase
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    
    // Validação
    if (!name || !email) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor, insira um email válido!', 'error');
        return;
    }
    
    // Animação de loading
    const submitBtn = e.target.querySelector('.form-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Processando...';
    submitBtn.disabled = true;
    
    // Integração com Supabase
    try {
        console.log('=== DEBUG SUPABASE ===');
        console.log('URL:', SUPABASE_URL);
        console.log('Chave:', SUPABASE_ANON_KEY?.substring(0, 20) + '...');
        console.log('Dados a enviar:', { nome: name, email: email });
        
        // Testar conexão primeiro
        console.log('Testando conexão com Supabase...');
        
        // Inserir dados no Supabase
        const { data, error } = await supabaseClient
            .from('lista_de_espera')
            .insert([
                {
                    nome: name,
                    email: email
                }
            ]);
        
        console.log('Resposta do Supabase:');
        console.log('- Data:', data);
        console.log('- Error:', error);
        
        if (error) {
            console.error('ERRO DETALHADO:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            throw error;
        }
        
        console.log('✅ Dados salvos com sucesso:', data);
        
        // Sucesso
        showNotification('Parabéns! Você foi adicionado à lista VIP! 🎉', 'success');
        e.target.reset();
        
        // Adicionar confetes
        createConfetti();
        
        // Restaurar botão após um pequeno delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao salvar no Supabase:', error);
        
        // Verificar se é erro de email duplicado
        if (error.code === '23505') {
            showNotification('Este email já está cadastrado na nossa lista VIP!', 'warning');
        } else if (error.message.includes('Invalid API key')) {
            showNotification('Erro de configuração. Verifique as credenciais.', 'error');
        } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
            showNotification('Erro: Tabela não encontrada. Verifique a configuração.', 'error');
        } else {
            showNotification('Ops! Algo deu errado. Tente novamente.', 'error');
        }
        
        // Restaurar botão imediatamente em caso de erro
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleInputFocus(e) {
    const input = e.target;
    const container = input.closest('.form-group');
    
    // Animação GSAP se disponível
    if (typeof gsap !== 'undefined') {
        gsap.to(container, {
            y: -2,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    // Adicionar classe de foco
    container.classList.add('focused');
}

function handleInputBlur(e) {
    const input = e.target;
    const container = input.closest('.form-group');
    
    // Animação GSAP se disponível
    if (typeof gsap !== 'undefined') {
        gsap.to(container, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    // Remover classe de foco se vazio
    if (!input.value.trim()) {
        container.classList.remove('focused');
    }
}

function handleInputChange(e) {
    const input = e.target;
    const container = input.closest('.form-group');
    
    // Validação em tempo real para email
    if (input.type === 'email' && input.value) {
        if (isValidEmail(input.value)) {
            container.classList.add('valid');
            container.classList.remove('invalid');
        } else {
            container.classList.add('invalid');
            container.classList.remove('valid');
        }
    }
}

// Disponibilizar funções globalmente
window.FormHandler = {
    initFormHandling,
    handleFormSubmit,
    isValidEmail,
    handleInputFocus,
    handleInputBlur,
    handleInputChange
};