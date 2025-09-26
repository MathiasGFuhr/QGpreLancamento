// ===== MÓDULO DE CONFIGURAÇÃO =====
// Configuração do Supabase e variáveis globais

let SUPABASE_URL, SUPABASE_ANON_KEY, supabaseClient;

async function initSupabase() {
    // Aguardar até que as variáveis estejam disponíveis
    let attempts = 0;
    while (!window.ENV && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    // Configuração do Supabase - Lendo do .env
    SUPABASE_URL = window.ENV?.SUPABASE_URL || window.ENV?.VITE_SUPABASE_URL;
    SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || window.ENV?.VITE_SUPABASE_ANON_KEY;

    // Verificar se as credenciais foram carregadas
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ ERRO: Credenciais do Supabase não encontradas!');
        console.error('Verifique se o arquivo .env existe e contém SUPABASE_URL e SUPABASE_ANON_KEY');
        console.error('Variáveis disponíveis:', Object.keys(window.ENV || {}));
        throw new Error('Credenciais do Supabase não configuradas no .env');
    }

    // Inicializar cliente Supabase
    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase inicializado com sucesso!');
    console.log('🔍 Debug - URL:', SUPABASE_URL);
    console.log('🔍 Debug - Key (primeiros 20 chars):', SUPABASE_ANON_KEY?.substring(0, 20) + '...');
}

// Exportar funções e variáveis
export { initSupabase, supabaseClient, SUPABASE_URL, SUPABASE_ANON_KEY };