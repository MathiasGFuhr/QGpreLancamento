// ===== MÓDULO DE ANIMAÇÕES =====
// Animações GSAP e AOS

function initAnimations() {
    initGSAP();
    initAOS();
    initScrollEffects();
    initParallax();
    initFloatingElements();
    initAdvancedHoverEffects();
}

function initGSAP() {
    if (typeof gsap === 'undefined') return;
    
    // Registrar plugins
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Garantir que todos os elementos do hero estejam visíveis inicialmente
    gsap.set(['.hero-badge', '.hero-title', '.hero-subtitle', '.hero-cta'], { 
        opacity: 1, 
        visibility: 'visible',
        display: 'block',
        clearProps: 'transform'
    });
    gsap.set('.floating-card', { 
        opacity: 1, 
        visibility: 'visible',
        clearProps: 'transform'
    });
    
    // Garantir que os elementos das benefits estejam visíveis
    gsap.set(['.section-header', '.benefit-card', '.section-title', '.section-subtitle'], { 
        opacity: 1, 
        visibility: 'visible',
        display: 'block',
        clearProps: 'transform'
    });
    
    // Animação do logo na navegação
    gsap.from('.nav-logo', {
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: 'back.out(1.7)',
        delay: 0.5
    });
    
    // Animação dos links de navegação (se existirem)
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length > 0) {
        gsap.from('.nav-links a', {
            y: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.8
        });
    }
    
    // Animação do hero
    gsap.from('.hero-badge', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1
    });
    
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 1.2
    });
    
    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.4
    });
    
    gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.6
    });
    
    // Animação das benefits
    const benefitCards = document.querySelectorAll('.benefit-card');
    if (benefitCards.length > 0) {
        gsap.from('.benefit-card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.benefits-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    // Animação do about (se existir)
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        gsap.from('.about-content', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    // Animação do footer (se existir)
    const footerContent = document.querySelector('.footer-content');
    if (footerContent) {
        gsap.from('.footer-content', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    }
}

function initAOS() {
    if (typeof AOS === 'undefined') return;
    
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 100
    });
}

function initScrollEffects() {
    // Parallax para elementos de fundo
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

function initParallax() {
    // Parallax para shapes de fundo
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach(shape => {
        if (typeof gsap !== 'undefined') {
            gsap.to(shape, {
                y: -100,
                scrollTrigger: {
                    trigger: shape,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    });
}

function initFloatingElements() {
    // Animação flutuante para cards
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach(card => {
        if (typeof gsap !== 'undefined') {
            gsap.to(card, {
                y: -10,
                duration: 2,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1
            });
        }
    });
}

function initAdvancedHoverEffects() {
    // Efeitos hover avançados para benefit cards
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach(card => {
        const icon = card.querySelector('.benefit-icon');
        
        if (icon) {
            card.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(icon, {
                        scale: 1.2,
                        rotation: 360,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            });
        }
    });
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(ripple, 
            { scale: 0, opacity: 1 },
            { 
                scale: 2, 
                opacity: 0, 
                duration: 0.6, 
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            }
        );
    } else {
        // Fallback sem GSAP
        setTimeout(() => ripple.remove(), 600);
    }
}

// Disponibilizar funções globalmente
window.Animations = {
    initAnimations,
    initGSAP,
    initAOS,
    initScrollEffects,
    initParallax,
    initFloatingElements,
    initAdvancedHoverEffects,
    createRippleEffect
};