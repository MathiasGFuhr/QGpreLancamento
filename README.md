# QG da Aprovação - Landing Page de Pré-lançamento

Esta é uma landing page para criar uma lista de espera VIP para o lançamento do aplicativo "QG da Aprovação", uma plataforma de gerenciamento de estudos para concurseiros de carreiras policiais.

## Estrutura do Projeto

- `index.html` - Estrutura principal da página
- `styles.css` - Estilos e responsividade
- `script.js` - Funcionalidades do formulário de captura de e-mail
- `images/` - Diretório com imagens SVG utilizadas na página

## Funcionalidades

- Design responsivo para todos os dispositivos
- Formulário de captura de e-mail com validação
- Feedback visual para o usuário após envio do formulário
- Imagens vetoriais (SVG) para melhor desempenho e escalabilidade

## Como Usar

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em seu navegador para visualizar a página
3. Para implementar em produção, você precisará:
   - Configurar um backend para processar os e-mails capturados
   - Atualizar a função `saveEmail()` no arquivo `script.js` para enviar os dados para seu backend

## Personalização

### Cores

As cores principais estão definidas como variáveis CSS no início do arquivo `styles.css`:

```css
:root {
    --primary-color: #0A2240;    /* Azul Escuro/Marinho */
    --accent-color: #FFC107;     /* Dourado/Amarelo Forte */
    --bg-color: #FFFFFF;         /* Branco */
    --bg-alt-color: #F4F7FA;     /* Cinza muito claro */
    --text-color: #333333;       /* Texto principal */
    --text-light: #FFFFFF;       /* Texto claro */
}
```

### Fontes

O projeto utiliza as fontes Montserrat (para títulos) e Lato (para textos), importadas do Google Fonts.

## Próximos Passos

1. Integrar com um serviço de backend para armazenar os e-mails capturados
2. Adicionar análise de tráfego (Google Analytics ou similar)
3. Implementar testes A/B para otimizar a taxa de conversão
4. Adicionar compartilhamento em redes sociais

## Licença

Todos os direitos reservados © 2024 QG da Aprovação