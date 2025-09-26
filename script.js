// ===== CONFIGURAÇÃO INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar componentes
    initThreeJS();
    initAOS();
    initGSAP();
    initNavigation();
    initFormHandling();
    initScrollEffects();
    initParallax();
    initFloatingElements();
    
    console.log('🚀 App inicializada com sucesso!');
}

// ===== THREE.JS 3D BACKGROUND =====
let scene, camera, renderer, particles, particleSystem;

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Configuração da cena
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Criar sistema de partículas
    createParticleSystem();
    
    // Criar geometrias flutuantes
    createFloatingGeometries();
    
    // Posicionar câmera
    camera.position.z = 5;
    
    // Iniciar animação
    animate3D();
    
    // Responsividade
    window.addEventListener('resize', onWindowResize);
}

function createParticleSystem() {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Posições aleatórias
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        // Cores douradas
        colors[i] = 1.0;     // R
        colors[i + 1] = 0.84; // G
        colors[i + 2] = 0.0;  // B
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createFloatingGeometries() {
    // Criar cubos flutuantes
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        cube.userData = {
            rotationSpeed: {
                x: Math.random() * 0.02,
                y: Math.random() * 0.02,
                z: Math.random() * 0.02
            }
        };
        
        scene.add(cube);
    }
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Rotacionar partículas
    if (particleSystem) {
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;
    }
    
    // Animar geometrias
    scene.children.forEach(child => {
        if (child.userData && child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
            child.rotation.z += child.userData.rotationSpeed.z;
        }
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===== INICIALIZAÇÃO AOS =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
}

// ===== INICIALIZAÇÃO GSAP =====
function initGSAP() {
    if (typeof gsap === 'undefined') return;
    
    // Registrar plugins
    gsap.registerPlugin(ScrollTrigger);
    
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
    
    // Garantir que os elementos das features estejam visíveis
    gsap.set(['.section-header', '.feature-card', '.section-title', '.section-subtitle'], { 
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
        ease: 'elastic.out(1, 0.8)',
        delay: 0.3
    });
    
    // Animação da marca d'água
    gsap.from('.watermark', {
        scale: 0,
        opacity: 0,
        rotation: -45,
        duration: 2,
        ease: 'power2.out',
        delay: 1
    });
    
    // Ativar animações GSAP modernas
    const heroTl = gsap.timeline({ delay: 0.5 });
    heroTl
        .from('.hero-badge', { 
            opacity: 0, 
            y: 50, 
            scale: 0.6,
            rotation: -10,
            duration: 1.2, 
            ease: 'elastic.out(1, 0.8)' 
        })
        .from('.hero-title', { 
            opacity: 0, 
            y: 60, 
            scale: 0.9,
            duration: 1.2, 
            ease: 'power3.out' 
        }, '-=0.6')
        .from('.hero-subtitle', { 
            opacity: 0, 
            y: 40, 
            duration: 1, 
            ease: 'power2.out' 
        }, '-=0.4')
        .from('.hero-cta', { 
            opacity: 0, 
            y: 40, 
            scale: 0.9,
            duration: 1, 
            ease: 'back.out(1.7)' 
        }, '-=0.4')
    
    // Animação especial do foguete
    gsap.fromTo('.rocket-emoji', 
        { 
            scale: 0, 
            rotation: -180,
            y: 20
        },
        { 
            scale: 1, 
            rotation: 0,
            y: 0,
            duration: 1.5, 
            ease: 'elastic.out(1, 0.6)',
            delay: 0.8
        }
    );
    
    // Animação das floating cards melhorada
    gsap.fromTo('.floating-card', 
        {
            opacity: 0,
            scale: 0.6,
            y: 100,
            rotation: -10,
            x: -50
        },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            x: 0,
            duration: 1.5,
            stagger: {
                amount: 0.8,
                from: "random"
            },
            ease: 'elastic.out(1, 0.6)',
            delay: 1.5
        }
    );
    
    // Garantir que as features sejam sempre visíveis
    gsap.set('.feature-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        visibility: 'visible',
        display: 'block'
    });

    // Garantir que os ícones das features sejam sempre visíveis
    gsap.set('.feature-icon', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        visibility: 'visible',
        display: 'block'
    });
    
    // Garantir que toda a seção features seja sempre visível
    gsap.set('.features-section', {
        opacity: 1,
        visibility: 'visible',
        display: 'block'
    });
    
    // Garantir que a seção about seja sempre visível
    gsap.set('.about-section', {
        opacity: 1,
        visibility: 'visible',
        display: 'flex'
    });
    
    gsap.set('.profile-card', {
        opacity: 1,
        visibility: 'visible',
        display: 'block'
    });
    
    // Forçar visibilidade permanente das features
    function forceFeaturesVisibility() {
        const featuresElements = document.querySelectorAll('.features-section, .features-section *, .section-header, .section-title, .section-subtitle, .features-grid, .feature-card, .feature-icon, .feature-title, .feature-description');
        featuresElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.display = element.classList.contains('features-grid') ? 'grid' : 'block';
            element.style.transform = 'none';
        });
    }
    
    // Executar imediatamente e a cada segundo
    forceFeaturesVisibility();
    setInterval(forceFeaturesVisibility, 1000);
    
    // Forçar visibilidade da seção about
    function forceAboutVisibility() {
        const aboutElements = document.querySelectorAll('.about-section, .about-section *, .profile-card, .profile-name, .profile-subtitle, .profile-badges, .badge');
        aboutElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.display = element.classList.contains('about-section') ? 'flex' : 
                                  element.classList.contains('profile-badges') ? 'flex' : 'block';
        });
    }
    
    // Executar imediatamente e a cada segundo
    forceAboutVisibility();
    setInterval(forceAboutVisibility, 1000);

    // Hover animation para os ícones
    document.querySelectorAll('.feature-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.3,
                rotation: 15,
                y: -5,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
        });
        
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
    
    // Animação do profile card
    gsap.from('.profile-card', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%'
        },
        opacity: 0,
        scale: 0.7,
        rotation: 15,
        y: 80,
        duration: 1.5,
        ease: 'elastic.out(1, 0.8)'
    });
    
    // Animação do formulário
    gsap.from('.signup-form .form-group', {
        scrollTrigger: {
            trigger: '.signup-section',
            start: 'top 80%'
        },
        opacity: 0,
        x: -80,
        y: 30,
        scale: 0.9,
        duration: 1,
        stagger: {
            amount: 0.3,
            from: "start"
        },
        ease: 'back.out(1.7)'
    });
}

