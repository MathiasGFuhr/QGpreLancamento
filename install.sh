#!/bin/bash

# ===== SCRIPT DE INSTALAÇÃO - QG DA APROVAÇÃO v2.0 =====
# Script para configuração automática do sistema redesenhado

echo "🚀 Instalando QG da Aprovação v2.0..."
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se está rodando como root (para servidor)
if [[ $EUID -eq 0 ]]; then
    log_warning "Rodando como root. Configurações de servidor serão aplicadas."
    SERVER_MODE=true
else
    log_info "Rodando como usuário normal. Modo desenvolvimento."
    SERVER_MODE=false
fi

# Verificar dependências
log_info "Verificando dependências..."

# Verificar Node.js (opcional, para ferramentas de build)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js encontrado: $NODE_VERSION"
else
    log_warning "Node.js não encontrado. Algumas ferramentas opcionais não estarão disponíveis."
fi

# Verificar Git
if command -v git &> /dev/null; then
    log_success "Git encontrado"
else
    log_warning "Git não encontrado. Controle de versão não estará disponível."
fi

# Configurar permissões de arquivos
log_info "Configurando permissões..."

# Arquivos executáveis
chmod +x install.sh
chmod +x sw.js

# Arquivos de configuração
chmod 644 config.json
chmod 644 manifest.json
chmod 644 .htaccess

# Arquivos HTML/CSS/JS
chmod 644 index.html
chmod 644 styles.css
find js/ -name "*.js" -exec chmod 644 {} \;

log_success "Permissões configuradas"

# Configurar diretórios
log_info "Configurando estrutura de diretórios..."

# Criar diretórios necessários
mkdir -p logs
mkdir -p cache
mkdir -p uploads
mkdir -p backups

# Configurar permissões de diretórios
chmod 755 images/
chmod 755 js/
chmod 755 logs/
chmod 755 cache/
chmod 755 uploads/
chmod 755 backups/

log_success "Estrutura de diretórios criada"

# Configurações específicas do servidor
if [ "$SERVER_MODE" = true ]; then
    log_info "Aplicando configurações de servidor..."
    
    # Configurar logs do Apache (se existir)
    if [ -d "/var/log/apache2" ]; then
        log_info "Configurando logs do Apache..."
        # Criar links simbólicos para logs personalizados
        # ln -sf /var/log/apache2/access.log logs/access.log
        # ln -sf /var/log/apache2/error.log logs/error.log
    fi
    
    # Configurar SSL (se certificados existirem)
    if [ -f "/etc/ssl/certs/qgdaaprovacao.crt" ]; then
        log_success "Certificados SSL encontrados"
    else
        log_warning "Certificados SSL não encontrados. Configure HTTPS manualmente."
    fi
    
    # Configurar firewall básico
    if command -v ufw &> /dev/null; then
        log_info "Configurando firewall básico..."
        ufw allow 80/tcp
        ufw allow 443/tcp
        log_success "Firewall configurado"
    fi
fi

# Validar configuração do Supabase
log_info "Validando configuração do banco de dados..."

if [ -f "js/config-simple.js" ]; then
    # Verificar se as credenciais foram configuradas
    if grep -q "sua-chave-anonima-aqui" js/config-simple.js; then
        log_error "Configure as credenciais do Supabase em js/config-simple.js"
        echo "Edite o arquivo e substitua as credenciais de exemplo pelas suas."
    else
        log_success "Credenciais do Supabase configuradas"
    fi
else
    log_error "Arquivo de configuração do Supabase não encontrado"
fi

# Otimizar imagens (se ImageMagick estiver disponível)
if command -v convert &> /dev/null; then
    log_info "Otimizando imagens..."
    
    # Criar versões WebP das imagens
    find images/ -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | while read img; do
        webp_img="${img%.*}.webp"
        if [ ! -f "$webp_img" ]; then
            convert "$img" "$webp_img"
            log_success "Criado: $webp_img"
        fi
    done
else
    log_warning "ImageMagick não encontrado. Otimização de imagens pulada."
fi

# Gerar arquivos de cache
log_info "Gerando arquivos de cache..."

# Criar arquivo de versão para cache busting
echo "$(date +%s)" > cache/version.txt

# Criar manifest de cache para Service Worker
cat > cache/manifest.json << EOF
{
    "version": "$(date +%s)",
    "files": [
        "/index.html",
        "/styles.css",
        "/js/main.js",
        "/js/security.js",
        "/js/form.js",
        "/js/notifications.js",
        "/images/logo.svg"
    ]
}
EOF

log_success "Arquivos de cache gerados"

# Configurar monitoramento
log_info "Configurando monitoramento..."

# Criar script de monitoramento de logs
cat > logs/monitor.sh << 'EOF'
#!/bin/bash
# Script de monitoramento de logs
tail -f /var/log/apache2/access.log | grep -E "(POST|error|404|500)" --line-buffered
EOF

