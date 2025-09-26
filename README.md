# 🚀 QG da Aprovação - Landing Page

Landing page moderna e responsiva para captação de leads do sistema "QG da Aprovação" - uma ferramenta de estudos para concursos públicos.

## ✨ Características

- 🎨 **Design Moderno**: Interface limpa e profissional
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em todos os dispositivos
- ⚡ **Animações Avançadas**: Three.js, GSAP e AOS para experiências imersivas
- 🔒 **Integração Supabase**: Formulário funcional com banco de dados
- 🎯 **Otimizado para Conversão**: Foco na captação de leads
- 🚀 **Performance**: Carregamento rápido e otimizado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com variáveis CSS
- **JavaScript ES6+** - Funcionalidades interativas
- **Three.js** - Animações 3D e partículas
- **GSAP** - Animações suaves e performáticas
- **AOS** - Animações on scroll

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados
- **Row Level Security** - Segurança de dados

## 📁 Estrutura do Projeto

```
QGpreLancamento/
├── 📄 index.html              # Página principal
├── 📄 styles.css              # Estilos CSS
├── 📄 .env                    # Variáveis de ambiente (não commitado)
├── 📄 .gitignore              # Arquivos ignorados pelo Git
├── 📄 README.md               # Esta documentação
├── 📁 images/                 # Imagens e assets
│   ├── logo.svg
│   ├── study-bg.svg
│   ├── workspace.svg
│   └── mathiasFuhr.png
└── 📁 js/                     # Módulos JavaScript
    ├── 📄 load-env.js         # Carregador de variáveis de ambiente
    ├── 📄 config.js           # Configuração e Supabase
    ├── 📄 notifications.js    # Sistema de notificações
    ├── 📄 threejs.js          # Animações 3D
    ├── 📄 animations.js       # Animações GSAP/AOS
    ├── 📄 navigation.js       # Sistema de navegação
    ├── 📄 form.js             # Gerenciamento de formulários
    ├── 📄 main.js             # Coordenação principal
    └── 📄 README.md           # Documentação dos módulos
```

## 🚀 Como Usar

### 1. Configuração do Supabase

1. **Crie um projeto no Supabase**:
   - Acesse [supabase.com](https://supabase.com)
   - Crie uma nova conta ou faça login
   - Crie um novo projeto

2. **Configure o banco de dados**:
   ```sql
   -- Criar tabela
   CREATE TABLE lista_de_espera (
       id BIGSERIAL PRIMARY KEY,
       nome TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       data_cadastro TIMESTAMPTZ DEFAULT NOW(),
       status TEXT DEFAULT 'ativo',
       created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Habilitar RLS
   ALTER TABLE lista_de_espera ENABLE ROW LEVEL SECURITY;
   
   -- Criar política
   CREATE POLICY "Permitir inserção pública" ON lista_de_espera
   FOR INSERT WITH CHECK (true);
   ```

3. **Configure as credenciais**:
   - Crie o arquivo `.env` na raiz do projeto
   - Adicione suas credenciais:
   ```env
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

### 2. Executar o Projeto

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd QGpreLancamento
   ```

2. **Configure o Supabase** (seguir passos acima)

3. **Abra o projeto**:
   - Use um servidor local (Live Server, Python, etc.)
   - Ou abra diretamente o `index.html`

## 🎨 Seções da Landing Page

### Hero Section
- Badge "Em Breve" animado
- Título principal impactante
- Subtítulo explicativo
- Call-to-action destacado
- Fundo com partículas 3D

### Benefícios
- 3 cards com benefícios principais
- Animações on scroll
- Ícones interativos

### Sobre o Criador
- História pessoal
- Card de perfil
- Tags de identificação

### Formulário de Captação
- Campos de nome e email
- Validação em tempo real
- Integração com Supabase
- Notificações de sucesso/erro

### Footer
- Informações de contato
- Links sociais
- Copyright dinâmico

## 🔧 Módulos JavaScript

O projeto utiliza uma arquitetura modular:

- **`config.js`** - Configuração do Supabase
- **`notifications.js`** - Sistema de notificações
- **`threejs.js`** - Animações 3D
- **`animations.js`** - Animações GSAP/AOS
- **`navigation.js`** - Sistema de navegação
- **`form.js`** - Gerenciamento de formulários
- **`main.js`** - Coordenação principal

## 🎯 Funcionalidades

### Animações
- Partículas 3D douradas
- Geometrias flutuantes
- Animações on scroll
- Efeitos hover
- Transições suaves

### Formulário
- Validação em tempo real
- Integração com Supabase
- Notificações toast
- Efeito confetes no sucesso
- Tratamento de erros

### Navegação
- Menu flutuante
- Scroll spy
- Detecção de fundo
- Smooth scroll

## 📱 Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: 575px, 768px, 1024px, 1200px
- **Tipografia**: Escalas responsivas
- **Espaçamentos**: Adaptáveis ao dispositivo

## 🚀 Performance

- **Lazy Loading**: Carregamento otimizado
- **Minificação**: Código otimizado
- **CDN**: Bibliotecas externas via CDN
- **Caching**: Headers apropriados

## 🔒 Segurança

- **RLS**: Row Level Security no Supabase
- **Validação**: Validação client-side e server-side
- **Sanitização**: Dados sanitizados
- **HTTPS**: Conexões seguras

## 📊 Analytics

O projeto está preparado para integração com:
- Google Analytics
- Facebook Pixel
- Hotjar
- Outras ferramentas de análise

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

**Mathias Fuhr**
- Técnico em Enfermagem
- Futuro Policial
- Desenvolvedor Full Stack
- Criador do QG da Aprovação

---

**🚀 QG da Aprovação - Sua central de comando para aprovação em concursos!**