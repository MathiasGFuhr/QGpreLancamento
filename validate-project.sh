#!/bin/bash

# ===== SCRIPT DE VALIDAÇÃO - QG DA APROVAÇÃO =====
# Script para validar se todos os conflitos foram resolvidos

echo "🔍 Validando projeto QG da Aprovação..."
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Contadores
ERRORS=0
WARNINGS=0
SUCCESS=0

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se arquivos existem
log_info "Verificando arquivos essenciais..."

REQUIRED_FILES=(
    "index.html"
    "styles.css"
    "js/main.js"
    "js/security.js"
    "js/form.js"
    "js/notifications.js"
    "js/config-simple.js"
    "manifest.json"
    "sw.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "Arquivo encontrado: $file"
    else
        log_error "Arquivo não encontrado: $file"
    fi
done

# Verificar sintaxe HTML
log_info "Verificando sintaxe HTML..."
if command -v tidy >/dev/null 2>&1; then
    if tidy -q -e index.html >/dev/null 2>&1; then
        log_success "HTML válido"
    else
        log_warning "HTML contém avisos menores"
    fi
else
    log_warning "Tidy não encontrado, pulando validação HTML"
fi

# Verificar CSS
log_info "Verificando CSS..."

# Verificar se variáveis CSS essenciais estão definidas
REQUIRED_CSS_VARS=(
    "--neutral-0:"
    "--gradient-gold:"
    "--space-4:"
    "--transition-normal:"
)

for var in "${REQUIRED_CSS_VARS[@]}"; do
    if grep "\-\-${var#--}" styles.css >/dev/null 2>&1; then
        log_success "Variável CSS encontrada: $var"
    else
        log_error "Variável CSS não encontrada: $var"
    fi
done

# Verificar se classes CSS essenciais estão definidas
REQUIRED_CSS_CLASSES=(
    ".floating-nav"
    ".benefit-card"
    ".hero"
    ".section"
    ".form-section"
)

for class in "${REQUIRED_CSS_CLASSES[@]}"; do
    if grep -q "^${class}[[:space:]]*{" styles.css; then
        log_success "Classe CSS encontrada: $class"
    else
        log_error "Classe CSS não encontrada: $class"
    fi
done

# Verificar JavaScript
log_info "Verificando JavaScript..."

# Verificar se não há referências a arquivos antigos
OLD_REFERENCES=(
    "form-secure.js"
    "main-secure.js"
    "notifications-secure.js"
)

for ref in "${OLD_REFERENCES[@]}"; do
    if grep -q "$ref" index.html; then
        log_error "Referência antiga encontrada: $ref"
    else
        log_success "Sem referência antiga: $ref"
    fi
done

# Verificar se classes HTML correspondem ao CSS
log_info "Verificando correspondência HTML-CSS..."

# Extrair classes do HTML
HTML_CLASSES=$(grep -o 'class="[^"]*"' index.html | sed 's/class="//g' | sed 's/"//g' | tr ' ' '\n' | sort | uniq)

# Verificar algumas classes importantes
IMPORTANT_CLASSES=(
    "floating-nav"
    "nav-container"
    "nav-logo"
    "nav-brand"
    "nav-menu"
    "nav-link"
    "cta-nav"
    "hero"
    "section"
    "section-light"
    "section-dark"
    "benefit-card"
    "benefit-icon"
    "benefit-title"
    "form-section"
)

for class in "${IMPORTANT_CLASSES[@]}"; do
    if echo "$HTML_CLASSES" | grep -q "^$class$"; then
        if grep -q "\.$class" styles.css; then
            log_success "Classe $class: HTML ↔ CSS ✓"
        else
            log_warning "Classe $class: HTML existe, CSS não encontrado"
        fi
    fi
done

# Verificar estrutura de diretórios
log_info "Verificando estrutura de diretórios..."

REQUIRED_DIRS=(
    "js"
    "images"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        log_success "Diretório encontrado: $dir"
    else
        log_error "Diretório não encontrado: $dir"
    fi
done

# Verificar imagens essenciais
log_info "Verificando imagens..."

REQUIRED_IMAGES=(
    "images/logo.svg"
    "images/mathiasFuhr.png"
)

for img in "${REQUIRED_IMAGES[@]}"; do
    if [ -f "$img" ]; then
        log_success "Imagem encontrada: $img"
    else
        log_error "Imagem não encontrada: $img"
    fi
done

# Verificar configurações
log_info "Verificando configurações..."

if [ -f "js/config-simple.js" ]; then
    if grep -q "sua-chave-anonima-aqui" js/config-simple.js; then
        log_warning "Credenciais do Supabase não configuradas"
    else
        log_success "Credenciais do Supabase configuradas"
    fi
fi

# Verificar Service Worker
log_info "Verificando Service Worker..."

if [ -f "sw.js" ]; then
    if grep -q "CACHE_NAME" sw.js; then
        log_success "Service Worker configurado"
    else
        log_warning "Service Worker pode estar incompleto"
    fi
fi

# Verificar PWA Manifest
log_info "Verificando PWA Manifest..."

if [ -f "manifest.json" ]; then
    if grep -q '"name"' manifest.json; then
        log_success "Manifest PWA configurado"
    else
        log_error "Manifest PWA incompleto"
    fi
fi

# Gerar relatório final
echo ""
echo "=================================================="
echo "📊 RELATÓRIO DE VALIDAÇÃO"
echo "=================================================="
echo ""

TOTAL=$((SUCCESS + WARNINGS + ERRORS))

echo "📈 Estatísticas:"
echo "  Total de verificações: $TOTAL"
echo -e "  ${GREEN}✅ Sucessos: $SUCCESS${NC}"
echo -e "  ${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
echo -e "  ${RED}❌ Erros: $ERRORS${NC}"
echo ""

if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$(( (SUCCESS * 100) / TOTAL ))
    echo "📊 Taxa de sucesso: $SUCCESS_RATE%"
else
    SUCCESS_RATE=0
fi

echo ""

# Status final
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 PROJETO PERFEITO! Todos os conflitos foram resolvidos.${NC}"
    EXIT_CODE=0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}✅ PROJETO OK! Apenas avisos menores encontrados.${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ PROJETO COM PROBLEMAS! $ERRORS erros encontrados.${NC}"
    EXIT_CODE=1
fi

echo ""
echo "📋 Próximos passos:"
if [ $ERRORS -gt 0 ]; then
    echo "1. Corrigir os erros encontrados"
    echo "2. Executar este script novamente"
fi
if [ $WARNINGS -gt 0 ]; then
    echo "1. Revisar os avisos (opcionais)"
fi
echo "2. Configurar credenciais do Supabase se necessário"
echo "3. Testar a aplicação no navegador"
echo "4. Fazer deploy para produção"

echo ""
echo "🚀 Relatório salvo em: validation-report.txt"

# Salvar relatório
cat > validation-report.txt << EOF
========================================
QG DA APROVAÇÃO - RELATÓRIO DE VALIDAÇÃO
========================================

Data: $(date)
Usuário: $(whoami)
Sistema: $(uname -a)

ESTATÍSTICAS:
- Total de verificações: $TOTAL
- Sucessos: $SUCCESS
- Avisos: $WARNINGS  
- Erros: $ERRORS
- Taxa de sucesso: $SUCCESS_RATE%

STATUS: $([ $ERRORS -eq 0 ] && echo "✅ OK" || echo "❌ PROBLEMAS")

ARQUIVOS VERIFICADOS:
$(for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done)

RECOMENDAÇÕES:
$([ $ERRORS -gt 0 ] && echo "- Corrigir erros encontrados")
$([ $WARNINGS -gt 0 ] && echo "- Revisar avisos")
- Configurar credenciais do Supabase
- Testar no navegador
- Deploy para produção

========================================
EOF

exit $EXIT_CODE