# Migração: Separação de Links e Arquivos na Tabela kanban_tasks

## 📋 Objetivo
Separar os anexos em duas colunas distintas na tabela `kanban_tasks`:
- **`links`**: Para armazenar apenas links/URLs
- **`arquivos`**: Para armazenar apenas arquivos (imagens e vídeos)

## 🚀 Como Executar a Migração

### 1. Acesse o Supabase Dashboard
1. Vá para [supabase.com](https://supabase.com)
2. Acesse seu projeto
3. Navegue para **SQL Editor**

### 2. Execute o Script de Migração
1. Copie o conteúdo do arquivo `update_kanban_add_links_files_columns.sql`
2. Cole no SQL Editor do Supabase
3. Clique em **Run** para executar

### 3. Verifique a Migração
Após executar o script, verifique se:
- ✅ Colunas `links` e `arquivos` foram criadas
- ✅ Dados foram migrados corretamente da coluna `attachments`
- ✅ Índices foram criados para performance

## 📊 O que o Script Faz

### 1. Adiciona Novas Colunas
```sql
-- Adiciona coluna 'links' (JSONB)
ALTER TABLE kanban_tasks ADD COLUMN links JSONB DEFAULT '[]'::jsonb;

-- Adiciona coluna 'arquivos' (JSONB) 
ALTER TABLE kanban_tasks ADD COLUMN arquivos JSONB DEFAULT '[]'::jsonb;
```

### 2. Migra Dados Existentes
- **Links**: Move anexos com `type = 'link'` para a coluna `links`
- **Arquivos**: Move anexos com `type IN ('image', 'video')` para a coluna `arquivos`

### 3. Cria Índices para Performance
```sql
CREATE INDEX idx_kanban_tasks_links ON kanban_tasks USING GIN (links);
CREATE INDEX idx_kanban_tasks_arquivos ON kanban_tasks USING GIN (arquivos);
```

## 🔧 Estrutura Final das Colunas

### Tabela `kanban_tasks` - ANTES
```sql
attachments JSONB -- Todos os anexos juntos
```

### Tabela `kanban_tasks` - DEPOIS
```sql
links JSONB     -- Apenas links: [{"type": "link", "url": "...", "preview": "..."}]
arquivos JSONB  -- Apenas arquivos: [{"type": "image|video", "url": "...", "preview": "..."}]
attachments JSONB -- Mantido para compatibilidade durante transição
```

## 📝 Exemplos de Dados

### Coluna `links`
```json
[
  {
    "type": "link",
    "url": "https://www.google.com",
    "preview": "Google"
  },
  {
    "type": "link", 
    "url": "https://github.com/user/repo"
  }
]
```

### Coluna `arquivos`
```json
[
  {
    "type": "image",
    "url": "blob:http://localhost/abc123",
    "preview": "imagem.png"
  },
  {
    "type": "video",
    "url": "blob:http://localhost/def456", 
    "preview": "video.mp4"
  }
]
```

## 🎯 Benefícios da Separação

### 1. **Organização dos Dados**
- Links e arquivos ficam claramente separados
- Facilita consultas específicas por tipo
- Melhora a legibilidade do código

### 2. **Performance Melhorada**
- Índices GIN específicos para cada tipo
- Consultas mais eficientes
- Menos processamento para filtrar tipos

### 3. **Interface Mais Clara**
- Frontend pode tratar cada tipo distintamente
- Melhor experiência do usuário
- Facilita futuras funcionalidades específicas

## ⚠️ Notas Importantes

### 1. **Compatibilidade**
- A coluna `attachments` foi **mantida** para compatibilidade
- O frontend trabalha com ambas as estruturas durante a transição
- Possível remover `attachments` no futuro

### 2. **Testes Recomendados**
- Verificar se dados foram migrados corretamente
- Testar criação de novas tarefas
- Testar edição de tarefas existentes
- Verificar drag and drop

### 3. **Rollback (se necessário)**
Se precisar reverter:
```sql
-- Remover novas colunas (CUIDADO: perde dados!)
ALTER TABLE kanban_tasks DROP COLUMN IF EXISTS links;
ALTER TABLE kanban_tasks DROP COLUMN IF EXISTS arquivos;
```

## 🔍 Comandos de Verificação

### Verificar estrutura da tabela:
```sql
\d kanban_tasks
```

### Verificar dados migrados:
```sql
SELECT 
  id, title, 
  jsonb_array_length(COALESCE(links, '[]'::jsonb)) as total_links,
  jsonb_array_length(COALESCE(arquivos, '[]'::jsonb)) as total_arquivos,
  jsonb_array_length(COALESCE(attachments, '[]'::jsonb)) as total_attachments
FROM kanban_tasks 
WHERE links != '[]'::jsonb OR arquivos != '[]'::jsonb
LIMIT 10;
```

### Verificar índices criados:
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'kanban_tasks' 
AND indexname LIKE '%links%' OR indexname LIKE '%arquivos%';
```

## ✅ Checklist Pós-Migração

- [ ] Script executado sem erros
- [ ] Colunas `links` e `arquivos` criadas
- [ ] Dados migrados corretamente
- [ ] Índices criados
- [ ] Frontend funcionando normalmente
- [ ] Criação de tarefas OK
- [ ] Edição de tarefas OK
- [ ] Drag and drop OK

## 🆘 Suporte
Se encontrar problemas:
1. Verifique os logs do Supabase
2. Consulte a documentação do PostgreSQL sobre JSONB
3. Execute os comandos de verificação acima
4. Em caso de dúvidas, reverta as alterações e analise o erro
