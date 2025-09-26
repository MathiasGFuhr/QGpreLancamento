# 🗄️ COMANDOS SQL PARA SUPABASE

## 📋 **Recriar a Tabela `lista_de_espera` do Zero**

Execute estes comandos no **SQL Editor** do seu Supabase Dashboard:

### **1. Deletar a Tabela Existente:**
```sql
DROP TABLE IF EXISTS lista_de_espera CASCADE;
```

### **2. Criar a Tabela Nova:**
```sql
CREATE TABLE lista_de_espera (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **3. Habilitar RLS (Row Level Security):**
```sql
ALTER TABLE lista_de_espera ENABLE ROW LEVEL SECURITY;
```

### **4. Criar Política para Permitir Inserção Pública:**
```sql
CREATE POLICY "Permitir inserção pública" ON lista_de_espera
FOR INSERT WITH CHECK (true);
```

### **5. Verificar se a Tabela foi Criada:**
```sql
SELECT * FROM lista_de_espera;
```

## 🎯 **Estrutura da Tabela:**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGSERIAL | Chave primária (auto-incremento) |
| `nome` | TEXT | Nome do usuário (obrigatório) |
| `email` | TEXT | Email do usuário (obrigatório, único) |
| `created_at` | TIMESTAMPTZ | Data de criação (automática) |

## ✅ **Após Executar os Comandos:**

1. **Teste o formulário** na landing page
2. **Verifique os dados** na tabela `lista_de_espera`
3. **Deve funcionar** sem erros

## 🚨 **Se Der Erro:**

- **"relation already exists"**: Execute o comando `DROP TABLE` primeiro
- **"policy already exists"**: A política já existe, pule para o passo 5
- **"permission denied"**: Verifique se você tem permissões de administrador
- **"CASCADE"**: Remove dependências automaticamente

## 🎉 **Resultado Esperado:**

Após executar os comandos, o formulário deve funcionar perfeitamente e salvar os dados na tabela `lista_de_espera`!
