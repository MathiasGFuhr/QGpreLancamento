// ===== SERVICE WORKER SEGURO =====
// Cache estratégico e funcionalidades offline

const CACHE_NAME = 'qg-aprovacao-v1.0.0';
const STATIC_CACHE = 'qg-static-v1.0.0';
const DYNAMIC_CACHE = 'qg-dynamic-v1.0.0';

// Recursos para cache
const STATIC_ASSETS = [
    '/',
    '/index-new.html',
    '/styles-new.css',
    '/js/main-secure.js',
    '/js/security.js',
    '/js/form-secure.js',
    '/js/notifications-secure.js',
    '/js/config-simple.js',
    '/js/performance.js',
    '/js/navigation.js',
    '/js/animations.js',
    '/js/threejs.js',
    '/images/logo.svg',
    '/images/mathiasFuhr.png',
    '/manifest.json'
];

// URLs que nunca devem ser cacheadas
const NEVER_CACHE = [
    '/api/',
    'chrome-extension://',
    'moz-extension://',
    'safari-extension://'
];

// URLs externas permitidas para cache
const ALLOWED_EXTERNAL = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://unpkg.com',
    'https://cdnjs.cloudflare.com'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('📦 Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Service Worker: Cacheando recursos estáticos');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
                    cache: 'reload' // Força buscar da rede durante install
                })));
            })
            .then(() => {
                console.log('✅ Service Worker: Instalação concluída');
                return self.skipWaiting(); // Ativa imediatamente
            })
            .catch(error => {
                console.error('❌ Service Worker: Erro na instalação:', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker: Ativando...');
    
    event.waitUntil(
        // Limpar caches antigos
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Ativação concluída');
                return self.clients.claim(); // Controla todas as páginas imediatamente
            })
            .catch(error => {
                console.error('❌ Service Worker: Erro na ativação:', error);
            })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    const { request } = event;
    const { url, method } = request;

    // Ignorar requisições não-GET
    if (method !== 'GET') return;

    // Ignorar URLs que nunca devem ser cacheadas
    if (NEVER_CACHE.some(pattern => url.includes(pattern))) {
        return;
    }

    // Estratégia de cache baseada no tipo de recurso
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request));
    } else if (isExternalResource(url)) {
        event.respondWith(staleWhileRevalidate(request));
    } else if (isAPICall(url)) {
        event.respondWith(networkFirst(request));
    } else {
        event.respondWith(cacheFirst(request));
    }
});

// Estratégia: Cache First (para recursos estáticos)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('❌ Cache First error:', error);
        
        // Fallback para página offline
        if (request.destination === 'document') {
            return caches.match('/offline.html') || new Response('Página offline não disponível');
        }
        
        return new Response('Recurso não disponível offline');
    }
}

// Estratégia: Network First (para APIs)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Network First error:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Dados não disponíveis offline', { status: 503 });
    }
}

// Estratégia: Stale While Revalidate (para recursos externos)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.error('❌ Stale While Revalidate error:', error);
        return cachedResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Utilitários para identificar tipos de recursos
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.includes(asset)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.svg') ||
           url.includes('.webp');
}

function isExternalResource(url) {
    return ALLOWED_EXTERNAL.some(domain => url.startsWith(domain));
}

function isAPICall(url) {
    return url.includes('/api/') || url.includes('supabase.co');
}

// Limpeza periódica de cache
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        cleanOldCaches();
    }
});

async function cleanOldCaches() {
    const caches = await caches.keys();
    const oldCaches = caches.filter(cache => 
        cache.startsWith('qg-') && 
        cache !== STATIC_CACHE && 
        cache !== DYNAMIC_CACHE
    );
    
    await Promise.all(oldCaches.map(cache => caches.delete(cache)));
    console.log('🗑️ Service Worker: Caches antigos removidos');
}

// Notificações push (para futuras implementações)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const options = {
        body: event.data.text(),
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver detalhes',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('QG da Aprovação', options)
    );
});

// Clique em notificações
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Sincronização em background (para envios offline)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Implementar sincronização de dados offline
    console.log('🔄 Service Worker: Sincronização em background');
}

console.log('🚀 Service Worker: Carregado e pronto!');