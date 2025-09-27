// ===== MÓDULO THREE.JS =====
// Sistema de partículas 3D e animações

let scene, camera, renderer, particles, floatingGeometries = [];

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Detectar se é mobile
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Configuração da cena
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: !isMobile, // Desabilitar antialias no mobile
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

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
    // Reduzir partículas no mobile para melhor performance
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const particleCount = isMobile ? 300 : 1000;
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
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createFloatingGeometries() {
    // Reduzir geometrias no mobile
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const geometryCount = isMobile ? 2 : 5;
    
    const geometries = [
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.SphereGeometry(0.3, 8, 6),
        new THREE.ConeGeometry(0.3, 0.6, 8),
        new THREE.TorusGeometry(0.3, 0.1, 8, 16),
        new THREE.OctahedronGeometry(0.4)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xFFC107, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0xFF6B6B, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x4ECDC4, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x45B7D1, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x96CEB4, wireframe: true })
    ];
    
    for (let i = 0; i < geometryCount; i++) {
        const geometry = geometries[i];
        const material = materials[i];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Posição aleatória
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;
        
        // Rotação aleatória
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Velocidade de rotação
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        scene.add(mesh);
        floatingGeometries.push(mesh);
    }
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Detectar se é mobile para otimizar animações
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Rotacionar partículas (velocidade reduzida no mobile)
    if (particles) {
        const rotationSpeed = isMobile ? 0.0005 : 0.001;
        particles.rotation.y += rotationSpeed;
        particles.rotation.x += rotationSpeed * 0.5;
    }
    
    // Animar geometrias flutuantes (menos frequente no mobile)
    if (!isMobile || Date.now() % 2 === 0) { // Apenas a cada 2 frames no mobile
        floatingGeometries.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
            
            // Movimento flutuante (reduzido no mobile)
            const floatSpeed = isMobile ? 0.0005 : 0.001;
            mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.position.x) * floatSpeed;
        });
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Disponibilizar funções globalmente
window.ThreeJS = {
    initThreeJS,
    createParticleSystem,
    createFloatingGeometries,
    animate3D,
    onWindowResize
};