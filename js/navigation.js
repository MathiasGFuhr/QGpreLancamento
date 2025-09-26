// ===== MÓDULO DE NAVEGAÇÃO =====
// Sistema de navegação e scroll spy

function initNavigation() {
    const nav = document.querySelector('.floating-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll spy com detecção de fundo
    let ticking = false;
    
    function updateNavAppearance() {
        const scrollY = window.scrollY;
        
        // Detectar se está sobre seção com fundo branco
        const benefitsSection = document.querySelector('.benefits-section');
        const signupSection = document.querySelector('.signup-section');
        
        let isOverWhiteSection = false;
        
        if (benefitsSection) {
            const benefitsTop = benefitsSection.offsetTop - 100;
            const benefitsBottom = benefitsSection.offsetTop + benefitsSection.offsetHeight + 100;
            if (scrollY >= benefitsTop && scrollY <= benefitsBottom) {
                isOverWhiteSection = true;
            }
        }
        
        if (signupSection && !isOverWhiteSection) {
            const signupTop = signupSection.offsetTop - 100;
            const signupBottom = signupSection.offsetTop + signupSection.offsetHeight + 100;
            if (scrollY >= signupTop && scrollY <= signupBottom) {
                isOverWhiteSection = true;
            }
        }
        
        // Adicionar classes baseadas no contexto
        if (scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        if (isOverWhiteSection) {
            nav.classList.add('over-white');
        } else {
            nav.classList.remove('over-white');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavAppearance);
            ticking = true;
        }
    });
    
    // Smooth scroll para links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Atualizar ano atual
    updateCurrentYear();
}

function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Disponibilizar funções globalmente
window.Navigation = {
    initNavigation,
    updateCurrentYear
};