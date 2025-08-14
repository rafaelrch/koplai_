# Configuração do Banco de Dados - Kanban

## Passos para configurar o banco de dados

### 1. Acessar o Supabase

1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Acesse o projeto: `oaxjdnvwwwkmcgcmsvhv`

### 2. Executar o Script SQL

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `create_kanban_tables.sql`
4. Clique em **Run** para executar o script

### 3. Verificar as Tabelas

Após executar o script, você deve ver:

#### Tabela `kanban_columns`:
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `color` (TEXT)
- `position` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabela `kanban_tasks`:
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `description` (TEXT)
- `column_id` (UUID, Foreign Key)
- `position` (INTEGER)
- `attachments` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 4. Dados Iniciais

O script também cria:
- 3 colunas padrão: "A Fazer", "Em Progresso", "Concluído"
- Algumas tarefas de exemplo

### 5. Políticas de Segurança (RLS)

O script configura políticas públicas para permitir:
- ✅ Leitura de colunas e tarefas
- ✅ Criação de colunas e tarefas
- ✅ Atualização de colunas e tarefas
- ✅ Exclusão de colunas e tarefas

### 6. Testar a Aplicação

1. Execute o projeto: `npm run dev`
2. Acesse a página do Kanban
3. Verifique se os dados estão sendo carregados do banco
4. Teste criar, editar e excluir tarefas e colunas

## Funcionalidades Implementadas

### ✅ CRUD de Colunas
- Criar nova coluna
- Editar coluna existente
- Excluir coluna
- Ordenar colunas por posição

### ✅ CRUD de Tarefas
- Criar nova tarefa
- Editar tarefa existente
- Excluir tarefa
- Mover tarefa entre colunas
- Ordenar tarefas por posição

### ✅ Funcionalidades Avançadas
- Anexos (links, imagens, vídeos)
- Busca de tarefas
- Drag and drop
- Persistência de dados
- Feedback visual (toasts)

## Estrutura do Banco

```
kanban_columns
├── id (UUID)
├── title (TEXT)
├── color (TEXT)
├── position (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

kanban_tasks
├── id (UUID)
├── title (TEXT)
├── description (TEXT)
├── column_id (UUID) → kanban_columns.id
├── position (INTEGER)
├── attachments (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Índices Criados

- `idx_kanban_tasks_column_id` - Para buscar tarefas por coluna
- `idx_kanban_tasks_position` - Para ordenar tarefas
- `idx_kanban_columns_position` - Para ordenar colunas

## Notas Importantes

1. **Backup**: Sempre faça backup antes de executar scripts SQL
2. **Teste**: Teste em ambiente de desenvolvimento primeiro
3. **Monitoramento**: Monitore os logs do Supabase para erros
4. **Performance**: Os índices ajudam na performance das consultas

## Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar permissões por usuário
- [ ] Implementar histórico de mudanças
- [ ] Adicionar notificações em tempo real
- [ ] Implementar backup automático
