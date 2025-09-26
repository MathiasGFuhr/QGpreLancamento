# 🚀 Configuração do Formulário com Supabase

## 📋 Pré-requisitos

1. **Conta no Supabase**: [https://supabase.com](https://supabase.com)
2. **Projeto criado** no Supabase
3. **Tabela `lista_de_espera`** criada

## 🗄️ Estrutura da Tabela

Crie a tabela `lista_de_espera` no Supabase com os seguintes campos:

```sql
CREATE TABLE lista_de_espera (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## ⚙️ Configuração

### 1. Obter Credenciais do Supabase

1. Acesse seu projeto no Supabase
2. Vá em **Settings** > **API**
3. Copie:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)

### 2. Configurar no Código

Edite o arquivo `script.js` e substitua as linhas 3-4:

```javascript
const SUPABASE_URL = 'https://seu-projeto-id.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui';
```

### 3. Configurar Políticas RLS (Row Level Security)

No Supabase, vá em **Authentication** > **Policies** e crie uma política para permitir inserção:

```sql
-- Permitir inserção para todos (público)
CREATE POLICY "Permitir inserção pública" ON lista_de_espera
FOR INSERT WITH CHECK (true);
```

## 🧪 Testando

1. Abra o arquivo `index.html` no navegador
2. Preencha o formulário de cadastro
3. Verifique se os dados aparecem na tabela do Supabase

## 🔒 Segurança

- A chave anônima é **pública** e segura para uso no frontend
- O RLS (Row Level Security) controla o acesso aos dados
- Apenas inserção é permitida (não leitura/atualização)

## 🐛 Troubleshooting

### Erro: "Invalid API key"
- Verifique se a SUPABASE_URL e SUPABASE_ANON_KEY estão corretas

### Erro: "relation does not exist"
- Verifique se a tabela `lista_de_espera` foi criada

### Erro: "permission denied"
- Verifique se as políticas RLS estão configuradas corretamente

### Email duplicado
- O sistema detecta automaticamente emails duplicados
- Mostra mensagem amigável para o usuário

## 📊 Monitoramento

Acesse o Supabase Dashboard para:
- Ver os cadastros em tempo real
- Exportar dados
- Configurar notificações
- Analisar métricas
