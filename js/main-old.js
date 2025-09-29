// ===== ARQUIVO PRINCIPAL REFATORADO =====
// Coordenação de todos os módulos

// Aguardar DOM carregar e então inicializar todos os módulos
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o load-env.js terminou
    setTimeout(() => {
        initializeApp();
    }, 100);
});

// Função principal de inicialização
function initializeApp() {
    console.log('🚀 Iniciando aplicação QG da Aprovação...');
    
    // Inicializar otimizações de performance primeiro
    if (window.Performance) {
        window.Performance.initPerformanceOptimizations();
    }
    
    // Inicializar componentes
    if (window.Navigation) window.Navigation.initNavigation();
    if (window.FormHandler) window.FormHandler.initFormHandling();
    if (window.Animations) window.Animations.initAnimations();
    
    // Inicializar Three.js apenas se não estiver em modo de baixa performance
    if (window.ThreeJS && (!window.Performance || window.Performance.getPerformanceMode() !== 'low')) {
        window.ThreeJS.initThreeJS();
    }
    
    const perfMode = window.Performance ? window.Performance.getPerformanceMode() : 'PADRÃO';
    console.log(`✅ App inicializada com sucesso! (Modo: ${perfMode.toUpperCase()})`);
    console.log('🎯 O QG da Aprovação - Landing Page');
    console.log('⚡ Desenvolvido com tecnologias modernas');
    console.log('🚀 Three.js + GSAP + AOS');
    console.log('💎 Design by Mathias Fuhr');
}

// Adicionar estilos dinâmicos
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 193, 7, 0.6); }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar estilos dinâmicos
addDynamicStyles();