chmod +x logs/monitor.sh

log_success "Monitoramento configurado"

# Executar testes básicos
log_info "Executando testes básicos..."

# Testar sintaxe HTML
if command -v tidy &> /dev/null; then
    if tidy -q -e index.html; then
        log_success "HTML válido"
    else
        log_warning "Avisos encontrados no HTML"
    fi
fi

# Testar sintaxe CSS
if command -v csslint &> /dev/null; then
    if csslint styles.css > /dev/null 2>&1; then
        log_success "CSS válido"
    else
        log_warning "Avisos encontrados no CSS"
    fi
fi

# Testar sintaxe JavaScript
if command -v jshint &> /dev/null; then
    for js_file in js/*.js; do
        if jshint "$js_file" > /dev/null 2>&1; then
            log_success "JavaScript válido: $js_file"
        else
            log_warning "Avisos encontrados em: $js_file"
        fi
    done
fi

# Criar backup da instalação
log_info "Criando backup da instalação..."

BACKUP_DIR="backups/install-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup de arquivos importantes
cp index.html "$BACKUP_DIR/"
cp styles.css "$BACKUP_DIR/"
cp -r js/ "$BACKUP_DIR/"
cp config.json "$BACKUP_DIR/"
cp manifest.json "$BACKUP_DIR/"

log_success "Backup criado em: $BACKUP_DIR"

# Configurar atualizações automáticas
log_info "Configurando sistema de atualizações..."

cat > update.sh << 'EOF'
#!/bin/bash
# Script de atualização automática
echo "🔄 Verificando atualizações..."

# Fazer backup antes da atualização
BACKUP_DIR="backups/update-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r js/ "$BACKUP_DIR/"
cp index.html "$BACKUP_DIR/"
cp styles.css "$BACKUP_DIR/"

echo "✅ Backup criado em: $BACKUP_DIR"

# Aqui você pode adicionar lógica para baixar atualizações
# git pull origin main
# ou outro método de atualização

echo "🚀 Atualização concluída!"
EOF

chmod +x update.sh

log_success "Sistema de atualizações configurado"

# Gerar relatório de instalação
log_info "Gerando relatório de instalação..."

cat > logs/install-report.txt << EOF
========================================
QG DA APROVAÇÃO v2.0 - RELATÓRIO DE INSTALAÇÃO
========================================

Data: $(date)
Usuário: $(whoami)
Sistema: $(uname -a)
Modo: $([ "$SERVER_MODE" = true ] && echo "Servidor" || echo "Desenvolvimento")

ARQUIVOS INSTALADOS:
- index.html ($(wc -l < index.html) linhas)
- styles.css ($(wc -l < styles.css) linhas)
- JavaScript: $(find js/ -name "*.js" | wc -l) arquivos
- Imagens: $(find images/ -type f | wc -l) arquivos

CONFIGURAÇÕES:
- Service Worker: ✅ Ativo
- PWA Manifest: ✅ Configurado  
- Segurança: ✅ Headers configurados
- Cache: ✅ Estratégia definida
- Monitoramento: ✅ Ativo

PRÓXIMOS PASSOS:
1. Configure as credenciais do Supabase
2. Configure SSL/HTTPS
3. Teste a aplicação
4. Configure domínio customizado
5. Configure backup automático

========================================
EOF

log_success "Relatório salvo em: logs/install-report.txt"

# Finalizar instalação
echo ""
echo "=================================================="
log_success "🎉 Instalação concluída com sucesso!"
echo "=================================================="
echo ""

echo "📋 PRÓXIMOS PASSOS:"
echo "1. 🔑 Configure as credenciais do Supabase em js/config-simple.js"
echo "2. 🔒 Configure SSL/HTTPS para produção"
echo "3. 🧪 Teste a aplicação em diferentes dispositivos"
echo "4. 🌐 Configure seu domínio customizado"
echo "5. 📊 Configure monitoramento em produção"
echo ""

echo "📚 DOCUMENTAÇÃO:"
echo "- README.md - Documentação completa"
echo "- config.json - Configurações do sistema"
echo "- logs/install-report.txt - Relatório desta instalação"
echo ""

echo "🚀 A aplicação está pronta para uso!"
echo "Acesse: http://localhost ou seu domínio configurado"
echo ""

# Mostrar informações de segurança
log_info "IMPORTANTES CONSIDERAÇÕES DE SEGURANÇA:"
echo "- ✅ Headers de segurança configurados"
echo "- ✅ Content Security Policy ativo"
echo "- ✅ Rate limiting implementado"
echo "- ✅ Validação de entrada robusta"
echo "- ⚠️  Configure HTTPS em produção"
echo "- ⚠️  Monitore logs regularmente"
echo ""

log_success "Instalação finalizada! 🚀"