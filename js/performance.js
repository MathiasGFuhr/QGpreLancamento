// ===== MÓDULO DE PERFORMANCE =====
// Otimizações automáticas baseadas no dispositivo

let performanceMode = 'high'; // high, medium, low

function initPerformanceOptimizations() {
    detectDeviceCapabilities();
    optimizeForDevice();
    setupPerformanceMonitoring();
}

function detectDeviceCapabilities() {
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 4;
    const isSlowConnection = navigator.connection && navigator.connection.effectiveType === 'slow-2g';
    
    // Determinar modo de performance
    if (isMobile && (isLowEnd || isSlowConnection)) {
        performanceMode = 'low';
    } else if (isMobile || isLowEnd) {
        performanceMode = 'medium';
    } else {
        performanceMode = 'high';
    }
    
    console.log(`🚀 Modo de Performance: ${performanceMode.toUpperCase()}`);
}

function optimizeForDevice() {
    const body = document.body;
    
    // Aplicar classes de otimização
    body.classList.add(`perf-${performanceMode}`);
    
    if (performanceMode === 'low') {
        // Desabilitar Three.js completamente
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        // Desabilitar animações pesadas
        body.classList.add('no-heavy-animations');
        
        // Reduzir qualidade de imagens
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.imageRendering = 'pixelated';
        });
    } else if (performanceMode === 'medium') {
        // Manter Three.js mas com configurações reduzidas
        body.classList.add('reduced-animations');
    }
}

function setupPerformanceMonitoring() {
    // Monitorar FPS
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // Ajustar performance baseado no FPS
            if (fps < 30 && performanceMode !== 'low') {
                console.warn('⚠️ FPS baixo detectado, otimizando...');
                downgradePerformance();
            }
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    measureFPS();
}

function downgradePerformance() {
    if (performanceMode === 'high') {
        performanceMode = 'medium';
        document.body.className = document.body.className.replace('perf-high', 'perf-medium');
        document.body.classList.add('reduced-animations');
    } else if (performanceMode === 'medium') {
        performanceMode = 'low';
        document.body.className = document.body.className.replace('perf-medium', 'perf-low');
        document.body.classList.add('no-heavy-animations');
        
        // Desabilitar Three.js
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
}

// Disponibilizar funções globalmente
window.Performance = {
    initPerformanceOptimizations,
    detectDeviceCapabilities,
    optimizeForDevice,
    setupPerformanceMonitoring,
    getPerformanceMode: () => performanceMode
};
