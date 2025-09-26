# 📁 Estrutura de Módulos JavaScript

Este diretório contém os módulos JavaScript refatorados do projeto QG da Aprovação.

## 🗂️ Estrutura de Arquivos

```
js/
├── config.js          # Configuração e inicialização do Supabase
├── notifications.js   # Sistema de notificações toast
├── threejs.js         # Animações 3D com Three.js
├── animations.js       # Animações GSAP e AOS
├── navigation.js       # Sistema de navegação e scroll spy
├── form.js            # Gerenciamento de formulários
├── main.js            # Arquivo principal de coordenação
└── README.md          # Esta documentação
```

## 🔧 Módulos

### `config.js`
- **Responsabilidade**: Configuração do Supabase e inicialização da aplicação
- **Funções principais**:
  - `initSupabase()` - Inicializa conexão com Supabase
  - `initializeApp()` - Coordena inicialização de todos os módulos
- **Dependências**: `load-env.js`, Supabase CDN

### `notifications.js`
- **Responsabilidade**: Sistema de notificações toast
- **Funções principais**:
  - `showNotification(message, type)` - Exibe notificação
  - `createConfetti()` - Efeito de confetes
  - `getNotificationIcon(type)` - Ícones das notificações
- **Dependências**: GSAP

### `threejs.js`
- **Responsabilidade**: Animações 3D e sistema de partículas
- **Funções principais**:
  - `initThreeJS()` - Inicializa cena 3D
  - `createParticleSystem()` - Sistema de partículas douradas
  - `createFloatingGeometries()` - Geometrias flutuantes
  - `animate3D()` - Loop de animação
- **Dependências**: Three.js

### `animations.js`
- **Responsabilidade**: Animações GSAP e AOS
- **Funções principais**:
  - `initGSAP()` - Configura animações GSAP
  - `initAOS()` - Configura Animate On Scroll
  - `initScrollEffects()` - Efeitos de parallax
  - `createRippleEffect()` - Efeito ripple em botões
- **Dependências**: GSAP, AOS

### `navigation.js`
- **Responsabilidade**: Sistema de navegação e scroll spy
- **Funções principais**:
  - `initNavigation()` - Configura navegação flutuante
  - `updateCurrentYear()` - Atualiza ano no footer
- **Dependências**: Nenhuma

### `form.js`
- **Responsabilidade**: Gerenciamento de formulários
- **Funções principais**:
  - `initFormHandling()` - Configura formulário
  - `handleFormSubmit()` - Processa envio do formulário
  - `isValidEmail()` - Validação de email
- **Dependências**: `config.js`, `notifications.js`

### `main.js`
- **Responsabilidade**: Coordenação de todos os módulos
- **Funções principais**:
  - `initializeApp()` - Inicializa todos os módulos
  - `addDynamicStyles()` - Adiciona estilos CSS dinâmicos
- **Dependências**: Todos os outros módulos

## 🔄 Fluxo de Inicialização

1. **`load-env.js`** - Carrega variáveis de ambiente
2. **`config.js`** - Inicializa Supabase e coordena app
3. **`main.js`** - Chama todos os módulos na ordem correta
4. **Módulos específicos** - Inicializam suas funcionalidades

## 🎯 Vantagens da Refatoração

- ✅ **Modularidade**: Cada funcionalidade em seu próprio arquivo
- ✅ **Manutenibilidade**: Fácil de encontrar e editar código específico
- ✅ **Reutilização**: Módulos podem ser reutilizados
- ✅ **Debugging**: Mais fácil identificar problemas
- ✅ **Organização**: Código bem estruturado e documentado

## 🚀 Como Usar

Os módulos são carregados automaticamente pelo HTML. Cada módulo expõe suas funções através de objetos globais:

- `window.Config` - Configuração e Supabase
- `window.Notifications` - Sistema de notificações
- `window.ThreeJS` - Animações 3D
- `window.Animations` - Animações GSAP/AOS
- `window.Navigation` - Sistema de navegação
- `window.FormHandler` - Gerenciamento de formulários
- `window.Main` - Coordenação principal
