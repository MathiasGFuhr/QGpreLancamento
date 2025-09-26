// ===== CONFIGURAÇÃO SIMPLES E DIRETA =====
// Configuração do Supabase sem dependências externas

// Configuração direta das credenciais
const SUPABASE_CONFIG = {
    url: 'https://atfwpespuvdbksuwmbgv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZndwZXNwdXZkYmtzdXdtYmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTAwMTcsImV4cCI6MjA3NDQ4NjAxN30.woLvSDhD2K3X8uHf8noTOxgloIerV5E0a76bec0vn8I'
};

// Disponibilizar globalmente
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

console.log('✅ Configuração do Supabase carregada!');
console.log('🔗 URL:', SUPABASE_CONFIG.url);
console.log('🔑 Key:', SUPABASE_CONFIG.anonKey.substring(0, 20) + '...');