// ===== NAVEGAÇÃO =====
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
            console.log('Nav sobre seção branca ativada');
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
        
        // Atualizar link ativo
        updateActiveNavLink();
    });
    
    // Smooth scroll para links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== MANIPULAÇÃO DE FORMULÁRIO =====
function initFormHandling() {
    const form = document.getElementById('signup-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Efeitos nos inputs
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
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
    
    // Simular envio (substituir por integração real)
    setTimeout(() => {
        showNotification('Parabéns! Você foi adicionado à lista VIP! 🎉', 'success');
        e.target.reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Animação de sucesso melhorada
        gsap.to(submitBtn, {
            scale: 1.1,
            duration: 0.3,
            ease: 'back.out(1.7)',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.to(submitBtn, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            }
        });
        
        // Adicionar confetes
        createConfetti();
        
    }, 2000);
}

function handleInputFocus(e) {
    const input = e.target;
    const formGroup = input.closest('.form-group');
    
    gsap.to(input, {
        scale: 1.02,
        y: -2,
        duration: 0.4,
        ease: 'back.out(1.7)'
    });
    
    // Adicionar glow effect
    if (formGroup.querySelector('.input-glow')) {
        gsap.to(formGroup.querySelector('.input-glow'), {
            opacity: 0.3,
            scale: 1.05,
            duration: 0.4,
            ease: 'power2.out'
        });
    }
}

function handleInputBlur(e) {
    const input = e.target;
    const formGroup = input.closest('.form-group');
    
    gsap.to(input, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
    });
    
    // Remover glow effect
    if (formGroup.querySelector('.input-glow')) {
        gsap.to(formGroup.querySelector('.input-glow'), {
            opacity: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
        });
    }
}

function handleInputChange(e) {
    const input = e.target;
    
    // Validação em tempo real com animação
    if (input.type === 'email') {
        const isValid = isValidEmail(input.value);
        const color = isValid ? '#10b981' : '#ef4444';
        
        gsap.to(input, {
            borderColor: color,
            boxShadow: `0 0 0 3px ${color}20`,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Adicionar ícone de validação
        if (isValid && !input.parentNode.querySelector('.validation-icon')) {
            const icon = document.createElement('span');
            icon.className = 'validation-icon';
            icon.innerHTML = '✓';
            icon.style.cssText = `
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #10b981;
                font-weight: bold;
                font-size: 16px;
            `;
            input.parentNode.appendChild(icon);
            
            gsap.fromTo(icon, 
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        } else if (!isValid) {
            const existingIcon = input.parentNode.querySelector('.validation-icon');
            if (existingIcon) {
                gsap.to(existingIcon, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => existingIcon.remove()
                });
            }
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== EFEITO CONFETTI =====
function createConfetti() {
    const colors = ['#ffd700', '#ffed4e', '#00d4ff', '#8b5cf6', '#ec4899'];
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
            pointer-events: none;
            z-index: 10000;
            border-radius: 50%;
        `;
        
        document.body.appendChild(confetti);
        
        // Animação GSAP para o confetti
        gsap.fromTo(confetti, 
            { 
                x: 0, 
                y: 0, 
                rotation: 0, 
                scale: 0 
            },
            { 
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                rotation: Math.random() * 720,
                scale: Math.random() * 1.5 + 0.5,
                duration: 2 + Math.random() * 2,
                ease: 'power2.out',
                onComplete: () => confetti.remove()
            }
        );
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Estilos
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Animação de entrada com GSAP
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }
        });
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// ===== EFEITOS DE SCROLL =====
function initScrollEffects() {
    // Parallax para shapes
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`;
        });
        
        // Parallax para orbs
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = 0.3 + (index * 0.2);
            const yPos = scrollY * speed;
            orb.style.transform = `translate(${index % 2 === 0 ? '-' : ''}${yPos * 0.1}px, ${yPos}px) scale(${1 + scrollY * 0.0001})`;
        });
    });
}

