# Configuração do Supabase para Kanban com Duas Visualizações

## 📋 Passos para Configurar o Banco de Dados

### 1. Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Acesse seu projeto
- Vá para **SQL Editor**

### 2. Execute o Script SQL
Copie e cole o conteúdo do arquivo `update_kanban_for_views.sql` no SQL Editor e execute.

### 3. Verifique a Execução
Após executar o script, você deve ver:
- ✅ Tabelas atualizadas com campo `view_type`
- ✅ Colunas criadas para "Tarefas do dia" e "Aprovação interna"
- ✅ Tarefas de exemplo inseridas
- ✅ Índices criados para performance

### 4. Verificar as Tabelas
Execute estas queries para verificar se tudo foi criado corretamente:

```sql
-- Verificar colunas criadas
SELECT title, color, position, view_type 
FROM kanban_columns 
ORDER BY view_type, position;

-- Verificar tarefas criadas
SELECT t.title, c.title as column_name, t.view_type 
FROM kanban_tasks t 
JOIN kanban_columns c ON t.column_id = c.id 
ORDER BY t.view_type, c.position;
```

## 🗂️ Estrutura das Tabelas

### Tabela `kanban_columns`
- `id` - UUID (chave primária)
- `title` - TEXT (nome da coluna)
- `color` - TEXT (cor da coluna)
- `position` - INTEGER (posição)
- `view_type` - TEXT ('daily' ou 'approval')
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### Tabela `kanban_tasks`
- `id` - UUID (chave primária)
- `title` - TEXT (título da tarefa)
- `description` - TEXT (descrição)
- `column_id` - UUID (referência à coluna)
- `position` - INTEGER (posição na coluna)
- `view_type` - TEXT ('daily' ou 'approval')
- `attachments` - JSONB (anexos)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

## 🎯 Visualizações Criadas

### "Tarefas do dia" (view_type: 'daily')
1. **A Fazer** - Azul (#3B82F6)
2. **Produzindo** - Laranja (#F59E0B)
3. **Em aprovação** - Rosa (#EC4899)
4. **Com o cliente** - Verde (#10B981)

### "Aprovação interna" (view_type: 'approval')
1. **Pendente** - Laranja (#F59E0B)
2. **Em revisão** - Roxo (#8B5CF6)
3. **Aprovado** - Verde (#10B981)
4. **Reprovado** - Vermelho (#EF4444)

## 🔧 Funcionalidades Implementadas

### ✅ Separação de Dados
- Cada visualização tem suas próprias colunas
- Tarefas são separadas por `view_type`
- Dados independentes para cada contexto

### ✅ Performance
- Índices criados para `view_type`
- Queries otimizadas por visualização
- Carregamento rápido de dados específicos

### ✅ Integridade
- Constraints para `view_type` ('daily' ou 'approval')
- Relacionamentos mantidos
- Dados consistentes

## 🚀 Próximos Passos

1. **Execute o script SQL** no Supabase
2. **Teste a aplicação** - as duas visualizações devem funcionar
3. **Verifique os dados** - cada visualização deve ter suas próprias tarefas
4. **Teste as funcionalidades** - criar, editar, excluir e mover tarefas

## 🐛 Solução de Problemas

### Erro 400 ao deletar tarefas
- ✅ Já corrigido no código
- Tarefas de exemplo são tratadas localmente
- Tarefas reais são deletadas do banco

### Dados não aparecem
- Verifique se o script SQL foi executado
- Confirme que as colunas foram criadas
- Verifique as políticas RLS

### Erro de conexão
- Verifique as credenciais do Supabase
- Confirme que o projeto está ativo
- Teste a conexão no dashboard