// ===== EFEITO PARALLAX =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}


// ===== ELEMENTOS FLUTUANTES =====
function initFloatingElements() {
    // Adicionar movimento de mouse para floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                scale: 1.08,
                rotation: 2,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
    
    // Movimento baseado no mouse para o hero
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;
            
            // Mover shapes baseado no mouse
            const shapes = hero.querySelectorAll('.shape');
            shapes.forEach((shape, index) => {
                const intensity = (index + 1) * 8;
                gsap.to(shape, {
                    x: xPercent * intensity,
                    y: yPercent * intensity,
                    rotation: xPercent * 10,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            });
            
            // Mover badge baseado no mouse
            const badge = hero.querySelector('.hero-badge');
            if (badge) {
                gsap.to(badge, {
                    x: xPercent * 5,
                    y: yPercent * 5,
                    rotation: xPercent * 2,
                    duration: 1,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    // Efeito hover especial para o badge
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.addEventListener('mouseenter', () => {
            gsap.to(heroBadge, {
                scale: 1.1,
                y: -5,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
            
            gsap.to('.rocket-emoji', {
                scale: 1.3,
                rotation: 15,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
        });
        
        heroBadge.addEventListener('mouseleave', () => {
            gsap.to(heroBadge, {
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
            
            gsap.to('.rocket-emoji', {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    }
    
    // Efeito hover para os logos
    const navLogo = document.querySelector('.nav-logo');
    const footerLogo = document.querySelector('.footer-logo');
    
    [navLogo, footerLogo].forEach(logo => {
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                gsap.to(logo, {
                    scale: 1.15,
                    rotation: 10,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            });
            
            logo.addEventListener('mouseleave', () => {
                gsap.to(logo, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        }
    });
}

// ===== EFEITOS DE HOVER AVANÇADOS =====
function initAdvancedHoverEffects() {
    // Feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.icon-3d');
            if (icon) {
                gsap.to(icon, {
                    rotationY: 360,
                    rotationX: 15,
                    scale: 1.2,
                    y: -5,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.icon-3d');
            if (icon) {
                gsap.to(icon, {
                    rotationY: 0,
                    rotationX: 0,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    });
    
    // Botões com efeito ripple
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.8s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    // Animação GSAP para o ripple
    gsap.fromTo(ripple, 
        { scale: 0, opacity: 1 },
        { 
            scale: 1, 
            opacity: 0, 
            duration: 0.8, 
            ease: 'power2.out',
            onComplete: () => ripple.remove()
        }
    );
}

// ===== CSS DINÂMICO PARA ANIMAÇÕES =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4); }
        }
        
        .notification {
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            font-size: 18px;
            animation: bounce 0.6s ease-in-out;
        }
        
        .notification-message {
            font-size: 14px;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== PERFORMANCE E OTIMIZAÇÃO =====
function optimizePerformance() {
    // Lazy loading para elementos pesados
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('loaded');
                lazyObserver.unobserve(element);
            }
        });
    });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
    
    // Throttle para eventos de scroll
    let ticking = false;
    
    function updateOnScroll() {
        // Código de scroll otimizado aqui
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// ===== INICIALIZAÇÃO FINAL =====
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    initAdvancedHoverEffects();
    optimizePerformance();
    
    // Easter egg
    console.log(`
    🎯 O QG da Aprovação - Landing Page
    ⚡ Desenvolvido com tecnologias modernas
    🚀 Three.js + GSAP + AOS
    💎 Design by Mathias Fuhr
    `);
    
    // Atualizar ano atual no footer
    updateCurrentYear();
});

// Atualizar ano atual no footer
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// ===== UTILITÁRIOS =====
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== EXPORT PARA MÓDULOS (SE NECESSÁRIO) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        showNotification,
        isValidEmail
    };
}